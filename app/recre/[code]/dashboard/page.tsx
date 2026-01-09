'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Participant {
  name: string
  email: string
  photo?: string
  jobTitle?: string
  company?: string
  funFact?: string
  absurdPitch?: string
  businessProblem?: string
  isOrganizer: boolean
  profileCompleted: boolean
}

interface SessionData {
  eventName: string
  eventDate: string
  location: string
  maxParticipants: number
  organizerName: string
  organizerEmail: string
  participants: Participant[]
  status: string
  kitType: string
}

const games = [
  {
    id: 'tete-emploi',
    name: 'La Tête de l\'Emploi',
    emoji: '🎭',
    description: 'Devinez qui fait quoi',
    color: '#FF00FF',
    minPlayers: 4,
  },
  {
    id: 'pitch-absurde',
    name: 'Le Pitch Absurde',
    emoji: '🎤',
    description: 'Présentations ridicules',
    color: '#00FFFF',
    minPlayers: 3,
  },
  {
    id: 'brainstorm-debile',
    name: 'Brainstorm Débile',
    emoji: '🧠',
    description: 'Les pires solutions',
    color: '#39FF14',
    minPlayers: 4,
  },
  {
    id: 'proces-bureau',
    name: 'Le Procès du Bureau',
    emoji: '⚖️',
    description: 'Débats absurdes',
    color: '#FF6600',
    minPlayers: 4,
  },
]

export default function DashboardPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [activeTab, setActiveTab] = useState<'participants' | 'games'>('participants')
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem(`recre_session_${code}`)
    if (data) {
      setSessionData(JSON.parse(data))
    }
  }, [code])

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl text-white font-bold mb-2">Session introuvable</h1>
          <Link href="/business" className="text-[#00FFFF] hover:underline">
            Créer une nouvelle Récré Business →
          </Link>
        </div>
      </div>
    )
  }

  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/recre/${code}`
  const completedCount = sessionData.participants?.filter(p => p.profileCompleted).length || 0
  const totalCount = sessionData.participants?.length || 0

  const formattedDate = new Date(sessionData.eventDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
    alert('Lien copié !')
  }

  const startGame = (gameId: string) => {
    router.push(`/recre/${code}/play/${gameId}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .tab-btn {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: none;
          color: white/60;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
        }
        .tab-btn.active {
          color: #FF00FF;
          border-bottom-color: #FF00FF;
        }
        .participant-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.3s ease;
        }
        .participant-card:hover {
          border-color: rgba(255, 0, 255, 0.3);
        }
        .game-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .game-card:hover {
          transform: scale(1.02);
          border-color: var(--game-color);
          box-shadow: 0 0 30px var(--game-shadow);
        }
        .btn-start {
          padding: 12px 24px;
          background: linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-start:hover {
          transform: scale(1.05);
        }
        .btn-start:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .modal-content {
          background: #1A0033;
          border: 2px solid rgba(255, 0, 255, 0.3);
          border-radius: 20px;
          padding: 32px;
          max-width: 400px;
          width: 90%;
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/business" className="flex items-center gap-2 text-white/60 hover:text-white transition">
            <span className="text-2xl">🍽️</span>
            <span className="text-sm">Récré Business</span>
          </Link>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition hover:scale-105"
            style={{ background: 'rgba(0, 255, 255, 0.2)', color: '#00FFFF' }}
          >
            📤 Inviter
          </button>
        </div>
      </header>

      {/* Event Info */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="max-w-2xl mx-auto">
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: 'Bangers, cursive',
              color: '#FF00FF',
              textShadow: '0 0 15px rgba(255, 0, 255, 0.5)'
            }}
          >
            {sessionData.eventName}
          </h1>
          <div className="flex flex-wrap gap-4 text-white/60 text-sm">
            <span className="flex items-center gap-1">
              <span>📅</span> {formattedDate}
            </span>
            {sessionData.location && (
              <span className="flex items-center gap-1">
                <span>📍</span> {sessionData.location}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Profils complétés</span>
              <span className="text-[#39FF14] font-bold">{completedCount}/{totalCount}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                  background: 'linear-gradient(135deg, #39FF14 0%, #00FF88 100%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="max-w-2xl mx-auto flex">
          <button
            className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            👥 Participants ({totalCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            🎮 Jeux
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <div className="space-y-4">
              {sessionData.participants?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">👻</div>
                  <p className="text-white/60">Aucun participant pour l'instant</p>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="mt-4 text-[#00FFFF] font-bold hover:underline"
                  >
                    Envoyer des invitations →
                  </button>
                </div>
              ) : (
                sessionData.participants?.map((p, index) => (
                  <div key={index} className="participant-card">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">
                        {p.photo || '👤'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold">{p.name}</span>
                          {p.isOrganizer && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[#FF00FF]/20 text-[#FF00FF]">
                              Organisateur
                            </span>
                          )}
                          <span className={`text-sm ${p.profileCompleted ? 'text-[#39FF14]' : 'text-white/40'}`}>
                            {p.profileCompleted ? '✓ Profil OK' : '⏳ En attente'}
                          </span>
                        </div>
                        {p.jobTitle && (
                          <p className="text-white/60 text-sm">
                            {p.jobTitle}
                            {p.company && ` @ ${p.company}`}
                          </p>
                        )}
                        {p.funFact && (
                          <p className="text-white/40 text-xs mt-2 italic">
                            "{p.funFact}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Empty slots */}
              {Array.from({ length: sessionData.maxParticipants - totalCount }).map((_, i) => (
                <div key={`empty-${i}`} className="participant-card opacity-40">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                      <span className="text-white/40">+</span>
                    </div>
                    <span className="text-white/40">Place disponible</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Games Tab */}
          {activeTab === 'games' && (
            <div className="space-y-4">
              {completedCount < 3 && (
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(255, 102, 0, 0.1)', border: '1px solid rgba(255, 102, 0, 0.3)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="text-[#FF6600] font-bold text-sm">Pas assez de joueurs</p>
                      <p className="text-white/60 text-sm">
                        Il faut au moins 3 profils complétés pour lancer un jeu.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {games.map((game) => {
                const canPlay = completedCount >= game.minPlayers
                return (
                  <div
                    key={game.id}
                    className="game-card"
                    style={{
                      '--game-color': game.color,
                      '--game-shadow': `${game.color}40`
                    } as React.CSSProperties}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{game.emoji}</span>
                        <div>
                          <h3
                            className="font-bold text-lg"
                            style={{ color: game.color, textShadow: `0 0 10px ${game.color}` }}
                          >
                            {game.name}
                          </h3>
                          <p className="text-white/60 text-sm">{game.description}</p>
                          <p className="text-white/40 text-xs mt-1">
                            Min. {game.minPlayers} joueurs
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => startGame(game.id)}
                        disabled={!canPlay}
                        className="btn-start"
                      >
                        {canPlay ? '▶ Lancer' : '🔒'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📤</span> Inviter des participants
            </h2>

            <div className="mb-4">
              <p className="text-white/60 text-sm mb-2">Lien d'invitation :</p>
              <div
                className="p-3 rounded-lg font-mono text-sm break-all"
                style={{ background: 'rgba(0, 0, 0, 0.3)', color: '#00FFFF' }}
              >
                {inviteLink}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={copyLink}
                className="w-full py-3 rounded-lg font-bold transition hover:scale-[1.02]"
                style={{ background: '#FF00FF', color: 'white' }}
              >
                📋 Copier le lien
              </button>
              <button
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(`Rejoins notre Récré Business ! ${inviteLink}`)}`, '_blank')
                }}
                className="w-full py-3 rounded-lg font-bold transition hover:scale-[1.02]"
                style={{ background: 'rgba(37, 211, 102, 0.2)', color: '#25D366', border: '2px solid #25D366' }}
              >
                📱 Partager sur WhatsApp
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-2 text-white/60 hover:text-white transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
