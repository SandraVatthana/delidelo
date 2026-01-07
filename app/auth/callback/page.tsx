'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseClient, demoMode } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      // En mode demo, rediriger simplement
      if (demoMode) {
        const next = searchParams.get('next') || '/dashboard'
        router.push(next)
        return
      }

      const supabase = getSupabaseClient()
      if (!supabase) {
        setError('Configuration Supabase manquante')
        return
      }

      // Récupérer le code d'autorisation de l'URL
      const code = searchParams.get('code')

      if (code) {
        try {
          // Échanger le code contre une session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Erreur échange code:', exchangeError)
            setError(exchangeError.message)
            return
          }

          // Vérifier si on a une session
          const { data: { session } } = await supabase.auth.getSession()

          if (session) {
            // Déterminer la destination
            const next = searchParams.get('next') || '/dashboard'
            router.push(next)
          } else {
            setError('Session non créée')
          }
        } catch (err) {
          console.error('Erreur callback:', err)
          setError('Erreur lors de la connexion')
        }
      } else {
        // Pas de code, vérifier si on a déjà une session (refresh)
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          const next = searchParams.get('next') || '/dashboard'
          router.push(next)
        } else {
          // Rediriger vers login si pas de session
          router.push('/login')
        }
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A0033]">
        <div className="text-center p-8 border-2 border-[#FF3131] bg-[#FF3131]/10 max-w-md mx-4">
          <p className="text-[#FF3131] font-bold text-xl mb-4">Erreur de connexion</p>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-[#FF00FF] text-white font-bold hover:bg-[#FF00FF]/80 transition"
          >
            Retourner à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A0033]">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">🎠</div>
        <p className="text-[#FF00FF] font-bold text-xl" style={{ textShadow: '0 0 10px #FF00FF' }}>
          Connexion en cours...
        </p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#1A0033]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🎠</div>
          <p className="text-[#FF00FF] font-bold text-xl" style={{ textShadow: '0 0 10px #FF00FF' }}>
            Chargement...
          </p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
