'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface SessionData {
  eventName: string
  eventDate: string
  location: string
  organizerName: string
  participants: Array<{
    name: string
    profileCompleted: boolean
  }>
}

export default function ReadyPage() {
  const params = useParams()
  const code = params.code as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  useEffect(() => {
    const data = localStorage.getItem(`recre_session_${code}`)
    if (data) {
      setSessionData(JSON.parse(data))
    }
  }, [code])

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">🍽️</div>
      </div>
    )
  }

  const formattedDate = new Date(sessionData.eventDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  const completedCount = sessionData.participants?.filter(p => p.profileCompleted).length || 0
  const totalCount = sessionData.participants?.length || 0

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .success-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(57, 255, 20, 0.15);
          border: 2px solid rgba(57, 255, 20, 0.5);
          border-radius: 50px;
          color: #39FF14;
          font-weight: bold;
        }
        .info-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 0, 255, 0.3);
          border-radius: 20px;
          padding: 24px;
        }
        .game-preview {
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .game-preview:hover {
          background: rgba(255, 255, 255, 0.06);
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-2xl">🍽️</span>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8">
        <div className="max-w-xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-10">
            <div className="text-7xl mb-6 animate-bounce">🎉</div>
            <div className="success-badge mb-6">
              <span>✓</span> Profil complété !
            </div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#FF00FF',
                textShadow: '0 0 20px rgba(255, 0, 255, 0.5)'
              }}
            >
              T'ES PRÊT·E !
            </h1>
            <p className="text-white/60">
              On se retrouve le jour J pour s'éclater 🎮
            </p>
          </div>

          {/* Event Reminder */}
          <div className="info-card mb-6">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>📅</span> Rendez-vous
            </h2>
            <div className="space-y-2 text-white/80">
              <p className="text-lg capitalize">{formattedDate}</p>
              {sessionData.location && (
                <p className="flex items-center gap-2">
                  <span>📍</span> {sessionData.location}
                </p>
              )}
              <p className="text-white/60 text-sm">
                Organisé par {sessionData.organizerName}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Participants inscrits</span>
                <span className="text-[#00FFFF] font-bold">{completedCount}/{totalCount}</span>
              </div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedCount / totalCount) * 100}%`,
                    background: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Games Preview */}
          <div className="mb-8">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>🎮</span> Les jeux de ce soir
            </h2>
            <div className="space-y-3">
              <div className="game-preview">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <h3 className="text-[#FF00FF] font-bold" style={{ textShadow: '0 0 10px #FF00FF' }}>
                      La Tête de l'Emploi
                    </h3>
                    <p className="text-white/60 text-sm">
                      Devinez qui fait quoi grâce aux indices !
                    </p>
                  </div>
                </div>
              </div>

              <div className="game-preview">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎤</span>
                  <div>
                    <h3 className="text-[#00FFFF] font-bold" style={{ textShadow: '0 0 10px #00FFFF' }}>
                      Le Pitch Absurde
                    </h3>
                    <p className="text-white/60 text-sm">
                      Présentez-vous de façon ridicule !
                    </p>
                  </div>
                </div>
              </div>

              <div className="game-preview">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <h3 className="text-[#39FF14] font-bold" style={{ textShadow: '0 0 10px #39FF14' }}>
                      Brainstorm Débile
                    </h3>
                    <p className="text-white/60 text-sm">
                      Proposez les pires solutions possibles !
                    </p>
                  </div>
                </div>
              </div>

              <div className="game-preview">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚖️</span>
                  <div>
                    <h3 className="text-[#FF6600] font-bold" style={{ textShadow: '0 0 10px #FF6600' }}>
                      Le Procès du Bureau
                    </h3>
                    <p className="text-white/60 text-sm">
                      Débats absurdes sur le monde du travail !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-6 rounded-xl mb-8" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '2px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>💡</span> Conseils pour le jour J
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <span>📱</span>
                <span>Garde ton téléphone chargé pour voter !</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🤫</span>
                <span>Ne révèle pas ton métier avant le jeu</span>
              </li>
              <li className="flex items-start gap-2">
                <span>😂</span>
                <span>Le plus important : s'amuser !</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={`/recre/${code}`}
              className="block w-full text-center py-4 rounded-xl font-bold transition hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
            >
              👥 Voir les autres participants
            </Link>

            <Link
              href="/"
              className="block w-full text-center py-3 text-white/40 hover:text-white transition text-sm"
            >
              Découvrir GameCrush →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
