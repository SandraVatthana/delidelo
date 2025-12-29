'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Types
type GameStep = 'intro' | 'game' | 'result'
type Action = 'tarte' | 'bisou'

interface Profile {
  id: string
  name: string
  age: number
  quote: string
  description: string
  redFlag?: string
  category: 'classique' | 'ghost' | 'red_flag' | 'love_bomber' | 'cas_particulier' | 'bonus'
}

interface Result {
  profileId: string
  action: Action
  category: string
}

interface TarteProfile {
  id: string
  icon: string
  name: string
  description: string
  crushIdeal: string
}

// Les profils à tarter
const profiles: Profile[] = [
  // Classiques du dating
  {
    id: 'kevin',
    name: 'Kevin',
    age: 29,
    quote: '"Je suis pas comme les autres mecs"',
    description: 'Spoiler : il est exactement comme les autres mecs.',
    redFlag: 'Photo torse nu dans la salle de bain, miroir sale.',
    category: 'classique'
  },
  {
    id: 'lea',
    name: 'Léaaaaaa',
    age: 26,
    quote: 'Répond "mdr" à tout. TOUT.',
    description: '- "Mon père est mort" - "mdr"\n- "Je t\'aime" - "mdr"\n- "Tu veux qu\'on se voit ?" - "mdr"',
    category: 'classique'
  },
  {
    id: 'julien',
    name: 'Julien',
    age: 34,
    quote: 'T\'envoie des vocaux de 4 minutes.',
    description: 'Pour dire "ok".\n\nPersonne n\'a le temps, Julien. PERSONNE.',
    category: 'classique'
  },
  {
    id: 'theo',
    name: 'Théo',
    age: 28,
    quote: 'Premier message : "T\'es quel signe ?"',
    description: 'Signe que cette conversation va nulle part, Théo.',
    category: 'classique'
  },
  {
    id: 'marine',
    name: 'Marine',
    age: 31,
    quote: '"J\'aime rire et voyager"',
    description: 'WOW. Incroyable. Personne d\'autre n\'aime rire et voyager.\nTu es UNIQUE, Marine.',
    category: 'classique'
  },
  {
    id: 'maxime',
    name: 'Maxime',
    age: 27,
    quote: '"Salut ça va ?" x3',
    description: 'À 3 personnes différentes en même temps.\n\nL\'effort est palpable.',
    category: 'classique'
  },
  // Ghosts
  {
    id: 'antoine',
    name: 'Antoine',
    age: 32,
    quote: 'Conversation passionnante pendant 3 jours.',
    description: 'Puis plus rien.\nIl est pas mort, il poste des stories.\n\nStatut : Schrödinger\'s boyfriend',
    category: 'ghost'
  },
  {
    id: 'chloe',
    name: 'Chloé',
    age: 29,
    quote: '"Je suis pas prête pour une relation"',
    description: 'En couple 2 semaines plus tard.\n\nElle était prête. Juste pas avec toi. Désolé.',
    category: 'ghost'
  },
  {
    id: 'romain',
    name: 'Romain',
    age: 35,
    quote: 'Ghoste après un super date.',
    description: 'Réapparaît 6 mois plus tard :\n"Hey ! Ça fait longtemps 😊"\n\nNon Romain. Non.',
    category: 'ghost'
  },
  // Red Flags
  {
    id: 'bryan',
    name: 'Bryan',
    age: 30,
    quote: '"Toutes mes ex sont des folles"',
    description: 'Le point commun de toutes tes ex, c\'est toi, Bryan.\nRéfléchis.',
    category: 'red_flag'
  },
  {
    id: 'sophie',
    name: 'Sophie',
    age: 28,
    quote: 'Te demande ton salaire au 2ème message.',
    description: 'Pas pour l\'amour.\nPour le budget.',
    category: 'red_flag'
  },
  {
    id: 'nicolas',
    name: 'Nicolas',
    age: 33,
    quote: '"T\'es belle. Pour une brune."',
    description: 'Le compliment qui est en fait une insulte qui est en fait un red flag géant.',
    category: 'red_flag'
  },
  {
    id: 'lucas',
    name: 'Lucas',
    age: 31,
    quote: 'Vérifie ton téléphone pendant le date.',
    description: '"C\'est qui ce mec qui a liké ta photo ?"\n\nC\'est mon cousin, Lucas.\nEt c\'est notre PREMIER date.',
    category: 'red_flag'
  },
  // Love Bombers
  {
    id: 'thomas',
    name: 'Thomas',
    age: 29,
    quote: '"T\'es la femme de ma vie"',
    description: 'On se parle depuis 24h.\n\nMême Netflix met plus de temps à te recommander une série, Thomas.',
    category: 'love_bomber'
  },
  {
    id: 'emma',
    name: 'Emma',
    age: 27,
    quote: '"Je nous vois déjà mariés avec 3 enfants"',
    description: 'On a matché il y a 2 heures.\n\nEmma. Respire.\nOn n\'a même pas échangé nos prénoms.',
    category: 'love_bomber'
  },
  // Cas particuliers
  {
    id: 'alex',
    name: 'Alex',
    age: 30,
    quote: 'Photo de profil : son chien. x3',
    description: 'Bio : "Demande-moi des photos de mon chien"\n\nAlex, t\'es là pour matcher ou pour faire adopter ton chien ?',
    category: 'cas_particulier'
  },
  {
    id: 'camille',
    name: 'Camille',
    age: 26,
    quote: '"Je suis pas sur cette app souvent"',
    description: '"Ajoute-moi sur Insta @camille_xyz"\n\nTraduction : je veux des followers, pas un date.',
    category: 'cas_particulier'
  },
  {
    id: 'pierre',
    name: 'Pierre',
    age: 45,
    quote: '"Âge : 29 ans"',
    description: 'Clairement pas 29 ans.\n\nPierre, on a des yeux.\nEt des mathématiques.',
    category: 'cas_particulier'
  },
  {
    id: 'sarah',
    name: 'Sarah',
    age: 28,
    quote: 'Toutes ses photos sont avec son ex.',
    description: 'Coupé. Mais on voit quand même le bras.\n\nLe bras de la honte, Sarah.\nOn sait tous ce que c\'est.',
    category: 'cas_particulier'
  },
  // Bonus
  {
    id: 'toi_meme',
    name: 'Toi',
    age: 0, // Will be replaced
    quote: 'T\'as swipé à droite sur 47 personnes aujourd\'hui sans lire un seul profil.',
    description: 'T\'as ghosté au moins 3 personnes "parce que t\'avais la flemme".\n\nT\'es pas mieux que les autres.\nEt c\'est OK.',
    category: 'bonus'
  },
]

// Phrases après une tarte
const tartePhrases = [
  "C'était satisfaisant, non ?",
  "Cette tarte était méritée.",
  "Splat. Justice.",
  "La crème de la justice.",
  "Un petit tartage et ça repart.",
  "Thérapie à 0€.",
  "Tu te sens mieux ?",
  "C'est ça le self-care.",
  "Tarte-thérapie : approuvée.",
  "Y'avait de la tension, là.",
  "Libérateur.",
  "On juge pas. On comprend.",
  "Cette personne l'avait cherché.",
  "La violence, c'est mal. Sauf en tarte.",
  "Ça fait du bien, hein ?",
]

// Phrases après un bisou
const bisouPhrases = [
  "Romantique !",
  "Tu vois le bon en chacun.",
  "Cœur sur toi.",
  "L'amour vaincra.",
  "Bisou stratégique ou sincère ?",
  "Tu pardonnes facilement.",
  "Aw, c'est mignon.",
  "On y croit !",
]

// Profils de résultat
const tarteProfiles: TarteProfile[] = [
  {
    id: 'justicier_dating',
    icon: '🎯',
    name: 'Le Justicier du Dating',
    description: 'Tu tolères pas les conneries. C\'est bien. Le monde a besoin de gens comme toi.',
    crushIdeal: 'Quelqu\'un d\'honnête et direct. (Et qui répond pas "mdr" à tout.)'
  },
  {
    id: 'chasseur_ghosts',
    icon: '👻',
    name: 'Le Chasseur de Ghosts',
    description: 'Tu as été blessé(e) par le silence. On te comprend. Le ghost, c\'est nul.',
    crushIdeal: 'Quelqu\'un qui répond. Juste... qui répond. C\'est pas compliqué pourtant.'
  },
  {
    id: 'anti_love_bomber',
    icon: '💣',
    name: 'L\'Anti Love Bomber',
    description: 'Tu aimes prendre ton temps. Pas de pression, pas de "je t\'aime" au bout de 2 jours.',
    crushIdeal: 'Quelqu\'un qui sait que l\'amour, ça se construit. (Pas quelqu\'un qui a déjà prévu le prénom des enfants.)'
  },
  {
    id: 'allergique_effort',
    icon: '😴',
    name: 'L\'Allergique à l\'Effort',
    description: 'Tu veux de la substance. De la personnalité. Pas un copié-collé envoyé à 50 personnes.',
    crushIdeal: 'Quelqu\'un qui a lu ton profil. (La barre est basse et pourtant.)'
  },
  {
    id: 'bisounours_universel',
    icon: '🧘',
    name: 'Le Bisounours Universel',
    description: 'Tu tartes personne ou presque. Soit t\'es très tolérant(e), soit t\'as peur du conflit. Ou alors t\'es juste quelqu\'un de bien.',
    crushIdeal: 'N\'importe qui, apparemment.'
  },
  {
    id: 'tarteur_fou',
    icon: '🌪️',
    name: 'Le Tarteur Fou',
    description: 'Tu as tarté tout le monde. Même toi-même. C\'était cathartique ? On espère que ça va mieux maintenant.',
    crushIdeal: 'Personne, apparemment. (Prends un chien ?)'
  },
  {
    id: 'lucide',
    icon: '🪞',
    name: 'Le Lucide',
    description: 'Tu as osé te tarter toi-même. C\'est de l\'auto-dérision. C\'est de la maturité. C\'est sexy, en fait.',
    crushIdeal: 'Quelqu\'un qui sait rire de lui-même aussi.'
  },
]

// Fonction de calcul du profil
const getTarteProfile = (results: Result[]): TarteProfile => {
  const tartes = results.filter(r => r.action === 'tarte')
  const bisous = results.filter(r => r.action === 'bisou')

  // Le Tarteur Fou
  if (tartes.length >= results.length * 0.9) {
    return tarteProfiles.find(p => p.id === 'tarteur_fou')!
  }

  // Le Bisounours Universel
  if (bisous.length >= results.length * 0.8) {
    return tarteProfiles.find(p => p.id === 'bisounours_universel')!
  }

  // Le Lucide (s'est tarté lui-même)
  if (tartes.find(t => t.profileId === 'toi_meme')) {
    return tarteProfiles.find(p => p.id === 'lucide')!
  }

  // Calculer la catégorie la plus tartée
  const categoryCount: Record<string, number> = {}
  tartes.forEach(t => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1
  })

  const topCategory = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  switch (topCategory) {
    case 'ghost':
      return tarteProfiles.find(p => p.id === 'chasseur_ghosts')!
    case 'love_bomber':
      return tarteProfiles.find(p => p.id === 'anti_love_bomber')!
    case 'red_flag':
      return tarteProfiles.find(p => p.id === 'justicier_dating')!
    case 'classique':
      return tarteProfiles.find(p => p.id === 'allergique_effort')!
    default:
      return tarteProfiles.find(p => p.id === 'justicier_dating')!
  }
}

export default function LaTartePage() {
  const router = useRouter()
  const [step, setStep] = useState<GameStep>('intro')
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [results, setResults] = useState<Result[]>([])
  const [showAnimation, setShowAnimation] = useState<'tarte' | 'bisou' | null>(null)
  const [randomPhrase, setRandomPhrase] = useState('')
  const [shuffledProfiles, setShuffledProfiles] = useState<Profile[]>([])
  const [userAge, setUserAge] = useState(25)

  // Mélanger les profils au démarrage
  useEffect(() => {
    const age = parseInt(localStorage.getItem('userAge') || '25')
    setUserAge(age)

    const shuffled = [...profiles]
      .map(p => p.id === 'toi_meme' ? { ...p, age } : p)
      .sort(() => Math.random() - 0.5)
    setShuffledProfiles(shuffled)
  }, [])

  const currentProfile = shuffledProfiles[currentProfileIndex]
  const isGameOver = currentProfileIndex >= shuffledProfiles.length

  const handleAction = (action: Action) => {
    if (!currentProfile) return

    // Enregistrer le résultat
    setResults(prev => [...prev, {
      profileId: currentProfile.id,
      action,
      category: currentProfile.category
    }])

    // Afficher l'animation
    setShowAnimation(action)
    setRandomPhrase(
      action === 'tarte'
        ? tartePhrases[Math.floor(Math.random() * tartePhrases.length)]
        : bisouPhrases[Math.floor(Math.random() * bisouPhrases.length)]
    )

    // Passer au profil suivant après l'animation
    setTimeout(() => {
      setShowAnimation(null)
      if (currentProfileIndex + 1 >= shuffledProfiles.length) {
        setStep('result')
      } else {
        setCurrentProfileIndex(prev => prev + 1)
      }
    }, 1500)
  }

  const resultProfile = step === 'result' ? getTarteProfile(results) : null
  const tartesCount = results.filter(r => r.action === 'tarte').length
  const bisousCount = results.filter(r => r.action === 'bisou').length

  // Stats par catégorie
  const categoryStats = results.reduce((acc, r) => {
    if (!acc[r.category]) {
      acc[r.category] = { tartes: 0, bisous: 0 }
    }
    if (r.action === 'tarte') acc[r.category].tartes++
    else acc[r.category].bisous++
    return acc
  }, {} as Record<string, { tartes: number; bisous: number }>)

  const categoryLabels: Record<string, string> = {
    ghost: 'Les ghosteurs',
    love_bomber: 'Les love bombers',
    red_flag: 'Les red flags',
    classique: 'Les classiques',
    cas_particulier: 'Les cas particuliers',
    bonus: 'Toi-même'
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="bg-pattern" />

      <style jsx>{`
        @keyframes tarteFly {
          0% {
            transform: translateX(-100px) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          70% {
            transform: translateX(0) rotate(720deg) scale(1.2);
          }
          100% {
            transform: translateX(0) rotate(720deg) scale(1);
          }
        }
        @keyframes splat {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
        @keyframes bisouFloat {
          0% {
            transform: scale(0) rotate(-20deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(10deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        .tarte-animation {
          animation: tarteFly 0.6s ease-out forwards;
        }
        .splat-animation {
          animation: splat 0.4s ease-out forwards;
        }
        .bisou-animation {
          animation: bisouFloat 0.6s ease-out forwards;
        }
        .profile-card {
          background: rgba(255, 255, 255, 0.05);
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .action-btn {
          padding: 20px 40px;
          font-size: 1.2rem;
          font-weight: bold;
          border-radius: 50px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .action-btn:hover {
          transform: scale(1.05);
        }
        .action-btn:active {
          transform: scale(0.95);
        }
        .btn-tarte {
          background: linear-gradient(135deg, #FF6600 0%, #FF3131 100%);
          color: white;
          border: 3px solid #FF6600;
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.4);
        }
        .btn-bisou {
          background: linear-gradient(135deg, #FF00FF 0%, #FF69B4 100%);
          color: white;
          border: 3px solid #FF00FF;
          box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
        }
        .cream-splat {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 150px;
          z-index: 10;
        }
        .result-bar {
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }
        .result-fill {
          height: 100%;
          border-radius: 6px;
        }
      `}</style>

      {/* Header */}
      <header className="p-4">
        <div className="h-1 bg-gradient-to-r from-[#FF6600] via-[#FF00FF] to-[#FFFF00] mb-4" />
        <div className="flex items-center justify-between">
          <Link href="/games" className="text-white/60 hover:text-white transition flex items-center gap-2">
            <span>←</span>
            <span className="text-sm">Retour</span>
          </Link>
          <div className="logo-90s text-xl">
            <span className="text-2xl mr-2">🥧</span>
            La Tarte
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Progress bar (game step only) */}
      {step === 'game' && !isGameOver && (
        <div className="px-5 mb-4">
          <div className="flex items-center justify-between text-sm text-white/60 mb-2">
            <span>Profil {currentProfileIndex + 1}/{shuffledProfiles.length}</span>
            <span>🥧 {tartesCount} | 💋 {bisousCount}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6600] to-[#FF00FF] transition-all duration-300"
              style={{ width: `${((currentProfileIndex + 1) / shuffledProfiles.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-5 pb-8 max-w-2xl mx-auto w-full flex flex-col">

        {/* INTRO */}
        {step === 'intro' && (
          <div className="py-8 flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6 animate-pulse filter drop-shadow-[0_0_30px_#FF6600]">🥧</div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{ fontFamily: 'Bangers, cursive', color: '#FF6600', textShadow: '0 0 20px #FF6600, 3px 3px 0 #FFFF00' }}
              >
                LA TARTE
              </h1>
              <p className="text-white/80 text-lg mb-2">
                Le jeu où tu peux <span className="text-[#FF6600] font-bold">ENFIN</span> te venger.
              </p>
              <p className="text-white/60">
                Virtuellement. Légalement. Joyeusement.
              </p>
            </div>

            <div className="card-90s p-6 mb-8">
              <p className="text-white/80 text-center mb-4">
                On te montre des profils. Tu choisis :
              </p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">💋</div>
                  <div className="text-[#FF00FF] font-bold">EMBRASSER</div>
                </div>
                <div className="text-center text-white/30 text-2xl">ou</div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🥧</div>
                  <div className="text-[#FF6600] font-bold">TARTER</div>
                </div>
              </div>
            </div>

            <div
              className="p-4 rounded-xl text-center mb-8"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)' }}
            >
              <p className="text-white/50 text-sm">
                (Aucun vrai humain ne sera blessé.
                <br />
                Juste des égos virtuels.)
              </p>
            </div>

            <button
              onClick={() => setStep('game')}
              className="btn-cta-primary w-full justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #FF6600 0%, #FF3131 100%)' }}
            >
              🥧 C'est parti !
            </button>
          </div>
        )}

        {/* GAME */}
        {step === 'game' && currentProfile && (
          <div className="py-4 flex-1 flex flex-col">
            {/* Profile Card */}
            <div className="profile-card flex-1 flex flex-col justify-center relative">
              {/* Animation overlay */}
              {showAnimation && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 rounded-xl">
                  {showAnimation === 'tarte' ? (
                    <>
                      <div className="tarte-animation text-9xl">🥧</div>
                      <div className="absolute cream-splat splat-animation">💥</div>
                    </>
                  ) : (
                    <div className="bisou-animation text-9xl">💋</div>
                  )}
                  <div className="absolute bottom-8 text-center">
                    <p className="text-white text-lg font-bold" style={{ textShadow: '0 0 10px black' }}>
                      {randomPhrase}
                    </p>
                  </div>
                </div>
              )}

              {/* Profile content */}
              <div className={showAnimation ? 'opacity-30' : ''}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">👤</div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'Bangers, cursive', color: '#FFFF00', textShadow: '0 0 10px #FFFF00' }}
                  >
                    {currentProfile.name.toUpperCase()}, {currentProfile.id === 'toi_meme' ? userAge : currentProfile.age} ANS
                  </h2>
                </div>

                <div className="text-center mb-6">
                  <p className="text-[#FF00FF] text-xl font-bold mb-4 italic">
                    {currentProfile.quote}
                  </p>
                  <p className="text-white/80 whitespace-pre-line">
                    {currentProfile.description}
                  </p>
                </div>

                {currentProfile.redFlag && (
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.3)' }}
                  >
                    <span className="text-[#FF3131] text-sm">
                      🚩 Red flag : {currentProfile.redFlag}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleAction('bisou')}
                disabled={showAnimation !== null}
                className="action-btn btn-bisou flex-1 justify-center"
              >
                💋 Embrasser
              </button>
              <button
                onClick={() => handleAction('tarte')}
                disabled={showAnimation !== null}
                className="action-btn btn-tarte flex-1 justify-center"
              >
                🥧 Tarter
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === 'result' && resultProfile && (
          <div className="py-6">
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm mb-2">🥧 RÉSULTATS DE TA SESSION TARTAGE</p>
              <div className="flex justify-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-3xl">🥧</div>
                  <div className="text-[#FF6600] font-bold text-2xl">{tartesCount}</div>
                  <div className="text-white/50 text-xs">tartes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl">💋</div>
                  <div className="text-[#FF00FF] font-bold text-2xl">{bisousCount}</div>
                  <div className="text-white/50 text-xs">bisous</div>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div
              className="p-6 rounded-xl text-center mb-6"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '3px solid #FF6600',
                boxShadow: '0 0 30px rgba(255, 102, 0, 0.3)'
              }}
            >
              <div className="text-6xl mb-4">{resultProfile.icon}</div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'Bangers, cursive', color: '#FF6600', textShadow: '0 0 15px #FF6600' }}
              >
                {resultProfile.name}
              </h2>
              <p className="text-white/80 mb-6">
                {resultProfile.description}
              </p>
              <div
                className="p-4 rounded-lg"
                style={{ background: 'rgba(255, 0, 255, 0.1)', border: '1px solid rgba(255, 0, 255, 0.3)' }}
              >
                <p className="text-[#FF00FF] text-sm font-bold mb-1">💕 Ton crush idéal :</p>
                <p className="text-white/70 text-sm">{resultProfile.crushIdeal}</p>
              </div>
            </div>

            {/* Category stats */}
            <div className="card-90s p-5 mb-6">
              <h3 className="text-[#FFFF00] font-bold mb-4" style={{ textShadow: '0 0 10px #FFFF00' }}>
                📊 TES CIBLES PRÉFÉRÉES
              </h3>
              <div className="space-y-3">
                {Object.entries(categoryStats)
                  .sort((a, b) => b[1].tartes - a[1].tartes)
                  .map(([category, stats]) => {
                    const total = stats.tartes + stats.bisous
                    const tartePct = (stats.tartes / total) * 100
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/80 text-sm">{categoryLabels[category] || category}</span>
                          <span className="text-sm">
                            {stats.tartes > 0 && <span className="text-[#FF6600]">{stats.tartes}🥧</span>}
                            {stats.tartes > 0 && stats.bisous > 0 && ' '}
                            {stats.bisous > 0 && <span className="text-[#FF00FF]">{stats.bisous}💋</span>}
                          </span>
                        </div>
                        <div className="result-bar">
                          <div
                            className="result-fill"
                            style={{
                              width: `${tartePct}%`,
                              background: tartePct > 50
                                ? 'linear-gradient(90deg, #FF6600, #FF3131)'
                                : 'linear-gradient(90deg, #FF00FF, #FF69B4)'
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* What it says about you */}
            <div
              className="p-4 rounded-xl mb-6"
              style={{ background: 'rgba(0, 255, 255, 0.1)', border: '2px solid rgba(0, 255, 255, 0.3)' }}
            >
              <p className="text-[#00FFFF] text-sm font-bold mb-2">💡 CE QUE ÇA DIT DE TOI</p>
              <div className="text-white/70 text-sm">
                <p>
                  <span className="text-white font-bold">Tu valorises :</span>{' '}
                  {resultProfile.id === 'chasseur_ghosts' && 'La communication, la présence'}
                  {resultProfile.id === 'anti_love_bomber' && 'La patience, le respect du rythme'}
                  {resultProfile.id === 'justicier_dating' && 'L\'honnêteté, le respect'}
                  {resultProfile.id === 'allergique_effort' && 'L\'originalité, l\'effort'}
                  {resultProfile.id === 'bisounours_universel' && 'La tolérance, l\'ouverture'}
                  {resultProfile.id === 'tarteur_fou' && 'La justice... violente'}
                  {resultProfile.id === 'lucide' && 'L\'auto-dérision, la lucidité'}
                </p>
                <p>
                  <span className="text-white font-bold">Tu détestes :</span>{' '}
                  {resultProfile.id === 'chasseur_ghosts' && 'Le silence, l\'abandon'}
                  {resultProfile.id === 'anti_love_bomber' && 'La pression, les gens intenses'}
                  {resultProfile.id === 'justicier_dating' && 'Les red flags, le bullshit'}
                  {resultProfile.id === 'allergique_effort' && 'La paresse, les messages génériques'}
                  {resultProfile.id === 'bisounours_universel' && 'Pas grand chose apparemment'}
                  {resultProfile.id === 'tarteur_fou' && 'Tout le monde'}
                  {resultProfile.id === 'lucide' && 'Les gens qui se prennent au sérieux'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Je suis ${resultProfile.name} sur GameCrush !`,
                      text: `J'ai tarté ${tartesCount} personnes et embrassé ${bisousCount}. ${resultProfile.description}`,
                      url: window.location.href
                    })
                  }
                }}
                className="btn-cta-primary w-full justify-center"
                style={{ background: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)' }}
              >
                🔗 Partager mes résultats
              </button>
              <button
                onClick={() => {
                  setStep('intro')
                  setCurrentProfileIndex(0)
                  setResults([])
                  const shuffled = [...profiles]
                    .map(p => p.id === 'toi_meme' ? { ...p, age: userAge } : p)
                    .sort(() => Math.random() - 0.5)
                  setShuffledProfiles(shuffled)
                }}
                className="btn-cta-primary w-full justify-center"
                style={{ background: 'linear-gradient(135deg, #FF6600 0%, #FF3131 100%)' }}
              >
                🎮 Rejouer
              </button>
              <button
                onClick={() => router.push('/games')}
                className="w-full text-center text-white/50 text-sm py-3 hover:text-white/80 transition"
              >
                ← Retour aux jeux
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-3 text-center border-t border-white/10">
              <p className="text-white/30 text-xs">
                🥧 La Tarte est un jeu humoristique et cathartique.
                <br />
                Les profils sont fictifs. Si tu te reconnais, c'est peut-être un signe.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
