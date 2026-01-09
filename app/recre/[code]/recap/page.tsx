'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Participant {
  name: string
  photo?: string
  jobTitle?: string
  company?: string
  funFact?: string
  absurdPitch?: string
  linkedinUrl?: string
  profileCompleted: boolean
  isOrganizer: boolean
}

interface SessionData {
  eventName: string
  eventDate: string
  location: string
  organizerName: string
  participants: Participant[]
}

export default function RecapPage() {
  const params = useParams()
  const code = params.code as string

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [emailSent, setEmailSent] = useState(false)

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
    month: 'long',
    year: 'numeric'
  })

  const completedParticipants = sessionData.participants?.filter(p => p.profileCompleted) || []

  const sendRecapEmail = () => {
    // Simulation d'envoi d'email
    setEmailSent(true)
    setTimeout(() => {
      alert('📧 Récap envoyé à tous les participants !')
    }, 500)
  }

  const downloadVCards = () => {
    // Générer les vCards pour tous les participants
    let vcardContent = ''

    completedParticipants.forEach(p => {
      vcardContent += `BEGIN:VCARD
VERSION:3.0
FN:${p.name}
TITLE:${p.jobTitle || ''}
ORG:${p.company || ''}
NOTE:Rencontré(e) lors de ${sessionData.eventName}
END:VCARD
`
    })

    const blob = new Blob([vcardContent], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recre-business-${code}-contacts.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .recap-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 0, 255, 0.3);
          border-radius: 20px;
          padding: 24px;
        }
        .participant-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        .participant-card:hover {
          border-color: rgba(255, 0, 255, 0.3);
        }
        .btn-primary {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
        }
        .btn-secondary {
          width: 100%;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
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
        .linkedin-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(0, 119, 181, 0.2);
          border: 1px solid rgba(0, 119, 181, 0.5);
          border-radius: 8px;
          color: #0077B5;
          font-size: 0.85rem;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .linkedin-btn:hover {
          background: rgba(0, 119, 181, 0.3);
        }
        .highlight-box {
          background: rgba(57, 255, 20, 0.1);
          border: 2px solid rgba(57, 255, 20, 0.3);
          border-radius: 16px;
          padding: 20px;
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href={`/recre/${code}/dashboard`} className="text-white/60 hover:text-white transition">
            ← Tableau de bord
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-white/60 text-sm">Récré Business</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-7xl mb-4">🎉</div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#FF00FF',
                textShadow: '0 0 20px rgba(255, 0, 255, 0.5)'
              }}
            >
              RÉCAP DE LA SOIRÉE
            </h1>
            <p className="text-white/60">{sessionData.eventName}</p>
            <p className="text-white/40 text-sm capitalize">{formattedDate}</p>
          </div>

          {/* Stats */}
          <div className="highlight-box mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-[#39FF14]" style={{ textShadow: '0 0 10px #39FF14' }}>
                  {completedParticipants.length}
                </p>
                <p className="text-white/60 text-sm">Participants</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#00FFFF]" style={{ textShadow: '0 0 10px #00FFFF' }}>
                  4
                </p>
                <p className="text-white/60 text-sm">Jeux joués</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#FF00FF]" style={{ textShadow: '0 0 10px #FF00FF' }}>
                  ∞
                </p>
                <p className="text-white/60 text-sm">Fous rires</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mb-10">
            <button onClick={sendRecapEmail} className="btn-primary" disabled={emailSent}>
              {emailSent ? '✓ Récap envoyé !' : '📧 Envoyer le récap à tous'}
            </button>
            <button onClick={downloadVCards} className="btn-secondary">
              📇 Télécharger les contacts (vCard)
            </button>
          </div>

          {/* Participants */}
          <div className="mb-8">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <span>👥</span> Les participants
            </h2>

            <div className="space-y-4">
              {completedParticipants.map((p, index) => (
                <div key={index} className="participant-card">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {p.photo || '👤'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold text-lg">{p.name}</span>
                        {p.isOrganizer && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-[#FF00FF]/20 text-[#FF00FF]">
                            Organisateur
                          </span>
                        )}
                      </div>
                      {p.jobTitle && (
                        <p className="text-white/70">
                          {p.jobTitle}
                          {p.company && <span className="text-white/50"> @ {p.company}</span>}
                        </p>
                      )}
                      {p.funFact && (
                        <p className="text-white/50 text-sm mt-2 italic">
                          💡 "{p.funFact}"
                        </p>
                      )}
                      {p.absurdPitch && (
                        <p className="text-[#00FFFF]/70 text-sm mt-1 italic">
                          🎤 "{p.absurdPitch}"
                        </p>
                      )}
                      {p.linkedinUrl && (
                        <a
                          href={p.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="linkedin-btn mt-3 inline-flex"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next event */}
          <div className="recap-card mb-8">
            <h3 className="text-[#FF00FF] font-bold mb-4" style={{ textShadow: '0 0 10px #FF00FF' }}>
              🔄 Organiser la prochaine ?
            </h3>
            <p className="text-white/70 mb-4">
              Cette soirée vous a plu ? Organisez la prochaine Récré Business !
            </p>
            <Link
              href="/business"
              className="block text-center py-3 px-6 rounded-xl font-bold transition hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)',
                color: '#0D001A'
              }}
            >
              🍽️ Créer une nouvelle Récré
            </Link>
          </div>

          {/* Feedback */}
          <div className="text-center text-white/40 text-sm">
            <p>Une suggestion ? Un retour ?</p>
            <a href="mailto:feedback@gamecrush.app" className="text-[#00FFFF] hover:underline">
              Écrivez-nous →
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
