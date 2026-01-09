'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Participant {
  name: string
  photo?: string
  jobTitle: string
  company?: string
  funFact?: string
  profileCompleted: boolean
}

interface SessionData {
  eventName: string
  participants: Participant[]
}

type GamePhase = 'intro' | 'playing' | 'reveal' | 'scores' | 'finished'

export default function TeteEmploiGame() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [currentRound, setCurrentRound] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [shuffledParticipants, setShuffledParticipants] = useState<Participant[]>([])
  const [shuffledJobs, setShuffledJobs] = useState<string[]>([])

  useEffect(() => {
    const data = localStorage.getItem(`recre_session_${code}`)
    if (data) {
      const parsed = JSON.parse(data)
      setSessionData(parsed)

      // Filtrer les participants avec profil complet
      const completedParticipants = parsed.participants.filter(
        (p: Participant) => p.profileCompleted && p.jobTitle
      )

      // Mélanger les participants
      const shuffled = [...completedParticipants].sort(() => Math.random() - 0.5)
      setShuffledParticipants(shuffled)

      // Créer la liste des métiers mélangés
      const jobs = shuffled.map((p: Participant) => p.jobTitle)
      setShuffledJobs(jobs.sort(() => Math.random() - 0.5))

      // Initialiser les scores
      const initialScores: Record<string, number> = {}
      shuffled.forEach((p: Participant) => {
        initialScores[p.name] = 0
      })
      setScores(initialScores)
    }
  }, [code])

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">🎭</div>
      </div>
    )
  }

  const currentParticipant = shuffledParticipants[currentRound]
  const totalRounds = shuffledParticipants.length
  const isLastRound = currentRound >= totalRounds - 1

  const handleAnswer = (job: string) => {
    setSelectedAnswer(job)
    setShowResult(true)

    // Vérifier si c'est correct
    if (job === currentParticipant.jobTitle) {
      // Ajouter des points (simulé - en vrai ce serait pour le joueur qui répond)
      setScores(prev => ({
        ...prev,
        [currentParticipant.name]: (prev[currentParticipant.name] || 0) + 10
      }))
    }
  }

  const nextRound = () => {
    setSelectedAnswer(null)
    setShowResult(false)

    if (isLastRound) {
      setPhase('finished')
    } else {
      setCurrentRound(prev => prev + 1)
      setPhase('playing')
    }
  }

  const startGame = () => {
    setPhase('playing')
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .game-card {
          background: rgba(255, 255, 255, 0.03);
          border: 3px solid rgba(255, 0, 255, 0.3);
          border-radius: 24px;
          padding: 32px;
        }
        .answer-btn {
          width: 100%;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          font-weight: bold;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .answer-btn:hover:not(:disabled) {
          border-color: #FF00FF;
          background: rgba(255, 0, 255, 0.1);
        }
        .answer-btn.correct {
          border-color: #39FF14;
          background: rgba(57, 255, 20, 0.2);
          color: #39FF14;
        }
        .answer-btn.wrong {
          border-color: #FF3366;
          background: rgba(255, 51, 102, 0.2);
          color: #FF3366;
        }
        .answer-btn:disabled {
          cursor: default;
        }
        .btn-action {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-action:hover {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
        }
        .participant-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          margin: 0 auto 20px;
          box-shadow: 0 0 40px rgba(255, 0, 255, 0.3);
        }
        .score-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href={`/recre/${code}/dashboard`} className="text-white/60 hover:text-white transition">
            ← Quitter
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            <span className="text-[#FF00FF] font-bold">La Tête de l'Emploi</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8">
        <div className="max-w-xl mx-auto">
          {/* INTRO */}
          {phase === 'intro' && (
            <div className="text-center">
              <div className="text-8xl mb-6">🎭</div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#FF00FF',
                  textShadow: '0 0 20px rgba(255, 0, 255, 0.5)'
                }}
              >
                LA TÊTE DE L'EMPLOI
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Devinez qui fait quoi !<br />
                <span className="text-white/50 text-sm">Un participant s'affiche, trouvez son métier parmi les options.</span>
              </p>

              <div className="game-card mb-8">
                <h2 className="text-white font-bold mb-4">📋 Règles du jeu</h2>
                <ul className="text-left text-white/70 space-y-2">
                  <li>• Un participant s'affiche à l'écran</li>
                  <li>• Lisez son fun fact comme indice</li>
                  <li>• Devinez son vrai métier parmi les options</li>
                  <li>• +10 points par bonne réponse !</li>
                </ul>
              </div>

              <p className="text-[#00FFFF] mb-4" style={{ textShadow: '0 0 10px #00FFFF' }}>
                {shuffledParticipants.length} participants à deviner
              </p>

              <button onClick={startGame} className="btn-action">
                🎮 Lancer le jeu !
              </button>
            </div>
          )}

          {/* PLAYING */}
          {phase === 'playing' && currentParticipant && (
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Tour {currentRound + 1}/{totalRounds}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentRound + 1) / totalRounds) * 100}%`,
                      background: 'linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%)'
                    }}
                  />
                </div>
              </div>

              {/* Participant Card */}
              <div className="game-card text-center mb-6">
                <div className="participant-avatar">
                  {currentParticipant.photo || '👤'}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentParticipant.name}
                </h2>
                {currentParticipant.funFact && (
                  <div className="p-4 rounded-xl mt-4" style={{ background: 'rgba(0, 255, 255, 0.1)' }}>
                    <p className="text-white/60 text-sm mb-1">💡 Indice :</p>
                    <p className="text-[#00FFFF] italic" style={{ textShadow: '0 0 10px #00FFFF' }}>
                      "{currentParticipant.funFact}"
                    </p>
                  </div>
                )}
              </div>

              {/* Question */}
              <h3 className="text-white font-bold text-center mb-4">
                Quel est son métier ?
              </h3>

              {/* Answers */}
              <div className="space-y-3">
                {shuffledJobs.map((job, index) => {
                  let className = 'answer-btn'
                  if (showResult) {
                    if (job === currentParticipant.jobTitle) {
                      className += ' correct'
                    } else if (job === selectedAnswer) {
                      className += ' wrong'
                    }
                  }

                  return (
                    <button
                      key={index}
                      className={className}
                      onClick={() => handleAnswer(job)}
                      disabled={showResult}
                    >
                      {job}
                    </button>
                  )
                })}
              </div>

              {/* Result */}
              {showResult && (
                <div className="mt-6">
                  <div
                    className="p-4 rounded-xl text-center mb-4"
                    style={{
                      background: selectedAnswer === currentParticipant.jobTitle
                        ? 'rgba(57, 255, 20, 0.1)'
                        : 'rgba(255, 51, 102, 0.1)',
                      border: `2px solid ${selectedAnswer === currentParticipant.jobTitle ? '#39FF14' : '#FF3366'}`
                    }}
                  >
                    <span className="text-3xl">
                      {selectedAnswer === currentParticipant.jobTitle ? '🎉' : '😅'}
                    </span>
                    <p className="font-bold mt-2" style={{
                      color: selectedAnswer === currentParticipant.jobTitle ? '#39FF14' : '#FF3366'
                    }}>
                      {selectedAnswer === currentParticipant.jobTitle
                        ? 'Bravo ! C\'est correct !'
                        : `Raté ! C'était "${currentParticipant.jobTitle}"`}
                    </p>
                  </div>

                  <button onClick={nextRound} className="btn-action">
                    {isLastRound ? '🏆 Voir les résultats' : '→ Suivant'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FINISHED */}
          {phase === 'finished' && (
            <div className="text-center">
              <div className="text-8xl mb-6">🏆</div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#39FF14',
                  textShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
                }}
              >
                PARTIE TERMINÉE !
              </h1>
              <p className="text-white/60 mb-8">
                Bravo à tous les participants !
              </p>

              <div className="game-card mb-8">
                <h2 className="text-white font-bold mb-4 text-left">📊 Résumé</h2>
                <div className="space-y-2">
                  {shuffledParticipants.map((p, index) => (
                    <div key={index} className="score-row">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.photo || '👤'}</span>
                        <div className="text-left">
                          <p className="text-white font-bold">{p.name}</p>
                          <p className="text-white/50 text-sm">{p.jobTitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/recre/${code}/dashboard`)}
                  className="btn-action"
                >
                  🎮 Retour aux jeux
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
