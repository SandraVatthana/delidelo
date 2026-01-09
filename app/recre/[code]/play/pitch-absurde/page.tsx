'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Participant {
  name: string
  photo?: string
  absurdPitch?: string
  jobTitle?: string
  profileCompleted: boolean
}

interface SessionData {
  eventName: string
  participants: Participant[]
}

type GamePhase = 'intro' | 'present' | 'guess' | 'reveal' | 'finished'

export default function PitchAbsurdeGame() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [currentRound, setCurrentRound] = useState(0)
  const [shuffledParticipants, setShuffledParticipants] = useState<Participant[]>([])
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem(`recre_session_${code}`)
    if (data) {
      const parsed = JSON.parse(data)
      setSessionData(parsed)

      const completedParticipants = parsed.participants.filter(
        (p: Participant) => p.profileCompleted && p.absurdPitch
      )
      setShuffledParticipants(completedParticipants.sort(() => Math.random() - 0.5))
    }
  }, [code])

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">🎤</div>
      </div>
    )
  }

  const currentParticipant = shuffledParticipants[currentRound]
  const totalRounds = shuffledParticipants.length
  const isLastRound = currentRound >= totalRounds - 1

  const startGame = () => {
    setPhase('present')
  }

  const showGuessing = () => {
    setPhase('guess')
  }

  const makeGuess = (name: string) => {
    setSelectedGuess(name)
    setShowResult(true)
  }

  const nextRound = () => {
    setSelectedGuess(null)
    setShowResult(false)

    if (isLastRound) {
      setPhase('finished')
    } else {
      setCurrentRound(prev => prev + 1)
      setPhase('present')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .game-card {
          background: rgba(255, 255, 255, 0.03);
          border: 3px solid rgba(0, 255, 255, 0.3);
          border-radius: 24px;
          padding: 32px;
        }
        .pitch-card {
          background: rgba(0, 255, 255, 0.1);
          border: 2px solid rgba(0, 255, 255, 0.4);
          border-radius: 16px;
          padding: 24px;
        }
        .guess-btn {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          font-weight: bold;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .guess-btn:hover:not(:disabled) {
          border-color: #00FFFF;
          background: rgba(0, 255, 255, 0.1);
        }
        .guess-btn.correct {
          border-color: #39FF14;
          background: rgba(57, 255, 20, 0.2);
        }
        .guess-btn.wrong {
          border-color: #FF3366;
          background: rgba(255, 51, 102, 0.2);
        }
        .guess-btn:disabled {
          cursor: default;
        }
        .btn-action {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%);
          border: none;
          border-radius: 12px;
          color: #0D001A;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-action:hover {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href={`/recre/${code}/dashboard`} className="text-white/60 hover:text-white transition">
            ← Quitter
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎤</span>
            <span className="text-[#00FFFF] font-bold">Le Pitch Absurde</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8">
        <div className="max-w-xl mx-auto">
          {/* INTRO */}
          {phase === 'intro' && (
            <div className="text-center">
              <div className="text-8xl mb-6">🎤</div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#00FFFF',
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
                }}
              >
                LE PITCH ABSURDE
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Présentations ridicules !<br />
                <span className="text-white/50 text-sm">Devinez qui se cache derrière chaque pitch décalé.</span>
              </p>

              <div className="game-card mb-8">
                <h2 className="text-white font-bold mb-4">📋 Règles du jeu</h2>
                <ul className="text-left text-white/70 space-y-2">
                  <li>• Un pitch absurde s'affiche à l'écran</li>
                  <li>• C'est une description décalée d'un métier</li>
                  <li>• Devinez à qui appartient ce pitch !</li>
                  <li>• On révèle ensuite le vrai métier</li>
                </ul>
              </div>

              <p className="text-[#FF00FF] mb-4" style={{ textShadow: '0 0 10px #FF00FF' }}>
                {shuffledParticipants.length} pitchs à découvrir
              </p>

              <button onClick={startGame} className="btn-action">
                🎤 C'est parti !
              </button>
            </div>
          )}

          {/* PRESENT */}
          {phase === 'present' && currentParticipant && (
            <div className="text-center">
              <div className="mb-4">
                <span className="text-white/60 text-sm">Pitch {currentRound + 1}/{totalRounds}</span>
              </div>

              <div className="text-6xl mb-6">🎭</div>

              <div className="pitch-card mb-8">
                <p className="text-white/60 text-sm mb-2">Ce mystérieux participant dit :</p>
                <p className="text-xl text-[#00FFFF] font-bold italic" style={{ textShadow: '0 0 10px #00FFFF' }}>
                  "{currentParticipant.absurdPitch}"
                </p>
              </div>

              <p className="text-white/60 mb-6">
                Qui pourrait dire ça ? 🤔
              </p>

              <button onClick={showGuessing} className="btn-action">
                👀 Deviner qui c'est
              </button>
            </div>
          )}

          {/* GUESS */}
          {phase === 'guess' && currentParticipant && (
            <div>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Pitch {currentRound + 1}/{totalRounds}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentRound + 1) / totalRounds) * 100}%`,
                      background: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)'
                    }}
                  />
                </div>
              </div>

              <div className="pitch-card mb-6">
                <p className="text-[#00FFFF] italic" style={{ textShadow: '0 0 10px #00FFFF' }}>
                  "{currentParticipant.absurdPitch}"
                </p>
              </div>

              <h3 className="text-white font-bold text-center mb-4">
                Qui a dit ça ?
              </h3>

              <div className="space-y-3">
                {shuffledParticipants.map((p, index) => {
                  let className = 'guess-btn'
                  if (showResult) {
                    if (p.name === currentParticipant.name) {
                      className += ' correct'
                    } else if (p.name === selectedGuess) {
                      className += ' wrong'
                    }
                  }

                  return (
                    <button
                      key={index}
                      className={className}
                      onClick={() => makeGuess(p.name)}
                      disabled={showResult}
                    >
                      <span className="text-2xl">{p.photo || '👤'}</span>
                      <span>{p.name}</span>
                    </button>
                  )
                })}
              </div>

              {showResult && (
                <div className="mt-6">
                  <div
                    className="p-4 rounded-xl text-center mb-4"
                    style={{
                      background: selectedGuess === currentParticipant.name
                        ? 'rgba(57, 255, 20, 0.1)'
                        : 'rgba(255, 51, 102, 0.1)',
                      border: `2px solid ${selectedGuess === currentParticipant.name ? '#39FF14' : '#FF3366'}`
                    }}
                  >
                    <span className="text-3xl">
                      {selectedGuess === currentParticipant.name ? '🎉' : '😅'}
                    </span>
                    <p className="font-bold mt-2" style={{
                      color: selectedGuess === currentParticipant.name ? '#39FF14' : '#FF3366'
                    }}>
                      {selectedGuess === currentParticipant.name
                        ? 'Bien joué !'
                        : `C'était ${currentParticipant.name} !`}
                    </p>
                    {currentParticipant.jobTitle && (
                      <p className="text-white/60 text-sm mt-2">
                        Vrai métier : {currentParticipant.jobTitle}
                      </p>
                    )}
                  </div>

                  <button onClick={nextRound} className="btn-action">
                    {isLastRound ? '🏆 Voir les résultats' : '→ Pitch suivant'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FINISHED */}
          {phase === 'finished' && (
            <div className="text-center">
              <div className="text-8xl mb-6">🎉</div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#00FFFF',
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
                }}
              >
                PITCHS TERMINÉS !
              </h1>
              <p className="text-white/60 mb-8">
                Bravo ! Vous connaissez maintenant les talents cachés de chacun ! 🎤
              </p>

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
