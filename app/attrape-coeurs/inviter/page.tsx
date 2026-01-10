'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function InviterAmi() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  // Lien d'invitation unique (mock)
  const inviteLink = 'https://delidelo.netlify.app/join/abc123'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // En prod: envoyer l'email via API
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3000)
  }

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Hey ! Rejoins Déli Délo et laisse-moi jouer les Cupidons pour toi ! 🏹💘 ${inviteLink}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareSMS = () => {
    const text = encodeURIComponent(`Hey ! Rejoins Déli Délo pour qu'on puisse chasser des coeurs ensemble ! 🏹 ${inviteLink}`)
    window.open(`sms:?body=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      {/* Header */}
      <header className="px-4 py-4">
        <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/attrape-coeurs"
            className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
          >
            ← Retour
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Titre */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🦋</div>
            <h1 className="text-3xl font-bold text-[#FF00FF] mb-2" style={{ textShadow: '0 0 20px #FF00FF' }}>
              Inviter un ami
            </h1>
            <p className="text-[#00FFFF] font-bold">
              Pour jouer les Cupidons, il te faut des potes célibataires !
            </p>
          </div>

          {/* Card principale */}
          <div className="card-90s pink p-6 space-y-6">
            {/* Explication */}
            <div className="p-4 bg-[#330066] border-2 border-[#00FFFF]">
              <h3 className="font-bold text-[#00FFFF] mb-2">Comment ça marche ?</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-[#39FF14]">1.</span>
                  <span>Ton ami s'inscrit via ton lien</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#39FF14]">2.</span>
                  <span>Il/elle accepte que tu sois son Cupidon</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#39FF14]">3.</span>
                  <span>Tu peux chasser des coeurs pour lui/elle !</span>
                </li>
              </ul>
            </div>

            {/* Partage rapide */}
            <div className="space-y-3">
              <h3 className="font-bold text-[#FF00FF] uppercase text-sm">Partager le lien</h3>

              <button
                onClick={shareWhatsApp}
                className="w-full py-3 bg-[#25D366] border-2 border-[#25D366] text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>

              <button
                onClick={shareSMS}
                className="w-full py-3 bg-[#00FFFF] border-2 border-[#00FFFF] text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <span className="text-xl">📱</span>
                SMS
              </button>

              {/* Copier le lien */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="input-90s flex-1 text-sm"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 border-2 font-bold transition ${
                    copied
                      ? 'bg-[#39FF14] border-[#39FF14] text-black'
                      : 'bg-[#FF00FF] border-[#FF00FF] text-white hover:opacity-90'
                  }`}
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
              {copied && (
                <p className="text-center text-[#39FF14] text-sm font-bold animate-pulse">
                  Lien copié !
                </p>
              )}
            </div>

            {/* Ou par email */}
            <div className="pt-4 border-t-2 border-white/10">
              <h3 className="font-bold text-[#FF00FF] uppercase text-sm mb-3">Ou par email</h3>
              <form onSubmit={handleEmailInvite} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@ami.com"
                  className="input-90s flex-1"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF00FF] border-2 border-[#FF00FF] text-white font-bold hover:opacity-90 transition"
                >
                  Envoyer
                </button>
              </form>
              {sent && (
                <p className="text-center text-[#39FF14] text-sm font-bold mt-2 animate-pulse">
                  Invitation envoyée !
                </p>
              )}
            </div>
          </div>

          {/* Info bonus */}
          <div className="mt-6 p-4 bg-[#FFFF00]/10 border-2 border-[#FFFF00] text-center">
            <p className="text-[#FFFF00] font-bold text-sm">
              🎁 +50 points Cupidon pour chaque ami qui s'inscrit !
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
