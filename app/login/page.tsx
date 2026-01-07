'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient, demoMode } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Mode démo
    if (demoMode) {
      setTimeout(() => {
        if (email && password) {
          router.push('/dashboard')
        } else {
          setError('Email ou mot de passe incorrect')
        }
        setIsLoading(false)
      }, 1000)
      return
    }

    // Production: Supabase Auth
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Configuration Supabase manquante')
      setIsLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : authError.message)
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setIsGoogleLoading(true)

    // Mode démo
    if (demoMode) {
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
      return
    }

    // Production: Supabase OAuth
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Configuration Supabase manquante')
      setIsGoogleLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      {/* Header */}
      <header className="px-4 py-4">
        <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
          >
            ← Retour
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4 animate-pulse filter drop-shadow-[0_0_30px_#FF00FF]">🎠</div>
            <h1 className="logo-90s justify-center text-4xl mb-2">Déli Délo</h1>
            <p className="text-[#00FFFF] font-bold" style={{ textShadow: '0 0 10px #00FFFF' }}>
              Ravi de te revoir !
            </p>
          </div>

          {/* Formulaire */}
          <div className="card-90s pink p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[#FF00FF] mb-2 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-90s"
                  placeholder="ton@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-bold text-[#FF00FF] mb-2 uppercase tracking-wide">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-90s pr-12"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Mot de passe oublié */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#00FFFF] hover:text-[#FFFF00] transition font-bold"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Erreur */}
              {error && (
                <div className="p-3 bg-[#FF3131]/20 border-2 border-[#FF3131] text-[#FF3131] text-sm font-bold">
                  {error}
                </div>
              )}

              {/* Bouton connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-cta-primary w-full justify-center"
              >
                {isLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  '🎮 Se connecter'
                )}
              </button>
            </form>

            {/* Séparateur */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent" />
              <span className="text-sm text-white/60 font-bold">ou</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent" />
            </div>

            {/* Connexion Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="btn-cta-secondary w-full justify-center"
            >
              {isGoogleLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </>
              )}
            </button>

            {/* Lien inscription */}
            <p className="text-center text-white/80 mt-6 font-bold">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-[#FF00FF] hover:text-[#FFFF00] transition" style={{ textShadow: '0 0 10px #FF00FF' }}>
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Badge confiance */}
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <span className="badge-90s badge-outline text-xs">🇫🇷 IA Mistral</span>
            <span className="badge-90s badge-outline text-xs">🔒 RGPD</span>
          </div>
        </div>
      </main>
    </div>
  )
}
