'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Types
type Mode = 'love' | 'friends' | 'crew'
type Step = 'welcome' | 'age' | 'mode' | 'profile' | 'safety' | 'ready'

interface ModeConfig {
  id: Mode
  icon: string
  title: string
  subtitle: string
  description: string
  color: string
  gradient: string
  games: string[]
  features: string[]
}

const modes: ModeConfig[] = [
  {
    id: 'love',
    icon: '💕',
    title: 'Love',
    subtitle: 'Je veux flirter',
    description: 'Rencontre des personnes compatibles à travers des jeux révélateurs. Fini les conversations vides, place aux vraies connexions !',
    color: '#FF00FF',
    gradient: 'linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%)',
    games: ['Le Manège', 'La Marelle', 'Poésie', 'Dirty Dancing'],
    features: ['Profils compatibles mis en avant', 'Jeux romantiques exclusifs', 'Bonbons à envoyer à tes crushs'],
  },
  {
    id: 'friends',
    icon: '🤝',
    title: 'Friends',
    subtitle: 'Je veux des potes',
    description: 'Trouve ton crew, des gens avec qui délirer. Zéro pression romantique, que du fun et des soirées mémorables !',
    color: '#00FFFF',
    gradient: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)',
    games: ['Action ou Vérité', 'Les Goonies', 'Quiz 80s', 'Jeux barges'],
    features: ['Groupes de discussion', 'Défis entre potes', 'Soirées thématiques'],
  },
  {
    id: 'crew',
    icon: '🎉',
    title: 'Crew',
    subtitle: 'Je veux des events',
    description: 'Organise ou rejoins des soirées IRL. Jeux de société, karaoké, escape games... Rencontre des gens autour d\'activités fun !',
    color: '#FF6600',
    gradient: 'linear-gradient(135deg, #FF6600 0%, #FFB347 100%)',
    games: ['Escape Game', 'Karaoké', 'Retro Gaming', 'Jeux de société'],
    features: ['Créer des events IRL', 'Réserver des tables', 'Jeux brise-glace sur place'],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
  const [pseudo, setPseudo] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userPseudo') || ''
    }
    return ''
  })
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' })
  const [city, setCity] = useState('')
  const [ageError, setAgeError] = useState('')
  const [safetyAccepted, setSafetyAccepted] = useState(false)

  // Calcul de l'âge
  const calculateAge = () => {
    if (!birthDate.day || !birthDate.month || !birthDate.year) return null
    const today = new Date()
    const birth = new Date(parseInt(birthDate.year), parseInt(birthDate.month) - 1, parseInt(birthDate.day))
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const userAge = calculateAge()

  const selectedModeConfig = modes.find(m => m.id === selectedMode)

  const handleSelectMode = (mode: Mode) => {
    setSelectedMode(mode)
  }

  const handleContinue = () => {
    if (step === 'welcome') {
      setStep('age')
    } else if (step === 'age') {
      if (userAge !== null && userAge >= 21) {
        setAgeError('')
        setStep('mode')
      } else if (userAge !== null && userAge < 21) {
        setAgeError('Déli Délo est reserve aux 21 ans et plus.')
      }
    } else if (step === 'mode' && selectedMode) {
      setStep('profile')
    } else if (step === 'profile' && city) {
      setStep('safety')
    } else if (step === 'safety' && safetyAccepted) {
      // Sauvegarder dans localStorage
      localStorage.setItem('userMode', selectedMode || 'love')
      localStorage.setItem('userPseudo', pseudo)
      localStorage.setItem('userAge', String(userAge))
      localStorage.setItem('userCity', city)
      localStorage.setItem('onboardingComplete', 'true')
      setStep('ready')
    } else if (step === 'ready') {
      router.push('/dashboard')
    }
  }

  const canContinue = () => {
    if (step === 'welcome') return true
    if (step === 'age') return birthDate.day && birthDate.month && birthDate.year
    if (step === 'mode') return selectedMode !== null
    if (step === 'profile') return city !== ''
    if (step === 'safety') return safetyAccepted
    if (step === 'ready') return true
    return false
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="bg-pattern" />

      <style jsx>{`
        .mode-card {
          position: relative;
          padding: 24px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .mode-card:hover {
          transform: translateY(-4px);
        }
        .mode-card.selected {
          border-width: 4px;
        }
        .step-indicator {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 24px;
        }
        .step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all 0.3s;
        }
        .step-dot.active {
          background: #FF00FF;
          box-shadow: 0 0 10px #FF00FF;
        }
        .step-dot.completed {
          background: #39FF14;
        }
        .game-tag {
          display: inline-block;
          padding: 4px 12px;
          font-size: 0.75rem;
          font-weight: bold;
          border-radius: 20px;
          margin: 4px;
        }
        .input-onboarding {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .input-onboarding:focus {
          outline: none;
          border-color: #FF00FF;
          box-shadow: 0 0 15px #FF00FF40;
        }
        .input-onboarding::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .input-onboarding option {
          background: #1A0033;
          color: white;
        }
      `}</style>

      {/* Header */}
      <header className="p-4">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14] mb-4" />
        <div className="text-center">
          <Link href="/" className="logo-90s text-2xl inline-block">
            <span className="animate-spin inline-block text-xl mr-2">🎠</span>
            Déli Délo
          </Link>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`step-dot ${step === 'welcome' ? 'active' : 'completed'}`} />
        <div className={`step-dot ${step === 'age' ? 'active' : ['mode', 'profile', 'safety', 'ready'].includes(step) ? 'completed' : ''}`} />
        <div className={`step-dot ${step === 'mode' ? 'active' : ['profile', 'safety', 'ready'].includes(step) ? 'completed' : ''}`} />
        <div className={`step-dot ${step === 'profile' ? 'active' : ['safety', 'ready'].includes(step) ? 'completed' : ''}`} />
        <div className={`step-dot ${step === 'safety' ? 'active' : step === 'ready' ? 'completed' : ''}`} />
        <div className={`step-dot ${step === 'ready' ? 'active' : ''}`} />
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pb-12" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>

        {/* Step 1: Welcome */}
        {step === 'welcome' && (
          <div className="text-center py-8 flex flex-col items-center justify-center">
            <div className="text-8xl mb-6 animate-pulse filter drop-shadow-[0_0_30px_#FF00FF]">🎠</div>
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: 'Bangers, cursive', color: '#FF00FF', textShadow: '0 0 20px #FF00FF, 3px 3px 0 #00FFFF' }}
            >
              Bienvenue !
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Ici, on ne commence pas par "Salut ça va ?",
              <br />
              <span className="text-[#FFFF00] font-bold" style={{ textShadow: '0 0 10px #FFFF00' }}>
                on commence par un jeu.
              </span>
            </p>

            <div className="card-90s p-6 mb-8 text-center max-w-md">
              <h3 className="text-[#00FFFF] font-bold mb-4" style={{ textShadow: '0 0 10px #00FFFF' }}>
                Comment ça marche ?
              </h3>
              <ul className="space-y-4 text-white/80">
                <li className="flex flex-col items-center gap-2">
                  <span className="text-3xl">🎮</span>
                  <span>Tu joues à des jeux fun et révélateurs</span>
                </li>
                <li className="flex flex-col items-center gap-2">
                  <span className="text-3xl">🎭</span>
                  <span>Tu découvres les personnalités des autres</span>
                </li>
                <li className="flex flex-col items-center gap-2">
                  <span className="text-3xl">💕</span>
                  <span>Tu matches avec ceux qui te correspondent vraiment</span>
                </li>
              </ul>
            </div>

            <p className="text-white/50 text-sm mb-6">
              Moins de swipes, plus de vraies vibes.
            </p>
          </div>
        )}

        {/* Step 2: Age Verification */}
        {step === 'age' && (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🔞</div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'Bangers, cursive', color: '#FF00FF', textShadow: '0 0 15px #FF00FF' }}
              >
                Verification d'age
              </h2>
              <p className="text-white/60">
                Déli Délo est reserve aux <span className="text-[#FFFF00] font-bold">21 ans et plus</span>.
              </p>
            </div>

            <div className="max-w-sm w-full">
              <label className="text-white/60 text-sm mb-3 block text-center">
                Quelle est ta date de naissance ?
              </label>

              <div className="flex gap-3 mb-4">
                {/* Jour */}
                <select
                  value={birthDate.day}
                  onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
                  className="input-onboarding flex-1"
                >
                  <option value="">Jour</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* Mois */}
                <select
                  value={birthDate.month}
                  onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
                  className="input-onboarding flex-1"
                >
                  <option value="">Mois</option>
                  {['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>

                {/* Annee */}
                <select
                  value={birthDate.year}
                  onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                  className="input-onboarding flex-1"
                >
                  <option value="">Annee</option>
                  {Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - 21 - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {ageError && (
                <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(255, 0, 0, 0.2)', border: '1px solid #FF3131' }}>
                  <p className="text-[#FF3131] text-sm text-center">
                    {ageError}
                  </p>
                </div>
              )}

              {userAge !== null && userAge >= 21 && (
                <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid #39FF14' }}>
                  <p className="text-[#39FF14] text-sm text-center">
                    {userAge} ans - C'est bon, tu peux continuer !
                  </p>
                </div>
              )}
            </div>

            <div
              className="mt-8 p-4 max-w-sm mx-auto text-center"
              style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}
            >
              <p className="text-white/50 text-xs">
                🔒 Pourquoi 21 ans minimum ?
              </p>
              <p className="text-white/40 text-xs mt-2">
                Pour garantir un public mature et des echanges de qualite.
                C'est ce qui fait la difference Déli Délo.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Mode Selection */}
        {step === 'mode' && (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'Bangers, cursive', color: '#FFFF00', textShadow: '0 0 15px #FFFF00' }}
              >
                Tu cherches quoi ?
              </h2>
              <p className="text-white/60">
                Choisis ton mode. Tu peux changer quand tu veux !
              </p>
            </div>

            <div className="space-y-4">
              {modes.map(mode => (
                <div
                  key={mode.id}
                  onClick={() => handleSelectMode(mode.id)}
                  className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
                  style={{
                    borderColor: selectedMode === mode.id ? mode.color : 'rgba(255,255,255,0.2)',
                    boxShadow: selectedMode === mode.id ? `0 0 30px ${mode.color}50` : 'none',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: mode.gradient }}
                    >
                      {mode.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className="text-xl font-bold"
                          style={{ color: mode.color, textShadow: `0 0 10px ${mode.color}` }}
                        >
                          {mode.title}
                        </h3>
                        <span className="text-white/60 text-sm">— {mode.subtitle}</span>
                      </div>
                      <p className="text-white/70 text-sm mb-3">
                        {mode.description}
                      </p>

                      {/* Games preview */}
                      <div className="flex flex-wrap gap-1">
                        {mode.games.slice(0, 3).map(game => (
                          <span
                            key={game}
                            className="game-tag"
                            style={{ background: `${mode.color}20`, color: mode.color, border: `1px solid ${mode.color}40` }}
                          >
                            {game}
                          </span>
                        ))}
                        {mode.games.length > 3 && (
                          <span className="game-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                            +{mode.games.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Check */}
                    {selectedMode === mode.id && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ background: mode.color, color: '#1A0033' }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-white/40 text-xs mt-6">
              💡 Ton profil n'apparaît que dans le mode que tu choisis.
              <br />
              Pas de mélange entre amitié et romance !
            </p>
          </div>
        )}

        {/* Step 4: Profile */}
        {step === 'profile' && selectedModeConfig && (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
                style={{ background: selectedModeConfig.gradient }}
              >
                {selectedModeConfig.icon}
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'Bangers, cursive', color: selectedModeConfig.color, textShadow: `0 0 15px ${selectedModeConfig.color}` }}
              >
                Mode {selectedModeConfig.title}
              </h2>
              <p className="text-white/60">
                Créons ton profil {selectedModeConfig.id === 'love' ? 'Crush' : selectedModeConfig.id === 'friends' ? 'Pote' : 'Event'}
              </p>
            </div>

            <div className="space-y-4 max-w-md w-full">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Tu es près de quelle grande ville ?</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-onboarding"
                >
                  <option value="">Sélectionne ta ville</option>
                  <option value="Paris">Paris</option>
                  <option value="Lyon">Lyon</option>
                  <option value="Marseille">Marseille</option>
                  <option value="Bordeaux">Bordeaux</option>
                  <option value="Toulouse">Toulouse</option>
                  <option value="Lille">Lille</option>
                  <option value="Nantes">Nantes</option>
                  <option value="Nice">Nice</option>
                  <option value="Strasbourg">Strasbourg</option>
                  <option value="Montpellier">Montpellier</option>
                  <option value="Bayonne">Bayonne</option>
                  <option value="La Rochelle">La Rochelle</option>
                  <option value="Rennes">Rennes</option>
                  <option value="Toulon">Toulon</option>
                  <option value="Reims">Reims</option>
                  <option value="Saint-Étienne">Saint-Étienne</option>
                  <option value="Le Havre">Le Havre</option>
                  <option value="Grenoble">Grenoble</option>
                  <option value="Dijon">Dijon</option>
                  <option value="Angers">Angers</option>
                  <option value="Nîmes">Nîmes</option>
                  <option value="Clermont-Ferrand">Clermont-Ferrand</option>
                  <option value="Brest">Brest</option>
                  <option value="Tours">Tours</option>
                  <option value="Limoges">Limoges</option>
                  <option value="Metz">Metz</option>
                  <option value="Perpignan">Perpignan</option>
                  <option value="nowhere">Aucune, j'habite dans le trou du c. du monde</option>
                </select>
              </div>

              {userAge && (
                <div className="text-center text-white/40 text-sm mt-2">
                  {userAge} ans
                </div>
              )}
            </div>

            {/* Features preview */}
            <div
              className="mt-8 p-4 max-w-md mx-auto"
              style={{ border: `2px dashed ${selectedModeConfig.color}40`, background: `${selectedModeConfig.color}05` }}
            >
              <p className="text-xs text-white/40 uppercase mb-3">Ce qui t'attend en mode {selectedModeConfig.title}</p>
              <ul className="space-y-2">
                {selectedModeConfig.features.map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                    <span style={{ color: selectedModeConfig.color }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Step 5: Safety */}
        {step === 'safety' && (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🛡️</div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'Bangers, cursive', color: '#00FFFF', textShadow: '0 0 15px #00FFFF' }}
              >
                Ta sécurité, notre priorité
              </h2>
              <p className="text-white/60">
                Avant de jouer, quelques règles d'or.
              </p>
            </div>

            <div className="max-w-md w-full space-y-6">
              {/* Règle 1 */}
              <div className="p-5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💬</span>
                  <div className="text-left">
                    <h4 className="text-white font-bold text-sm mb-2">Reste sur l'app</h4>
                    <p className="text-white/50 text-xs">Discute uniquement sur Déli Délo. On peut t'aider en cas de souci.</p>
                  </div>
                </div>
              </div>

              {/* Règle 2 */}
              <div className="p-5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🚫</span>
                  <div className="text-left">
                    <h4 className="text-white font-bold text-sm mb-2">Pas de coordonnées perso</h4>
                    <p className="text-white/50 text-xs">Ne partage pas ton numéro, adresse ou réseaux sociaux trop vite.</p>
                  </div>
                </div>
              </div>

              {/* Règle 3 */}
              <div className="p-5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🚩</span>
                  <div className="text-left">
                    <h4 className="text-white font-bold text-sm mb-2">Signale les comportements suspects</h4>
                    <p className="text-white/50 text-xs">Un truc te met mal à l'aise ? Signale, on agit vite.</p>
                  </div>
                </div>
              </div>

              {/* Règle 4 */}
              <div className="p-5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📍</span>
                  <div className="text-left">
                    <h4 className="text-white font-bold text-sm mb-2">Premier RDV = lieu public</h4>
                    <p className="text-white/50 text-xs">Toujours en public, dis à un proche où tu vas.</p>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div
                className="p-5 rounded-lg mt-8 cursor-pointer transition"
                style={{
                  background: safetyAccepted ? 'rgba(57, 255, 20, 0.1)' : 'rgba(255,255,255,0.03)',
                  border: safetyAccepted ? '2px solid #39FF14' : '2px solid rgba(255,255,255,0.2)'
                }}
                onClick={() => setSafetyAccepted(!safetyAccepted)}
              >
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-sm"
                    style={{
                      background: safetyAccepted ? '#39FF14' : 'transparent',
                      border: safetyAccepted ? 'none' : '2px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    {safetyAccepted && '✓'}
                  </div>
                  <span className="text-white text-sm">J'ai lu et compris les conseils de sécurité</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Ready */}
        {step === 'ready' && selectedModeConfig && (
          <div className="text-center py-8">
            <div className="text-8xl mb-6 animate-pulse">🎉</div>
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: 'Bangers, cursive', color: '#39FF14', textShadow: '0 0 20px #39FF14' }}
            >
              T'es prêt(e) !
            </h2>
            <p className="text-white/80 text-lg mb-2">
              Bienvenue <span className="text-[#FF00FF] font-bold">{pseudo}</span> !
            </p>
            <p className="text-white/60 mb-8">
              Mode <span style={{ color: selectedModeConfig.color, fontWeight: 'bold' }}>{selectedModeConfig.title}</span> activé à {city}
            </p>

            <div
              className="card-90s p-6 mb-8 max-w-md mx-auto"
              style={{ borderColor: selectedModeConfig.color }}
            >
              <h3 className="font-bold mb-4" style={{ color: selectedModeConfig.color }}>
                🎮 Tes premiers jeux
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedModeConfig.games.map(game => (
                  <span
                    key={game}
                    className="game-tag text-sm"
                    style={{ background: `${selectedModeConfig.color}20`, color: selectedModeConfig.color, border: `1px solid ${selectedModeConfig.color}` }}
                  >
                    {game}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-90s p-4 max-w-md mx-auto mb-8">
              <p className="text-white/60 text-sm">
                💡 <strong className="text-[#FFFF00]">Astuce :</strong> Commence par le {selectedModeConfig.id === 'love' ? 'Manège' : selectedModeConfig.id === 'friends' ? 'Quiz' : 'premier Event'} pour te faire la main !
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <footer className="p-5 bg-[#1A0033]/80 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            className="btn-cta-primary w-full justify-center text-lg"
            style={{
              opacity: canContinue() ? 1 : 0.5,
              cursor: canContinue() ? 'pointer' : 'not-allowed',
              background: selectedModeConfig?.gradient || undefined,
            }}
          >
            {step === 'welcome' && "C'est parti ! 🚀"}
            {step === 'age' && (userAge && userAge >= 21 ? 'Continuer' : 'Verifier mon age')}
            {step === 'mode' && selectedMode && `Continuer en mode ${modes.find(m => m.id === selectedMode)?.title}`}
            {step === 'mode' && !selectedMode && 'Choisis un mode'}
            {step === 'profile' && 'Continuer'}
            {step === 'safety' && (safetyAccepted ? 'J\'ai compris, on joue !' : 'Accepte les regles')}
            {step === 'ready' && '🎮 Jouer maintenant !'}
          </button>

          {step !== 'welcome' && (
            <button
              onClick={() => {
                if (step === 'age') setStep('welcome')
                if (step === 'mode') setStep('age')
                if (step === 'profile') setStep('mode')
                if (step === 'safety') setStep('profile')
                if (step === 'ready') setStep('safety')
              }}
              className="w-full text-center text-white/50 text-sm mt-3 hover:text-white/80 transition"
            >
              ← Retour
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
