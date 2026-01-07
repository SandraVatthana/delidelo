import { createBrowserClient } from '@supabase/ssr'

// Vérifie si Supabase est configuré
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured =
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'your_supabase_url' &&
  supabaseKey !== 'your_supabase_anon_key' &&
  supabaseUrl.startsWith('http')

export function createClient() {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase non configuré - Mode démo activé')
    return null
  }
  return createBrowserClient(supabaseUrl!, supabaseKey!)
}

// Client singleton pour le browser
let browserClient: ReturnType<typeof createBrowserClient> | null = null
let initialized = false

export function getSupabaseClient() {
  if (!initialized) {
    browserClient = createClient()
    initialized = true
  }
  return browserClient
}

// Mock pour le mode démo
export const demoMode = !isSupabaseConfigured
