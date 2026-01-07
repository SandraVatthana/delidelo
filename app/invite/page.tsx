'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function InvitePage() {
  const [copiedLink, setCopiedLink] = useState(false)

  // Copier le lien
  const copyLink = () => {
    navigator.clipboard.writeText('https://delidelo.app/join/ABC123')
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Partager
  const shareOn = async (platform: string) => {
    const message = "Viens jouer avec moi sur Déli Délo ! 🎠 L'app où les grands redeviennent petits ✨ https://delidelo.app/join/ABC123"
    const text = encodeURIComponent(message)

    // Pour Instagram, Snapchat, TikTok : copier le texte et ouvrir l'app
    if (['instagram', 'snapchat', 'tiktok'].includes(platform)) {
      await navigator.clipboard.writeText(message)
      alert('📋 Message copié ! Colle-le dans ton ' +
        (platform === 'instagram' ? 'story ou DM Instagram' :
         platform === 'snapchat' ? 'snap ou chat Snapchat' :
         'TikTok') + ' 🎠')
      return
    }

    let shareUrl = ''
    switch (platform) {
      case 'sms':
        shareUrl = `sms:?body=${text}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      <style jsx>{`
        .top-nav {
          display: none;
        }
        @media (min-width: 768px) {
          .top-nav {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
            padding-bottom: 8px;
          }
          .top-nav-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            font-size: 0.75rem;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.8);
            transition: all 0.2s;
            border: 2px solid rgba(255, 255, 255, 0.25);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
          }
          .top-nav-item:hover {
            color: #FF00FF;
            border-color: #FF00FF;
            background: rgba(255, 0, 255, 0.15);
            text-shadow: 0 0 10px #FF00FF;
            transform: translateY(-2px);
          }
          .top-nav-item.active {
            color: #FF00FF;
            border-color: #FF00FF;
            background: rgba(255, 0, 255, 0.2);
            text-shadow: 0 0 10px #FF00FF;
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
          }
          .top-nav-item .nav-emoji {
            font-size: 1.2rem;
          }
        }
      `}</style>

      {/* Header avec navigation */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-5">
          {/* Ligne 1: Logo + Notifications */}
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-3">
            <Link href="/" className="logo-90s text-xl">
              <span className="animate-spin inline-block text-lg">🎠</span>
              Déli Délo
            </Link>

            <button className="relative p-2 text-white/60 hover:text-[#FFFF00] transition">
              <span className="text-2xl">🔔</span>
            </button>
          </div>

          {/* Navigation desktop uniquement */}
          <nav className="max-w-5xl mx-auto">
            <div className="top-nav">
              <Link href="/dashboard" className="top-nav-item">
                <span className="nav-emoji">🏠</span>
                Accueil
              </Link>
              <Link href="/games/jeu-oie" className="top-nav-item">
                <span className="nav-emoji">🎲</span>
                Tirage
              </Link>
              <Link href="/games" className="top-nav-item">
                <span className="nav-emoji">🎮</span>
                JEUX
              </Link>
              <Link href="/messages" className="top-nav-item">
                <span className="nav-emoji">💬</span>
                Messages
              </Link>
              <Link href="/events" className="top-nav-item" style={{ color: '#FF6600' }}>
                <span className="nav-emoji">🍻</span>
                Events
              </Link>
              <Link href="/invite" className="top-nav-item active">
                <span className="nav-emoji">👯</span>
                Inviter
              </Link>
              <Link href="/profile" className="top-nav-item">
                <span className="nav-emoji">👤</span>
                Profil
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Contenu principal - Centré avec plus d'espace */}
      <main className="px-6 py-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Titre principal */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎁</div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'Bangers, cursive', color: '#FF00FF', textShadow: '0 0 15px #FF00FF' }}
          >
            INVITE TES POTES !
          </h1>
          <p className="text-white/70 text-lg">
            Chaque ami = <span className="text-[#FFFF00] font-bold">1 semaine Premium</span> pour toi
          </p>
        </div>


        {/* Lien de parrainage - Plus grand */}
        <div className="mb-8">
          <p className="text-sm text-white/50 uppercase mb-3 flex items-center gap-2">
            <span>🔗</span> TON LIEN
          </p>
          <div className="card-90s p-4" style={{ borderColor: '#00FFFF' }}>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value="delidelo.app/join/ABC123"
                readOnly
                className="input-90s flex-1 text-base py-3"
                style={{ background: '#1A0033' }}
              />
              <button
                onClick={copyLink}
                className="btn-90s px-6 py-3 text-lg"
                style={{
                  borderColor: copiedLink ? '#39FF14' : '#00FFFF',
                  color: copiedLink ? '#39FF14' : '#00FFFF',
                  minWidth: '80px'
                }}
              >
                {copiedLink ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Partage rapide - Boutons plus grands avec labels */}
        <div className="mb-8">
          <p className="text-sm text-white/50 uppercase mb-4 flex items-center gap-2">
            <span>📤</span> PARTAGE RAPIDE
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            <button
              onClick={() => shareOn('whatsapp')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition hover:scale-105"
              style={{ background: '#25D366' }}
            >
              <span className="text-3xl">📱</span>
              <span className="text-xs font-bold text-white">WhatsApp</span>
            </button>
            <button
              onClick={() => shareOn('sms')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition hover:scale-105"
              style={{ background: '#39FF14' }}
            >
              <span className="text-3xl">💬</span>
              <span className="text-xs font-bold text-[#1A0033]">SMS</span>
            </button>
            <button
              onClick={() => shareOn('instagram')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition hover:scale-105"
              style={{ background: 'linear-gradient(45deg, #405DE6, #833AB4, #E1306C)' }}
            >
              <span className="text-3xl">📸</span>
              <span className="text-xs font-bold text-white">Insta</span>
            </button>
            <button
              onClick={() => shareOn('snapchat')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition hover:scale-105"
              style={{ background: '#FFFC00' }}
            >
              <span className="text-3xl">👻</span>
              <span className="text-xs font-bold text-[#1A0033]">Snap</span>
            </button>
            <button
              onClick={() => shareOn('tiktok')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition hover:scale-105"
              style={{ background: '#000', border: '2px solid #00F2EA' }}
            >
              <span className="text-3xl">🎵</span>
              <span className="text-xs font-bold text-white">TikTok</span>
            </button>
          </div>
        </div>

        {/* Bonus - Plus d'espace */}
        <div
          className="p-6 text-center rounded-xl"
          style={{ border: '2px dashed #39FF14', background: 'rgba(57, 255, 20, 0.05)' }}
        >
          <p className="text-[#39FF14] font-bold text-lg mb-3">🎁 Bonus Parrainage</p>
          <p className="text-white/70 text-base mb-2">
            Chaque ami qui s'inscrit via ton lien te donne <strong className="text-[#FFFF00]">7 jours de Premium gratuit</strong> !
          </p>
          <p className="text-white/50 text-sm">
            Pas de limite - invite autant que tu veux !
          </p>
        </div>
      </main>
    </div>
  )
}
