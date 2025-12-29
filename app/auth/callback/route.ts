import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const onboarding = requestUrl.searchParams.get('onboarding')

  if (code) {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Rediriger vers l'onboarding si c'est une inscription
  if (onboarding === 'true') {
    return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
  }

  // Sinon rediriger vers le dashboard
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
