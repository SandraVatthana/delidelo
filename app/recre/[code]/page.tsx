'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Participant {
  name: string
  email: string
  isOrganizer: boolean
  profileCompleted: boolean
}

interface SessionData {
  eventName: string
  eventDate: string
  location: string
  maxParticipants: number
  organizerName: string
  participants: Participant[]
  status: string
}

export default function RecreInvitePage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger les données de session depuis localStorage
    const data = localStorage.getItem(`recre_session_${code}`)
    if (data) {
      setSessionData(JSON.parse(data))
    }
    setLoading(false)
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">🍽️</div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl text-white font-bold mb-2">Session introuvable</h1>
          <p className="text-white/60 mb-6">Ce lien n'est plus valide ou a expiré.</p>
          <Link href="/business" className="text-[#00FFFF] hover:underline">
            Créer ma propre Récré Business →
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(sessionData.eventDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const participantCount = sessionData.participants?.length || 1
  const completedCount = sessionData.participants?.filter(p => p.profileCompleted).length || 0

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .event-card {
          background: rgba(255, 255, 255, 0.03);
          border: 3px solid rgba(255, 0, 255, 0.3);
          border-radius: 20px;
          padding: 32px;
        }
        .participant-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
        }
        .btn-join {
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
        .btn-join:hover {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-2">🍽️</div>
          <p className="text-[#FF00FF] text-sm font-bold" style={{ textShadow: '0 0 10px #FF00FF' }}>
            RÉCRÉ BUSINESS
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8">
        <div className="max-w-xl mx-auto">
          {/* Event Info */}
          <div className="event-card mb-8">
            <h1
              className="text-2xl font-bold text-center mb-4"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#FF00FF',
                textShadow: '0 0 15px rgba(255, 0, 255, 0.5)'
              }}
            >
              {sessionData.eventName}
            </h1>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white/80">
                <span className="text-xl">📅</span>
                <span className="capitalize">{formattedDate}</span>
              </div>
              {sessionData.location && (
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-xl">📍</span>
                  <span>{sessionData.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-white/80">
                <span className="text-xl">👤</span>
                <span>Organisé par {sessionData.organizerName}</span>
              </div>
            </div>

            <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(0, 255, 255, 0.1)' }}>
              <p className="text-[#00FFFF]" style={{ textShadow: '0 0 10px #00FFFF' }}>
                {sessionData.organizerName} t'invite à une soirée networking fun !
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mb-8">
            <p className="text-white/60 text-center mb-4">
              Avant la soirée, remplis ton profil.<br />
              Ça prend 2 min. Promis.
            </p>
            <button
              onClick={() => router.push(`/recre/${code}/join`)}
              className="btn-join"
            >
              🎭 Créer mon profil
            </button>
          </div>

          {/* Participants */}
          <div className="mb-8">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>👥</span>
              Participants ({participantCount}/{sessionData.maxParticipants})
            </h2>

            <div className="space-y-2">
              {sessionData.participants?.map((p, index) => (
                <div key={index} className="participant-row">
                  <span className={p.profileCompleted ? 'text-[#39FF14]' : 'text-white/40'}>
                    {p.profileCompleted ? '✅' : '⏳'}
                  </span>
                  <span className="text-white">
                    {p.name}
                    {p.isOrganizer && <span className="text-[#FF00FF] text-xs ml-2">(organisateur)</span>}
                  </span>
                </div>
              ))}

              {/* Places dispos */}
              {Array.from({ length: sessionData.maxParticipants - participantCount }).map((_, i) => (
                <div key={`empty-${i}`} className="participant-row opacity-40">
                  <span>◯</span>
                  <span className="text-white/60">Place disponible</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info jeux */}
          <div className="p-6 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '2px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 className="text-[#00FFFF] font-bold mb-4" style={{ textShadow: '0 0 10px #00FFFF' }}>
              🎮 Au programme
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span>🎭</span> La Tête de l'Emploi - Devinez les métiers
              </li>
              <li className="flex items-center gap-2">
                <span>🎤</span> Le Pitch Absurde - Présentations ridicules
              </li>
              <li className="flex items-center gap-2">
                <span>🧠</span> Brainstorm Débile - La pire idée gagne
              </li>
              <li className="flex items-center gap-2">
                <span>⚖️</span> Le Procès du Bureau - Débats absurdes
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Tu veux organiser ta propre Récré Business ?
            </p>
            <Link href="/business" className="text-[#FF00FF] text-sm hover:underline">
              C'est par ici →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
