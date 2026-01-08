'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient, demoMode } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptCGU, setAcceptCGU] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  // Validation du mot de passe
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }
  const isPasswordValid = Object.values(passwordChecks).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isPasswordValid) {
      setError('Le mot de passe ne respecte pas les critères')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (!acceptCGU) {
      setError('Tu dois accepter les conditions d\'utilisation')
      return
    }

    if (pseudo.length < 3) {
      setError('Le pseudo doit faire au moins 3 caractères')
      return
    }

    setIsLoading(true)

    // Mode démo
    if (demoMode) {
      localStorage.setItem('userPseudo', pseudo)
      localStorage.setItem('onboardingComplete', 'false')
      setTimeout(() => {
        router.push('/onboarding')
      }, 500)
      return
    }

    // Production: Supabase
    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Configuration Supabase manquante')
      setIsLoading(false)
      return
    }

    try {
      // 1. Créer le compte auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { pseudo }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé')
        } else {
          setError(authError.message)
        }
        setIsLoading(false)
        return
      }

      if (authData.user) {
        // 2. Créer le profil utilisateur
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            pseudo,
            bonbons: 10,
            billes: 0
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        // Sauvegarder le pseudo localement
        localStorage.setItem('userPseudo', pseudo)

        // Rediriger vers onboarding
        router.push('/onboarding')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Une erreur est survenue. Réessaie.')
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    setError('')
    if (step === 1) {
      if (!email) {
        setError('Entre ton email')
        return
      }
      if (!isPasswordValid) {
        setError('Le mot de passe ne respecte pas les critères')
        return
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas')
        return
      }
      setStep(2)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setIsGoogleLoading(true)

    // Mode démo
    if (demoMode) {
      setTimeout(() => {
        router.push('/onboarding')
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
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
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
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : router.push('/')}
            className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
          >
            ← Retour
          </button>
          {/* Progress bar */}
          <div className="flex gap-2">
            <div className={`w-10 h-2 border-2 ${step >= 1 ? 'bg-[#FF00FF] border-[#FF00FF]' : 'border-white/30'}`} />
            <div className={`w-10 h-2 border-2 ${step >= 2 ? 'bg-[#39FF14] border-[#39FF14]' : 'border-white/30'}`} />
          </div>
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
              {step === 1 ? '🎮 Crée ton compte' : '✨ Choisis ton pseudo'}
            </p>
          </div>

          {/* Formulaire */}
          <div className="card-90s pink p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
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

                    {/* Critères mot de passe */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        { check: passwordChecks.length, label: '8+ caractères' },
                        { check: passwordChecks.uppercase, label: '1 majuscule' },
                        { check: passwordChecks.lowercase, label: '1 minuscule' },
                        { check: passwordChecks.number, label: '1 chiffre' },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-xs font-bold ${
                            item.check ? 'text-[#39FF14]' : 'text-white/40'
                          }`}
                        >
                          <span>{item.check ? '✓' : '○'}</span>
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirmer mot de passe */}
                  <div>
                    <label className="block text-sm font-bold text-[#FF00FF] mb-2 uppercase tracking-wide">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-90s"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-[#FF3131] mt-2 font-bold">
                        ⚠️ Les mots de passe ne correspondent pas
                      </p>
                    )}
                    {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                      <p className="text-xs text-[#39FF14] mt-2 font-bold">
                        ✓ Parfait !
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {/* Pseudo */}
                  <div>
                    <label className="block text-sm font-bold text-[#FF00FF] mb-2 uppercase tracking-wide">
                      Ton pseudo de joueur
                    </label>
                    <input
                      type="text"
                      value={pseudo}
                      onChange={(e) => setPseudo(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                      className="input-90s"
                      placeholder="PlayerOne"
                      maxLength={20}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-white/60 mt-2">
                      3-20 caractères, lettres, chiffres et _ uniquement
                    </p>
                  </div>

                  {/* Preview pseudo */}
                  {pseudo.length >= 3 && (
                    <div className="p-4 bg-[#330066] border-2 border-[#FF00FF] text-center">
                      <p className="text-white/60 text-sm mb-2">Tu apparaîtras comme :</p>
                      <p className="text-2xl text-[#FF00FF] font-bold" style={{ textShadow: '0 0 10px #FF00FF' }}>
                        {pseudo}
                      </p>
                    </div>
                  )}

                  {/* CGU */}
                  <div className="flex items-start gap-3 p-4 bg-[#1A0033] border-2 border-white/20">
                    <input
                      type="checkbox"
                      id="cgu"
                      checked={acceptCGU}
                      onChange={(e) => setAcceptCGU(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-[#FF00FF]"
                    />
                    <label htmlFor="cgu" className="text-sm text-white/80">
                      J'accepte les{' '}
                      <Link href="/cgu" className="text-[#00FFFF] hover:text-[#FFFF00] transition">
                        conditions d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link href="/privacy" className="text-[#00FFFF] hover:text-[#FFFF00] transition">
                        politique de confidentialité
                      </Link>
                    </label>
                  </div>
                </>
              )}

              {/* Erreur */}
              {error && (
                <div className="p-3 bg-[#FF3131]/20 border-2 border-[#FF3131] text-[#FF3131] text-sm font-bold">
                  {error}
                </div>
              )}

              {/* Boutons */}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className="btn-cta-primary w-full justify-center"
                >
                  Continuer ➜
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !acceptCGU || pseudo.length < 3}
                  className="btn-cta-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    '🎠 Créer mon compte'
                  )}
                </button>
              )}
            </form>

            {step === 1 && (
              <>
                {/* Séparateur */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent" />
                  <span className="text-sm text-white/60 font-bold">ou</span>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-[#FF00FF] to-transparent" />
                </div>

                {/* Inscription Google */}
                <button
                  onClick={handleGoogleSignUp}
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
                      S'inscrire avec Google
                    </>
                  )}
                </button>
              </>
            )}

            {/* Lien connexion */}
            <p className="text-center text-white/80 mt-6 font-bold">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-[#FF00FF] hover:text-[#FFFF00] transition" style={{ textShadow: '0 0 10px #FF00FF' }}>
                Se connecter
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
