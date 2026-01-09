'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface SessionData {
  eventName: string
  participants: Array<{
    name: string
    photo?: string
    profileCompleted: boolean
  }>
}

type GamePhase = 'intro' | 'debate' | 'vote' | 'verdict' | 'finished'

const debates = [
  {
    id: 1,
    topic: "Les réunions de plus de 30 minutes devraient être interdites",
    for: "Plus de productivité, moins de blabla !",
    against: "Parfois il faut prendre le temps de discuter !"
  },
  {
    id: 2,
    topic: "Le lundi devrait être un jour de télétravail obligatoire",
    for: "Transition douce après le weekend !",
    against: "Le lundi c'est le jour où on se motive ensemble !"
  },
  {
    id: 3,
    topic: "Les emails après 18h devraient être automatiquement supprimés",
    for: "Vive l'équilibre vie pro/perso !",
    against: "Et si c'est urgent ?!"
  },
  {
    id: 4,
    topic: "Le café de la machine devrait être gratuit et illimité",
    for: "C'est la base de la productivité !",
    against: "Les gens vont passer leur journée à la machine !"
  },
  {
    id: 5,
    topic: "On devrait pouvoir venir en pyjama au bureau",
    for: "Confort = Créativité !",
    against: "Un minimum de professionnalisme quand même !"
  }
]

export default function ProcesBureauGame() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [currentRound, setCurrentRound] = useState(0)
  const [shuffledDebates, setShuffledDebates] = useState(debates)
  const [userVote, setUserVote] = useState<'for' | 'against' | null>(null)
  const [votes, setVotes] = useState({ for: 0, against: 0 })
  const [timer, setTimer] = useState(90)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem(`recre_session_${code}`)
    if (data) {
      setSessionData(JSON.parse(data))
    }
    setShuffledDebates([...debates].sort(() => Math.random() - 0.5).slice(0, 3))
  }, [code])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      setPhase('vote')
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timer])

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">⚖️</div>
      </div>
    )
  }

  const currentDebate = shuffledDebates[currentRound]
  const totalRounds = shuffledDebates.length
  const isLastRound = currentRound >= totalRounds - 1

  const startGame = () => {
    setPhase('debate')
    setTimer(90)
    setIsTimerRunning(true)
  }

  const skipToVote = () => {
    setIsTimerRunning(false)
    setPhase('vote')
  }

  const castVote = (vote: 'for' | 'against') => {
    setUserVote(vote)

    // Simuler les votes des autres
    const participantCount = sessionData.participants.filter(p => p.profileCompleted).length
    const otherVotes = participantCount - 1
    const randomForVotes = Math.floor(Math.random() * otherVotes)

    setVotes({
      for: (vote === 'for' ? 1 : 0) + randomForVotes,
      against: (vote === 'against' ? 1 : 0) + (otherVotes - randomForVotes)
    })

    setTimeout(() => {
      setPhase('verdict')
    }, 1500)
  }

  const nextRound = () => {
    setUserVote(null)
    setVotes({ for: 0, against: 0 })

    if (isLastRound) {
      setPhase('finished')
    } else {
      setCurrentRound(prev => prev + 1)
      setPhase('debate')
      setTimer(90)
      setIsTimerRunning(true)
    }
  }

  const winner = votes.for > votes.against ? 'for' : votes.against > votes.for ? 'against' : 'tie'

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .game-card {
          background: rgba(255, 255, 255, 0.03);
          border: 3px solid rgba(255, 102, 0, 0.3);
          border-radius: 24px;
          padding: 32px;
        }
        .topic-card {
          background: rgba(255, 102, 0, 0.1);
          border: 2px solid rgba(255, 102, 0, 0.4);
          border-radius: 16px;
          padding: 24px;
        }
        .side-card {
          flex: 1;
          padding: 20px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .side-card.for {
          background: rgba(57, 255, 20, 0.1);
          border: 2px solid rgba(57, 255, 20, 0.3);
        }
        .side-card.for:hover, .side-card.for.selected {
          border-color: #39FF14;
          box-shadow: 0 0 30px rgba(57, 255, 20, 0.3);
        }
        .side-card.against {
          background: rgba(255, 51, 102, 0.1);
          border: 2px solid rgba(255, 51, 102, 0.3);
        }
        .side-card.against:hover, .side-card.against.selected {
          border-color: #FF3366;
          box-shadow: 0 0 30px rgba(255, 51, 102, 0.3);
        }
        .side-card:disabled {
          cursor: default;
          opacity: 0.7;
        }
        .btn-action {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #FF6600 0%, #FFB347 100%);
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
          box-shadow: 0 0 30px rgba(255, 102, 0, 0.5);
        }
        .btn-secondary {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          border-color: rgba(255, 255, 255, 0.4);
        }
        .timer {
          font-size: 3rem;
          font-weight: bold;
          color: ${timer <= 15 ? '#FF3366' : '#FF6600'};
          text-shadow: 0 0 20px ${timer <= 15 ? '#FF3366' : '#FF6600'};
        }
        .vote-bar {
          height: 24px;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href={`/recre/${code}/dashboard`} className="text-white/60 hover:text-white transition">
            ← Quitter
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span className="text-[#FF6600] font-bold">Le Procès du Bureau</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8">
        <div className="max-w-xl mx-auto">
          {/* INTRO */}
          {phase === 'intro' && (
            <div className="text-center">
              <div className="text-8xl mb-6">⚖️</div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#FF6600',
                  textShadow: '0 0 20px rgba(255, 102, 0, 0.5)'
                }}
              >
                LE PROCÈS DU BUREAU
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Débats absurdes sur le monde du travail !<br />
                <span className="text-white/50 text-sm">Défendez votre position avec ferveur.</span>
              </p>

              <div className="game-card mb-8">
                <h2 className="text-white font-bold mb-4">📋 Règles du jeu</h2>
                <ul className="text-left text-white/70 space-y-2">
                  <li>• Un sujet de débat s'affiche</li>
                  <li>• Vous avez 90 secondes pour débattre</li>
                  <li>• Choisissez votre camp : POUR ou CONTRE</li>
                  <li>• Le verdict tombe !</li>
                </ul>
              </div>

              <p className="text-[#00FFFF] mb-4" style={{ textShadow: '0 0 10px #00FFFF' }}>
                {shuffledDebates.length} sujets à débattre
              </p>

              <button onClick={startGame} className="btn-action">
                ⚖️ Ouvrir le tribunal !
              </button>
            </div>
          )}

          {/* DEBATE */}
          {phase === 'debate' && currentDebate && (
            <div>
              {/* Timer */}
              <div className="text-center mb-6">
                <div className="timer">{timer}s</div>
                <p className="text-white/60 text-sm">Temps de débat !</p>
              </div>

              <div className="mb-4">
                <span className="text-white/60 text-sm">Débat {currentRound + 1}/{totalRounds}</span>
              </div>

              <div className="topic-card mb-8 text-center">
                <p className="text-white/60 text-sm mb-2">🔨 Sujet du débat :</p>
                <p className="text-xl text-[#FF6600] font-bold" style={{ textShadow: '0 0 10px #FF6600' }}>
                  "{currentDebate.topic}"
                </p>
              </div>

              <div className="flex gap-4 mb-8">
                <div className="side-card for">
                  <h3 className="text-[#39FF14] font-bold mb-2 flex items-center gap-2">
                    <span>👍</span> POUR
                  </h3>
                  <p className="text-white/70 text-sm">{currentDebate.for}</p>
                </div>
                <div className="side-card against">
                  <h3 className="text-[#FF3366] font-bold mb-2 flex items-center gap-2">
                    <span>👎</span> CONTRE
                  </h3>
                  <p className="text-white/70 text-sm">{currentDebate.against}</p>
                </div>
              </div>

              <p className="text-white/60 text-center mb-6">
                Débattez en équipe, puis passez au vote !
              </p>

              <button onClick={skipToVote} className="btn-secondary">
                🗳️ Passer au vote
              </button>
            </div>
          )}

          {/* VOTE */}
          {phase === 'vote' && currentDebate && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🗳️</div>
                <h2
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#FF6600',
                    textShadow: '0 0 15px rgba(255, 102, 0, 0.5)'
                  }}
                >
                  VOTEZ !
                </h2>
              </div>

              <div className="topic-card mb-6 text-center">
                <p className="text-[#FF6600]">"{currentDebate.topic}"</p>
              </div>

              <div className="flex gap-4">
                <button
                  className={`side-card for ${userVote === 'for' ? 'selected' : ''}`}
                  onClick={() => castVote('for')}
                  disabled={userVote !== null}
                >
                  <div className="text-center">
                    <span className="text-4xl">👍</span>
                    <p className="text-[#39FF14] font-bold mt-2">POUR</p>
                  </div>
                </button>
                <button
                  className={`side-card against ${userVote === 'against' ? 'selected' : ''}`}
                  onClick={() => castVote('against')}
                  disabled={userVote !== null}
                >
                  <div className="text-center">
                    <span className="text-4xl">👎</span>
                    <p className="text-[#FF3366] font-bold mt-2">CONTRE</p>
                  </div>
                </button>
              </div>

              {userVote && (
                <p className="text-center text-[#FF6600] mt-6 animate-pulse">
                  ⏳ Comptage des votes...
                </p>
              )}
            </div>
          )}

          {/* VERDICT */}
          {phase === 'verdict' && currentDebate && (
            <div className="text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: winner === 'for' ? '#39FF14' : winner === 'against' ? '#FF3366' : '#FF6600',
                  textShadow: `0 0 15px ${winner === 'for' ? '#39FF14' : winner === 'against' ? '#FF3366' : '#FF6600'}`
                }}
              >
                {winner === 'tie' ? 'ÉGALITÉ !' : 'LE VERDICT EST TOMBÉ !'}
              </h2>

              <div className="topic-card mb-6">
                <p className="text-white/60 text-sm mb-2">"{currentDebate.topic}"</p>
                <p className="text-2xl font-bold" style={{
                  color: winner === 'for' ? '#39FF14' : winner === 'against' ? '#FF3366' : '#FF6600'
                }}>
                  {winner === 'for' && '👍 POUR l\'emporte !'}
                  {winner === 'against' && '👎 CONTRE l\'emporte !'}
                  {winner === 'tie' && '🤝 Match nul !'}
                </p>
              </div>

              {/* Vote bar */}
              <div className="mb-6">
                <div className="vote-bar">
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: `${(votes.for / (votes.for + votes.against)) * 100}%`,
                      background: '#39FF14'
                    }}
                  />
                  <div
                    className="transition-all duration-500"
                    style={{
                      width: `${(votes.against / (votes.for + votes.against)) * 100}%`,
                      background: '#FF3366'
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-[#39FF14]">👍 {votes.for} votes</span>
                  <span className="text-[#FF3366]">{votes.against} votes 👎</span>
                </div>
              </div>

              <button onClick={nextRound} className="btn-action">
                {isLastRound ? '🏆 Terminer' : '→ Débat suivant'}
              </button>
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
                  color: '#FF6600',
                  textShadow: '0 0 20px rgba(255, 102, 0, 0.5)'
                }}
              >
                TRIBUNAL FERMÉ !
              </h1>
              <p className="text-white/60 mb-8">
                La justice (absurde) a été rendue ! ⚖️
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
