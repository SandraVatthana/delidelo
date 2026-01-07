// Supabase Edge Function - Tarte du Jour
// A executer quotidiennement a minuit via un cron job
// Selectionne la tarte avec le plus de reactions des dernieres 24h

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Reset previous Tarte du Jour
    const { error: resetError } = await supabase
      .from('tartes')
      .update({ is_tarte_du_jour: false })
      .eq('is_tarte_du_jour', true)

    if (resetError) {
      console.error('Error resetting tarte du jour:', resetError)
    }

    // 2. Get the tarte with most reactions from the last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data: tartes, error: fetchError } = await supabase
      .from('tartes')
      .select('id, reactions_bienmerite, reactions_solidaire, reactions_mdr, reactions_pareil')
      .eq('is_public', true)
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw new Error(`Error fetching tartes: ${fetchError.message}`)
    }

    if (!tartes || tartes.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No tartes found in the last 24 hours',
          tarteDuJour: null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate total reactions and find the winner
    const tartesWithTotal = tartes.map(t => ({
      ...t,
      totalReactions: t.reactions_bienmerite + t.reactions_solidaire + t.reactions_mdr + t.reactions_pareil
    }))

    const winner = tartesWithTotal.reduce((best, current) =>
      current.totalReactions > best.totalReactions ? current : best
    )

    // 3. Set the winner as Tarte du Jour
    const { error: updateError } = await supabase
      .from('tartes')
      .update({ is_tarte_du_jour: true })
      .eq('id', winner.id)

    if (updateError) {
      throw new Error(`Error setting tarte du jour: ${updateError.message}`)
    }

    // 4. Award badge to the winner (optional)
    const { data: tarteData } = await supabase
      .from('tartes')
      .select('user_id')
      .eq('id', winner.id)
      .single()

    if (tarteData?.user_id) {
      // Check if user already has the badge for today
      const today = new Date().toISOString().split('T')[0]

      await supabase
        .from('tarte_badges')
        .upsert({
          user_id: tarteData.user_id,
          badge_type: 'tarte_du_jour',
          unlocked_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,badge_type'
        })

      // Also award "roi_de_la_tarte" badge if 10+ tarte du jour
      const { count } = await supabase
        .from('tartes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', tarteData.user_id)
        .eq('is_tarte_du_jour', true)

      if (count && count >= 10) {
        await supabase
          .from('tarte_badges')
          .upsert({
            user_id: tarteData.user_id,
            badge_type: 'legende',
            unlocked_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,badge_type'
          })
      }
    }

    console.log(`Tarte du Jour selected: ${winner.id} with ${winner.totalReactions} reactions`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tarte du Jour selected successfully',
        tarteDuJour: {
          id: winner.id,
          totalReactions: winner.totalReactions
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in tarte-du-jour function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
