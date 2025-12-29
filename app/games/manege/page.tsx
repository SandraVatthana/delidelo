'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Questions du mode Manège
const manegeQuestions = [
  {
    id: 1,
    emoji: '🚩',
    question: 'C\'est quoi ton red flag absolu ?',
  },
  {
    id: 2,
    emoji: '🏠',
    question: 'Ton dimanche parfait, c\'est quoi ?',
  },
  {
    id: 3,
    emoji: '🎵',
    question: 'La musique qui te met de bonne humeur ?',
  },
  {
    id: 4,
    emoji: '🌟',
    question: 'Ta plus grande qualité selon tes proches ?',
  },
  {
    id: 5,
    emoji: '💭',
    question: 'Ce qui te fait le plus rêver ?',
  },
]

// Candidats fictifs (anonymisés)
const mockCandidates = [
  {
    id: 'a',
    label: 'Joueur A',
    answers: [
      'Les gens qui ne disent jamais merci.',
      'Grasse mat\' + brunch entre amis',
      'Du jazz ou de la soul',
      'Mon humour douteux',
      'Vivre au bord de la mer',
    ],
    name: 'Alex',
    age: 27,
    city: 'Lyon',
    avatar: '👩‍🦰',
  },
  {
    id: 'b',
    label: 'Joueur B',
    answers: [
      'Le manque d\'humour. Si on peut pas rire ensemble...',
      'Rando + bonne bouffe',
      'Rock indé ou électro chill',
      'Ma curiosité maladive',
      'Monter ma propre boîte',
    ],
    name: 'Sam',
    age: 29,
    city: 'Paris',
    avatar: '👨‍🦱',
  },
  {
    id: 'c',
    label: 'Joueur C',
    answers: [
      'Les gens qui n\'assument pas leurs erreurs.',
      'Séries + plaid + chocolat',
      'Pop des années 80-90',
      'Mon écoute et ma patience',
      'Apprendre une nouvelle langue',
    ],
    name: 'Charlie',
    age: 26,
    city: 'Bordeaux',
    avatar: '🧑',
  },
]

interface Hearts {
  [candidateId: string]: number
}

type Phase = 'intro' | 'questions' | 'reveal' | 'results'

export default function ManegePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [hearts, setHearts] = useState<Hearts>({
    a: 0,
    b: 0,
    c: 0,
  })
  const [revealed, setRevealed] = useState<string[]>([])
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleHeart = (candidateId: string) => {
    setHearts(prev => ({
      ...prev,
      [candidateId]: prev[candidateId] > 0 ? 0 : 1,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < manegeQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setPhase('reveal')
    }
  }

  const revealCandidate = (candidateId: string) => {
    if (!revealed.includes(candidateId)) {
      setRevealed(prev => [...prev, candidateId])
    }
  }

  const selectMatch = async (candidateId: string) => {
    setSelectedMatch(candidateId)
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setPhase('results')
  }

  const question = manegeQuestions[currentQuestion]
  const sortedCandidates = [...mockCandidates].sort(
    (a, b) => hearts[b.id] - hearts[a.id]
  )
  const progress = ((currentQuestion + 1) / manegeQuestions.length) * 100

  return (
    <div className="min-h-screen pb-8">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      <style jsx>{`
        .top-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          padding-bottom: 8px;
        }
        .top-nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          font-size: 0.8rem;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.2s;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
        }
        .top-nav-item:hover {
          color: #FF00FF;
          border-color: #FF00FF;
          background: rgba(255, 0, 255, 0.15);
          text-shadow: 0 0 10px #FF00FF;
          transform: translateY(-2px);
        }
        .top-nav-item.active {
          color: #FF00FF;
          border-color: #FF00FF;
          background: rgba(255, 0, 255, 0.2);
          text-shadow: 0 0 10px #FF00FF;
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
        }
        .top-nav-item .nav-emoji {
          font-size: 1.1rem;
        }
        @media (min-width: 768px) {
          .top-nav {
            gap: 10px;
            padding-bottom: 10px;
          }
          .top-nav-item {
            padding: 12px 18px;
            font-size: 0.9rem;
            gap: 8px;
          }
          .top-nav-item .nav-emoji {
            font-size: 1.2rem;
          }
        }
      `}</style>

      {/* Header avec navigation */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-3">
          {/* Ligne 1: Logo + Notifications */}
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-3">
            <Link href="/" className="logo-90s text-xl">
              <span className="animate-spin inline-block text-lg">🎠</span>
              GameCrush
            </Link>

            <div className="flex items-center gap-3">
              {phase === 'questions' && (
                <span className="text-white/80 font-bold text-sm">
                  Q{currentQuestion + 1}/{manegeQuestions.length}
                </span>
              )}
              <button className="relative p-2 text-white/60 hover:text-[#FFFF00] transition">
                <span className="text-2xl">🔔</span>
              </button>
            </div>
          </div>

          {/* Ligne 2: Navigation */}
          <nav className="max-w-5xl mx-auto">
            <div className="top-nav">
              <Link href="/dashboard" className="top-nav-item">
                <span className="nav-emoji">🏠</span>
                Accueil
              </Link>
              <Link href="/games/jeu-oie" className="top-nav-item">
                <span className="nav-emoji">🎲</span>
                Tirage
              </Link>
              <Link href="/games" className="top-nav-item active">
                <span className="nav-emoji">🎮</span>
                JEUX
              </Link>
              <Link href="/messages" className="top-nav-item">
                <span className="nav-emoji">💬</span>
                Messages
              </Link>
              <Link href="/events" className="top-nav-item" style={{ color: '#FF6600' }}>
                <span className="nav-emoji">🍻</span>
                Events
              </Link>
              <Link href="/invite" className="top-nav-item">
                <span className="nav-emoji">👯</span>
                Inviter
              </Link>
              <Link href="/profile" className="top-nav-item">
                <span className="nav-emoji">👤</span>
                Profil
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="px-5 py-5 mx-auto" style={{ maxWidth: '600px' }}>
        {/* Phase Intro */}
        {phase === 'intro' && (
          <div className="text-center py-8">
            <div className="text-8xl mb-6 animate-pulse filter drop-shadow-[0_0_30px_#FF00FF]">🎠</div>
            <h2 className="text-3xl text-white mb-3" style={{ textShadow: '0 0 15px #FF00FF, 2px 2px 0 #00FFFF' }}>
              Bienvenue au Manège !
            </h2>
            <p className="text-white/80 mb-6">
              Découvre les personnalités de 3 joueurs
              <br />
              <span className="text-[#FFFF00] font-bold" style={{ textShadow: '0 0 10px #FFFF00' }}>
                Les visages sont cachés
              </span>
              <br />
              Juge uniquement sur la personnalité !
            </p>

            <div className="flex justify-center gap-6 mb-8">
              {mockCandidates.map((c, i) => (
                <div
                  key={c.id}
                  className="w-16 h-16 border-4 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    borderColor: ['#FF00FF', '#00FFFF', '#39FF14'][i],
                    color: ['#FF00FF', '#00FFFF', '#39FF14'][i],
                    boxShadow: `0 0 20px ${['#FF00FF', '#00FFFF', '#39FF14'][i]}40`,
                    textShadow: `0 0 10px ${['#FF00FF', '#00FFFF', '#39FF14'][i]}`,
                  }}
                >
                  ?
                </div>
              ))}
            </div>

            <div className="card-90s p-6 mb-8 text-left">
              <h3 className="text-[#FFFF00] font-bold mb-4 text-center" style={{ textShadow: '0 0 10px #FFFF00' }}>
                Comment jouer ?
              </h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">💗</span>
                  <span>Donne un coeur aux réponses qui te plaisent</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🎭</span>
                  <span>Révèle les profils à la fin</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <span>Choisis ton match préféré !</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setPhase('questions')}
              className="btn-cta-primary w-full justify-center"
            >
              🎠 C'est parti !
            </button>
          </div>
        )}

        {/* Phase Questions */}
        {phase === 'questions' && (
          <>
            {/* Barre de progression */}
            <div className="h-4 border-2 border-[#FF00FF] bg-[#330066] mb-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF00FF] to-[#00FFFF] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-xs text-white/60 mb-6">
              🎭 Le rideau se lève...
            </p>

            {/* Question */}
            <div className="card-90s pink p-6 mb-6 text-center">
              <div className="text-4xl mb-3">{question.emoji}</div>
              <h3 className="text-xl text-white" style={{ textShadow: '0 0 10px #FF00FF' }}>
                "{question.question}"
              </h3>
            </div>

            {/* 3 Candidats */}
            <div className="space-y-4">
              {mockCandidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="card-90s p-4 transition-all"
                  style={{
                    borderColor: hearts[candidate.id] > 0
                      ? ['#FF00FF', '#00FFFF', '#39FF14'][index]
                      : 'rgba(255,255,255,0.3)',
                    boxShadow: hearts[candidate.id] > 0
                      ? `0 0 20px ${['#FF00FF', '#00FFFF', '#39FF14'][index]}60`
                      : 'none',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar mystère */}
                    <div
                      className="w-12 h-12 border-2 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                      style={{
                        borderColor: ['#FF00FF', '#00FFFF', '#39FF14'][index],
                        color: ['#FF00FF', '#00FFFF', '#39FF14'][index],
                      }}
                    >
                      {candidate.label.split(' ')[1]}
                    </div>

                    {/* Réponse */}
                    <div className="flex-1">
                      <div
                        className="text-sm font-bold mb-1"
                        style={{ color: ['#FF00FF', '#00FFFF', '#39FF14'][index] }}
                      >
                        {candidate.label}
                      </div>
                      <p className="text-white/80 text-sm">
                        "{candidate.answers[currentQuestion]}"
                      </p>
                    </div>

                    {/* Bouton coeur */}
                    <button
                      onClick={() => toggleHeart(candidate.id)}
                      className="text-3xl transition-transform hover:scale-125"
                    >
                      {hearts[candidate.id] > 0 ? '💗' : '🤍'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton suivant */}
            <button
              onClick={nextQuestion}
              className="btn-cta-primary w-full justify-center mt-6"
            >
              {currentQuestion < manegeQuestions.length - 1
                ? 'Question suivante ➜'
                : '🎭 Révéler les profils'}
            </button>
          </>
        )}

        {/* Phase Révélation */}
        {phase === 'reveal' && (
          <>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-pulse">🎭</div>
              <h2 className="text-2xl text-white mb-2" style={{ textShadow: '0 0 15px #FF00FF, 2px 2px 0 #00FFFF' }}>
                Qui se cache derrière ?
              </h2>
              <p className="text-white/60">
                Clique sur un profil pour le révéler
              </p>
            </div>

            {/* Liste des candidats triés par coeurs */}
            <div className="space-y-4 mb-6">
              {sortedCandidates.map((c, index) => (
                <div
                  key={c.id}
                  className="card-90s p-4"
                  style={{
                    borderColor: revealed.includes(c.id) ? '#FF00FF' : 'rgba(255,255,255,0.3)',
                    boxShadow: revealed.includes(c.id) ? '0 0 20px #FF00FF40' : 'none',
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar / Photo */}
                    <button
                      onClick={() => revealCandidate(c.id)}
                      className="w-14 h-14 border-2 border-[#FF00FF] rounded-full flex items-center justify-center relative overflow-hidden"
                    >
                      {revealed.includes(c.id) ? (
                        <span className="text-3xl">{c.avatar}</span>
                      ) : (
                        <>
                          <span className="text-3xl blur-sm">{c.avatar}</span>
                          <div className="absolute inset-0 flex items-center justify-center bg-[#1A0033]/60">
                            <span className="text-xl">👁️</span>
                          </div>
                        </>
                      )}
                    </button>

                    {/* Infos */}
                    <div className="flex-1">
                      {revealed.includes(c.id) ? (
                        <>
                          <div className="text-[#FF00FF] font-bold" style={{ textShadow: '0 0 10px #FF00FF' }}>
                            {c.name}, {c.age} ans
                          </div>
                          <div className="text-sm text-white/60">{c.city}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-white font-bold">{c.label}</div>
                          <div className="text-sm text-white/40">Clique pour révéler</div>
                        </>
                      )}
                      {/* Coeurs gagnés */}
                      <div className="flex items-center gap-1 mt-1">
                        {hearts[c.id] > 0 ? (
                          <span className="text-[#FF00FF] text-sm font-bold">
                            💗 {hearts[c.id]} coeur{hearts[c.id] > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-white/40 text-sm">Aucun coeur</span>
                        )}
                      </div>
                    </div>

                    {/* Badge classement */}
                    {index === 0 && hearts[c.id] > 0 && (
                      <div className="badge-90s text-xs" style={{ background: '#FFFF00', color: '#1A0033' }}>
                        TOP 1
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Boutons matcher */}
            {revealed.length > 0 && (
              <div className="space-y-3">
                <p className="text-center text-white/80 font-bold mb-4">
                  Choisis ton match :
                </p>
                {sortedCandidates
                  .filter(c => revealed.includes(c.id))
                  .map(c => (
                    <button
                      key={c.id}
                      onClick={() => selectMatch(c.id)}
                      disabled={isSubmitting}
                      className="btn-cta-secondary w-full justify-center"
                    >
                      {isSubmitting && selectedMatch === c.id ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <>💬 Matcher avec {c.name}</>
                      )}
                    </button>
                  ))}
              </div>
            )}

            {/* Info async */}
            <div className="card-90s blue p-4 mt-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <p className="font-bold text-[#00FFFF]" style={{ textShadow: '0 0 10px #00FFFF' }}>
                    Mode asynchrone
                  </p>
                  <p className="text-xs text-white/70">
                    Si tu matches, l'autre joueur sera notifié. S'il accepte, vous pourrez discuter !
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Phase Résultats */}
        {phase === 'results' && (
          <div className="text-center py-8">
            <div className="text-8xl mb-6 animate-pulse filter drop-shadow-[0_0_30px_#FF00FF]">💕</div>
            <h2 className="text-3xl text-white mb-3" style={{ textShadow: '0 0 15px #FF00FF, 2px 2px 0 #00FFFF' }}>
              Demande envoyée !
            </h2>
            <p className="text-white/80 mb-6">
              <span className="text-[#FF00FF] font-bold" style={{ textShadow: '0 0 10px #FF00FF' }}>
                {mockCandidates.find(c => c.id === selectedMatch)?.name}
              </span>
              {' '}a reçu ta demande de match.
              <br />
              Tu seras notifié(e) dès qu'il/elle aura répondu !
            </p>

            {/* Stats de la session */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="stat-card">
                <div className="stat-number text-3xl">+75</div>
                <div className="stat-label">POINTS</div>
              </div>
              <div className="stat-card">
                <div className="stat-number text-3xl">
                  {Object.values(hearts).filter(h => h > 0).length}
                </div>
                <div className="stat-label">COEURS</div>
              </div>
            </div>

            {/* Badge gagné */}
            <div className="card-90s green p-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <p className="text-[#39FF14] font-bold" style={{ textShadow: '0 0 10px #39FF14' }}>
                    Badge débloqué !
                  </p>
                  <p className="text-sm text-white/70">Premier tour de Manège</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setPhase('intro')
                  setCurrentQuestion(0)
                  setHearts({ a: 0, b: 0, c: 0 })
                  setRevealed([])
                  setSelectedMatch(null)
                }}
                className="btn-cta-secondary w-full justify-center"
              >
                🎠 Rejouer avec d'autres profils
              </button>
              <Link href="/dashboard" className="btn-cta-primary w-full justify-center block">
                🏠 Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </main>

    </div>
  )
}
