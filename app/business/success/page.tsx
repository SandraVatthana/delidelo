'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function BusinessSuccessContent() {
  const searchParams = useSearchParams()
  const sessionCode = searchParams.get('code') || ''
  const [copied, setCopied] = useState(false)
  const [sessionData, setSessionData] = useState<{
    eventName: string
    eventDate: string
    location: string
    organizerName: string
  } | null>(null)

  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/recre/${sessionCode}`

  useEffect(() => {
    // Charger les données de session
    const data = localStorage.getItem(`recre_session_${sessionCode}`)
    if (data) {
      setSessionData(JSON.parse(data))
    }
  }, [sessionCode])

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getMessage = () => {
    const date = sessionData?.eventDate
      ? new Date(sessionData.eventDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : '[DATE]'

    return `Hello ! 🍽️

Je t'invite à une Récré Business le ${date}.
C'est un dîner networking... mais fun.

Avant la soirée, remplis ton profil ici :
${inviteLink}

Ça prend 2 min et ça va être drôle, promis ! 😄`
  }

  const copyMessage = async () => {
    await navigator.clipboard.writeText(getMessage())
    alert('Message copié !')
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getMessage())}`, '_blank')
  }

  const shareEmail = () => {
    const subject = encodeURIComponent(`Tu viens à la Récré Business ?`)
    const body = encodeURIComponent(getMessage())
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .success-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(57, 255, 20, 0.3);
          border-radius: 20px;
          padding: 32px;
        }
        .link-box {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 0, 255, 0.3);
          border-radius: 12px;
          padding: 16px;
          font-family: monospace;
          color: #00FFFF;
          word-break: break-all;
        }
        .btn-copy {
          padding: 12px 24px;
          background: #FF00FF;
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-copy:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        }
        .btn-share {
          flex: 1;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-share:hover {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
        }
        .message-box {
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          white-space: pre-wrap;
          color: white/80;
          font-size: 0.9rem;
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/business" className="flex items-center gap-2 text-white/60 hover:text-white transition">
            <span className="text-2xl">🍽️</span>
            <span>Récré Business</span>
          </Link>
          <Link
            href={`/recre/${sessionCode}/dashboard`}
            className="text-[#00FFFF] text-sm font-bold hover:underline"
          >
            Tableau de bord →
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-12">
        <div className="max-w-xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#39FF14',
                textShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
              }}
            >
              TA RÉCRÉ BUSINESS EST PRÊTE !
            </h1>
            {sessionData && (
              <p className="text-white/60">
                {sessionData.eventName}
              </p>
            )}
          </div>

          {/* Lien d'invitation */}
          <div className="success-card mb-8">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="text-xl">🔗</span>
              Envoie ce lien à tes invités :
            </h2>

            <div className="link-box mb-4">
              {inviteLink}
            </div>

            <div className="flex gap-3 flex-wrap">
              <button onClick={copyLink} className="btn-copy">
                {copied ? '✓ Copié !' : '📋 Copier le lien'}
              </button>
            </div>
          </div>

          {/* Boutons de partage */}
          <div className="flex gap-3 mb-8">
            <button onClick={shareWhatsApp} className="btn-share">
              <span>📱</span> WhatsApp
            </button>
            <button onClick={shareEmail} className="btn-share">
              <span>📧</span> Email
            </button>
          </div>

          {/* Message type */}
          <div className="mb-8">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>💬</span> Message type à envoyer :
            </h3>
            <div className="message-box text-white/70">
              {getMessage()}
            </div>
            <button
              onClick={copyMessage}
              className="mt-3 text-[#00FFFF] text-sm font-bold hover:underline"
            >
              📋 Copier le message
            </button>
          </div>

          {/* Next steps */}
          <div className="p-6 rounded-xl" style={{ background: 'rgba(255, 0, 255, 0.1)', border: '2px solid rgba(255, 0, 255, 0.3)' }}>
            <h3 className="text-[#FF00FF] font-bold mb-4" style={{ textShadow: '0 0 10px #FF00FF' }}>
              📋 Prochaines étapes
            </h3>
            <ol className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FF00FF]/20 flex items-center justify-center text-[#FF00FF] text-sm font-bold">1</span>
                <span>Envoie le lien à tes invités</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FF00FF]/20 flex items-center justify-center text-[#FF00FF] text-sm font-bold">2</span>
                <span>Remplis toi aussi ton profil (depuis le lien)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FF00FF]/20 flex items-center justify-center text-[#FF00FF] text-sm font-bold">3</span>
                <span>Le jour J, lance les jeux depuis ton tableau de bord</span>
              </li>
            </ol>
          </div>

          {/* CTA Dashboard */}
          <div className="mt-8 text-center">
            <Link
              href={`/recre/${sessionCode}/dashboard`}
              className="inline-block px-8 py-4 rounded-xl font-bold text-lg transition hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00FFFF, #00B4D8)',
                color: '#0D001A'
              }}
            >
              📊 Voir mon tableau de bord
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function BusinessSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">🍽️</div>
      </div>
    }>
      <BusinessSuccessContent />
    </Suspense>
  )
}
