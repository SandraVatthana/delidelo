'use client'

import { useState } from 'react'
import Link from 'next/link'

// Types
interface SocialPlatform {
  id: string
  name: string
  icon: string
  color: string
  gradient?: string
  connected: boolean
  friends: Friend[]
}

interface Friend {
  id: string
  name: string
  avatar: string
  invited: boolean
  joined: boolean
}

// Plateformes sociales
const initialPlatforms: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: '#E1306C',
    gradient: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
    connected: false,
    friends: [],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#00F2EA',
    gradient: 'linear-gradient(45deg, #00F2EA, #FF0050)',
    connected: false,
    friends: [],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '👍',
    color: '#1877F2',
    connected: false,
    friends: [],
  },
]

// Amis simulés
const mockFriends: Record<string, Friend[]> = {
  instagram: [
    { id: '1', name: 'emma_photo', avatar: '👩‍🦰', invited: false, joined: false },
    { id: '2', name: 'alex.music', avatar: '👨‍🦱', invited: false, joined: false },
    { id: '3', name: 'julie_travel', avatar: '👱‍♀️', invited: false, joined: true },
    { id: '4', name: 'max_gaming', avatar: '🧑', invited: true, joined: false },
    { id: '5', name: 'sarah.art', avatar: '👩', invited: false, joined: false },
  ],
  tiktok: [
    { id: '6', name: '@dance_king', avatar: '🕺', invited: false, joined: false },
    { id: '7', name: '@comedy_queen', avatar: '👸', invited: false, joined: true },
    { id: '8', name: '@foodie_life', avatar: '👨‍🍳', invited: false, joined: false },
  ],
  facebook: [
    { id: '9', name: 'Marie Dupont', avatar: '👩‍💼', invited: false, joined: false },
    { id: '10', name: 'Pierre Martin', avatar: '👨‍💻', invited: true, joined: false },
    { id: '11', name: 'Sophie Bernard', avatar: '👩‍🎨', invited: false, joined: true },
    { id: '12', name: 'Lucas Petit', avatar: '🧔', invited: false, joined: false },
  ],
}

export default function InvitePage() {
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const [activePlatform, setActivePlatform] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Stats
  const totalInvited = platforms.reduce(
    (acc, p) => acc + p.friends.filter(f => f.invited).length,
    0
  )
  const totalJoined = platforms.reduce(
    (acc, p) => acc + p.friends.filter(f => f.joined).length,
    0
  )

  // Connecter une plateforme
  const connectPlatform = (platformId: string) => {
    setPlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? { ...p, connected: true, friends: mockFriends[platformId] || [] }
          : p
      )
    )
    setActivePlatform(platformId)
  }

  // Inviter un ami
  const inviteFriend = (platformId: string, friendId: string) => {
    setPlatforms(prev =>
      prev.map(p =>
        p.id === platformId
          ? {
              ...p,
              friends: p.friends.map(f =>
                f.id === friendId ? { ...f, invited: true } : f
              ),
            }
          : p
      )
    )
  }

  // Copier le lien
  const copyLink = () => {
    navigator.clipboard.writeText('https://gamecrush.app/join/ABC123')
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Partager
  const shareOn = (platform: string) => {
    const text = encodeURIComponent("Viens jouer avec moi sur GameCrush ! L'app dating où on joue avant de matcher 🎠")
    const url = encodeURIComponent('https://gamecrush.app/join/ABC123')

    let shareUrl = ''
    switch (platform) {
      case 'instagram':
        shareUrl = `instagram://story-camera`
        break
      case 'tiktok':
        shareUrl = `https://www.tiktok.com/`
        break
      case 'sms':
        shareUrl = `sms:?body=${text}%20${url}`
        break
      case 'snapchat':
        shareUrl = `https://www.snapchat.com/`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const activePlatformData = platforms.find(p => p.id === activePlatform)

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
              GameCrush
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
      <main className="px-6 py-8" style={{ maxWidth: '600px', margin: '0 auto' }}>
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

        {/* Stats de parrainage - Plus grands */}
        <div className="card-90s p-6 mb-8" style={{ borderColor: '#39FF14', boxShadow: '0 0 20px #39FF1440' }}>
          <div className="flex items-center justify-around">
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-[#39FF14] mb-2">{totalInvited}</div>
              <div className="text-sm text-white/60">Invités</div>
            </div>
            <div className="w-px h-16 bg-white/20" />
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-[#FFFF00] mb-2">{totalJoined}</div>
              <div className="text-sm text-white/60">Ont rejoint</div>
            </div>
            <div className="w-px h-16 bg-white/20" />
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-[#FF00FF] mb-2">{totalJoined * 7}</div>
              <div className="text-sm text-white/60">Jours 🎁</div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Lien de parrainage - Plus grand */}
        <div className="mb-8">
          <p className="text-sm text-white/50 uppercase mb-3 flex items-center gap-2">
            <span>🔗</span> TON LIEN
          </p>
          <div className="card-90s p-4" style={{ borderColor: '#00FFFF' }}>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value="gamecrush.app/join/ABC123"
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
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => shareOn('instagram')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition hover:scale-105"
              style={{ background: 'linear-gradient(45deg, #405DE6, #833AB4, #E1306C)' }}
            >
              <span className="text-3xl">📸</span>
              <span className="text-xs font-bold text-white">Insta</span>
            </button>
            <button
              onClick={() => shareOn('tiktok')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition hover:scale-105"
              style={{ background: '#000', border: '2px solid #00F2EA' }}
            >
              <span className="text-3xl">🎵</span>
              <span className="text-xs font-bold text-white">TikTok</span>
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
              onClick={() => shareOn('snapchat')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition hover:scale-105"
              style={{ background: '#FFFC00' }}
            >
              <span className="text-3xl">👻</span>
              <span className="text-xs font-bold text-[#1A0033]">Snap</span>
            </button>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Connecter les réseaux */}
        <div className="mb-8">
          <p className="text-sm text-white/50 uppercase mb-4 flex items-center gap-2">
            <span>👯</span> INVITE DEPUIS TES RESEAUX
          </p>

          <div className="space-y-4">
            {platforms.map(platform => (
              <div key={platform.id}>
                <button
                  onClick={() => platform.connected ? setActivePlatform(activePlatform === platform.id ? null : platform.id) : connectPlatform(platform.id)}
                  className="w-full p-5 flex items-center justify-between transition rounded-xl"
                  style={{
                    background: platform.connected ? `${platform.color}20` : '#330066',
                    border: `2px solid ${platform.connected ? platform.color : 'rgba(255,255,255,0.2)'}`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{platform.icon}</span>
                    <div className="text-left">
                      <div className="font-bold text-white text-lg">{platform.name}</div>
                      {platform.connected && (
                        <div className="text-sm text-white/60">
                          {platform.friends.filter(f => !f.joined).length} amis à inviter
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {platform.connected ? (
                      <span className="text-[#39FF14] text-sm font-bold">
                        ✓ Connecté {activePlatform === platform.id ? '▲' : '▼'}
                      </span>
                    ) : (
                      <span
                        className="px-4 py-2 text-sm font-bold rounded-lg"
                        style={{ background: platform.color, color: 'white' }}
                      >
                        Connecter
                      </span>
                    )}
                  </div>
                </button>

                {/* Liste d'amis */}
                {platform.connected && activePlatform === platform.id && (
                  <div className="mt-3 bg-[#1A0033] border-2 border-white/10 p-4 space-y-3 rounded-xl">
                    {platform.friends.map(friend => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-3 bg-[#330066]/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{friend.avatar}</span>
                          <span className="text-white">{friend.name}</span>
                        </div>
                        {friend.joined ? (
                          <span className="text-sm text-[#39FF14] font-bold">
                            ✓ Déjà membre
                          </span>
                        ) : friend.invited ? (
                          <span className="text-sm text-[#FFFF00] font-bold">
                            ⏳ Invité
                          </span>
                        ) : (
                          <button
                            onClick={() => inviteFriend(platform.id, friend.id)}
                            className="px-4 py-2 text-sm font-bold rounded-lg"
                            style={{ background: platform.color, color: 'white' }}
                          >
                            Inviter
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
