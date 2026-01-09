'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Participant {
  name: string
  photo?: string
  businessProblem?: string
  profileCompleted: boolean
}

interface SessionData {
  eventName: string
  participants: Participant[]
}

interface Idea {
  author: string
  text: string
  votes: number
}

type GamePhase = 'intro' | 'problem' | 'brainstorm' | 'voting' | 'results' | 'finished'

const sampleProblems = [
  "Comment faire venir les gens au bureau le lundi matin ?",
  "Comment empêcher les réunions de durer 3 heures ?",
  "Comment motiver l'équipe sans augmenter les salaires ?",
  "Comment répondre aux emails sans y passer sa vie ?",
  "Comment gérer un client qui change d'avis toutes les 5 minutes ?",
]

export default function BrainstormDebileGame() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [currentRound, setCurrentRound] = useState(0)
  const [problems, setProblems] = useState<string[]>([])
  const [currentIdea, setCurrentIdea] = useState('')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [votedFor, setVotedFor] = useState<number | null>(null)
  const [timer, setTimer] = useState(60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem(`recre_session_${code}`)
    if (data) {
      const parsed = JSON.parse(data)
      setSessionData(parsed)

      // Collecter les problèmes business des participants
      const participantProblems = parsed.participants
        .filter((p: Participant) => p.profileCompleted && p.businessProblem)
        .map((p: Participant) => p.businessProblem as string)

      // Mélanger avec des problèmes par défaut si pas assez
      const allProblems = [...participantProblems]
      while (allProblems.length < 3) {
        const randomProblem = sampleProblems[Math.floor(Math.random() * sampleProblems.length)]
        if (!allProblems.includes(randomProblem)) {
          allProblems.push(randomProblem)
        }
      }

      setProblems(allProblems.sort(() => Math.random() - 0.5).slice(0, 3))
    }
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
      setPhase('voting')
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timer])

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">🧠</div>
      </div>
    )
  }

  const currentProblem = problems[currentRound]
  const totalRounds = problems.length
  const isLastRound = currentRound >= totalRounds - 1

  const startGame = () => {
    setPhase('problem')
  }

  const startBrainstorm = () => {
    setPhase('brainstorm')
    setTimer(60)
    setIsTimerRunning(true)
    setIdeas([])
    setCurrentIdea('')
  }

  const submitIdea = () => {
    if (currentIdea.trim()) {
      const participantNames = sessionData.participants
        .filter(p => p.profileCompleted)
        .map(p => p.name)
      const randomAuthor = participantNames[Math.floor(Math.random() * participantNames.length)]

      setIdeas(prev => [...prev, {
        author: randomAuthor,
        text: currentIdea.trim(),
        votes: 0
      }])
      setCurrentIdea('')
    }
  }

  const skipToVoting = () => {
    setIsTimerRunning(false)
    setPhase('voting')
  }

  const vote = (index: number) => {
    if (votedFor === null) {
      setVotedFor(index)
      setIdeas(prev => prev.map((idea, i) =>
        i === index ? { ...idea, votes: idea.votes + 1 } : idea
      ))

      // Simuler d'autres votes
      setTimeout(() => {
        setIdeas(prev => prev.map(idea => ({
          ...idea,
          votes: idea.votes + Math.floor(Math.random() * 5)
        })))
        setPhase('results')
      }, 1500)
    }
  }

  const nextRound = () => {
    if (isLastRound) {
      setPhase('finished')
    } else {
      setCurrentRound(prev => prev + 1)
      setPhase('problem')
      setVotedFor(null)
      setIdeas([])
    }
  }

  const sortedIdeas = [...ideas].sort((a, b) => b.votes - a.votes)
  const winningIdea = sortedIdeas[0]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .game-card {
          background: rgba(255, 255, 255, 0.03);
          border: 3px solid rgba(57, 255, 20, 0.3);
          border-radius: 24px;
          padding: 32px;
        }
        .problem-card {
          background: rgba(57, 255, 20, 0.1);
          border: 2px solid rgba(57, 255, 20, 0.4);
          border-radius: 16px;
          padding: 24px;
        }
        .idea-input {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          resize: none;
          min-height: 80px;
        }
        .idea-input:focus {
          outline: none;
          border-color: #39FF14;
        }
        .idea-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .idea-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .idea-card:hover:not(.voted) {
          border-color: #39FF14;
        }
        .idea-card.selected {
          border-color: #39FF14;
          background: rgba(57, 255, 20, 0.1);
        }
        .idea-card.voted {
          cursor: default;
        }
        .btn-action {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #39FF14 0%, #00FF88 100%);
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
          box-shadow: 0 0 30px rgba(57, 255, 20, 0.5);
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
          color: ${timer <= 10 ? '#FF3366' : '#39FF14'};
          text-shadow: 0 0 20px ${timer <= 10 ? '#FF3366' : '#39FF14'};
        }
        .idea-bubble {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 8px;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href={`/recre/${code}/dashboard`} className="text-white/60 hover:text-white transition">
            ← Quitter
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-[#39FF14] font-bold">Brainstorm Débile</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8">
        <div className="max-w-xl mx-auto">
          {/* INTRO */}
          {phase === 'intro' && (
            <div className="text-center">
              <div className="text-8xl mb-6">🧠</div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#39FF14',
                  textShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
                }}
              >
                BRAINSTORM DÉBILE
              </h1>
              <p className="text-white/70 text-lg mb-8">
                La pire idée gagne !<br />
                <span className="text-white/50 text-sm">Proposez les solutions les plus absurdes à de vrais problèmes.</span>
              </p>

              <div className="game-card mb-8">
                <h2 className="text-white font-bold mb-4">📋 Règles du jeu</h2>
                <ul className="text-left text-white/70 space-y-2">
                  <li>• Un vrai problème business s'affiche</li>
                  <li>• Vous avez 60 secondes pour proposer des idées</li>
                  <li>• Plus c'est absurde, mieux c'est !</li>
                  <li>• Votez pour la pire (meilleure) idée</li>
                </ul>
              </div>

              <p className="text-[#00FFFF] mb-4" style={{ textShadow: '0 0 10px #00FFFF' }}>
                {problems.length} problèmes à résoudre
              </p>

              <button onClick={startGame} className="btn-action">
                🧠 C'est parti !
              </button>
            </div>
          )}

          {/* PROBLEM */}
          {phase === 'problem' && (
            <div className="text-center">
              <div className="mb-4">
                <span className="text-white/60 text-sm">Problème {currentRound + 1}/{totalRounds}</span>
              </div>

              <div className="text-6xl mb-6">🤔</div>

              <div className="problem-card mb-8">
                <h2 className="text-xl font-bold text-[#39FF14] mb-2" style={{ textShadow: '0 0 10px #39FF14' }}>
                  Le problème :
                </h2>
                <p className="text-white text-lg">
                  "{currentProblem}"
                </p>
              </div>

              <p className="text-white/60 mb-6">
                Prêts à proposer les pires solutions possibles ?
              </p>

              <button onClick={startBrainstorm} className="btn-action">
                ⏱️ Lancer le brainstorm (60s)
              </button>
            </div>
          )}

          {/* BRAINSTORM */}
          {phase === 'brainstorm' && (
            <div>
              {/* Timer */}
              <div className="text-center mb-6">
                <div className="timer">{timer}s</div>
                <p className="text-white/60 text-sm">Proposez vos pires idées !</p>
              </div>

              {/* Problem reminder */}
              <div className="problem-card mb-6">
                <p className="text-[#39FF14] text-sm font-bold mb-1">Problème :</p>
                <p className="text-white">{currentProblem}</p>
              </div>

              {/* Ideas submitted */}
              {ideas.length > 0 && (
                <div className="mb-6 max-h-40 overflow-y-auto">
                  {ideas.map((idea, index) => (
                    <div key={index} className="idea-bubble">
                      <p className="text-white/80 text-sm">{idea.text}</p>
                      <p className="text-white/40 text-xs mt-1">— {idea.author}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="mb-4">
                <textarea
                  className="idea-input"
                  placeholder="Tapez votre idée absurde ici..."
                  value={currentIdea}
                  onChange={(e) => setCurrentIdea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      submitIdea()
                    }
                  }}
                />
              </div>

              <div className="space-y-3">
                <button onClick={submitIdea} className="btn-action" disabled={!currentIdea.trim()}>
                  💡 Envoyer l'idée
                </button>
                <button onClick={skipToVoting} className="btn-secondary">
                  Passer aux votes →
                </button>
              </div>
            </div>
          )}

          {/* VOTING */}
          {phase === 'voting' && (
            <div>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🗳️</div>
                <h2
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#FF00FF',
                    textShadow: '0 0 15px rgba(255, 0, 255, 0.5)'
                  }}
                >
                  VOTEZ POUR LA PIRE IDÉE !
                </h2>
              </div>

              <div className="problem-card mb-6">
                <p className="text-[#39FF14] text-sm font-bold mb-1">Problème :</p>
                <p className="text-white">{currentProblem}</p>
              </div>

              <div className="space-y-3">
                {ideas.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/60">Aucune idée soumise...</p>
                    <button onClick={nextRound} className="btn-secondary mt-4">
                      Passer au problème suivant →
                    </button>
                  </div>
                ) : (
                  ideas.map((idea, index) => (
                    <div
                      key={index}
                      className={`idea-card ${votedFor === index ? 'selected' : ''} ${votedFor !== null ? 'voted' : ''}`}
                      onClick={() => vote(index)}
                    >
                      <p className="text-white mb-2">{idea.text}</p>
                      <p className="text-white/40 text-sm">— {idea.author}</p>
                    </div>
                  ))
                )}
              </div>

              {votedFor !== null && (
                <p className="text-center text-[#39FF14] mt-4 animate-pulse">
                  ⏳ Comptage des votes...
                </p>
              )}
            </div>
          )}

          {/* RESULTS */}
          {phase === 'results' && winningIdea && (
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#39FF14',
                  textShadow: '0 0 15px rgba(57, 255, 20, 0.5)'
                }}
              >
                LA PIRE IDÉE GAGNE !
              </h2>

              <div className="game-card mb-6">
                <div className="text-4xl mb-4">🧠💥</div>
                <p className="text-white text-lg mb-4">"{winningIdea.text}"</p>
                <p className="text-[#FF00FF]">— {winningIdea.author}</p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-[#39FF14] font-bold">{winningIdea.votes} votes</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-white/60 text-sm mb-3">Autres propositions :</h3>
                <div className="space-y-2">
                  {sortedIdeas.slice(1).map((idea, index) => (
                    <div key={index} className="text-left p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                      <p className="text-white/70 text-sm">{idea.text}</p>
                      <p className="text-white/40 text-xs">— {idea.author} ({idea.votes} votes)</p>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={nextRound} className="btn-action">
                {isLastRound ? '🏆 Terminer' : '→ Problème suivant'}
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
                  color: '#39FF14',
                  textShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
                }}
              >
                BRAINSTORM TERMINÉ !
              </h1>
              <p className="text-white/60 mb-8">
                Bravo pour ces idées délicieusement absurdes ! 🧠💥
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
