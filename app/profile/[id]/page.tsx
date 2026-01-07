'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SendGiftModal from '../../components/SendGiftModal'

// Mock data pour les profils des autres joueurs
const mockProfiles: Record<string, {
  id: string
  pseudo: string
  avatar: string
  age: number
  city: string
  bio: string
  intentions: string[]
  isCelib: boolean
  gamesPlayed: number
  matchScore?: number
  badges: { icon: string; name: string }[]
  gameResults: { label: string; value: string; icon: string }[]
}> = {
  'emma': {
    id: 'emma',
    pseudo: 'Emma',
    avatar: '👩‍🦰',
    age: 24,
    city: 'Lyon',
    bio: 'Fan de jeux de société et de soirées entre potes',
    intentions: ['love', 'friends'],
    isCelib: true,
    gamesPlayed: 18,
    matchScore: 87,
    badges: [
      { icon: '🎠', name: 'Reine du Manège' },
      { icon: '🍬', name: 'Accro aux bonbons' },
    ],
    gameResults: [
      { label: 'Bonbon totem', value: 'Fraise Tagada', icon: '🍓' },
      { label: 'Red flag', value: 'Le ghosting', icon: '🚩' },
    ],
  },
  'lucas': {
    id: 'lucas',
    pseudo: 'Lucas',
    avatar: '😎',
    age: 27,
    city: 'Paris',
    bio: 'Toujours partant pour un apéro jeux',
    intentions: ['friends', 'fun'],
    isCelib: false,
    gamesPlayed: 32,
    badges: [
      { icon: '🎲', name: 'Pro du Jeu de l\'Oie' },
      { icon: '🏆', name: 'Top 10' },
    ],
    gameResults: [
      { label: 'Humour', value: 'Absurde', icon: '😂' },
    ],
  },
  'camille': {
    id: 'camille',
    pseudo: 'Camille',
    avatar: '🧑',
    age: 23,
    city: 'Bordeaux',
    bio: 'Je cherche des gens cools pour jouer !',
    intentions: ['love', 'network'],
    isCelib: true,
    gamesPlayed: 8,
    matchScore: 72,
    badges: [
      { icon: '🌟', name: 'Nouveau joueur' },
    ],
    gameResults: [
      { label: 'Style crush', value: 'Romantique discret', icon: '💕' },
    ],
  },
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params?.id as string
  const [profile, setProfile] = useState<typeof mockProfiles['emma'] | null>(null)
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement du profil
    setLoading(true)
    setTimeout(() => {
      setProfile(mockProfiles[userId] || null)
      setLoading(false)
    }, 500)
  }, [userId])

  const getIntentionLabel = (id: string) => {
    const labels: Record<string, string> = {
      love: '💕 Amour',
      friends: '🤝 Amitié',
      network: '🌐 Réseau',
      fun: '🎮 Fun',
    }
    return labels[id] || id
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">👤</div>
          <p className="text-white/60">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-white text-xl font-bold mb-4">Profil introuvable</p>
          <Link href="/games" className="text-[#00FFFF] hover:underline">
            ← Retour aux jeux
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0D001A' }}>
      {/* Background Pattern */}
      <div className="bg-pattern" />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href="/games" className="text-white/60 hover:text-white transition flex items-center gap-2">
              <span>←</span>
              <span>Retour</span>
            </Link>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Bangers, cursive', color: '#FF00FF', textShadow: '0 0 15px #FF00FF' }}>
              Profil
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="px-6 py-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Profil Header */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div
            className="w-32 h-32 mx-auto border-4 border-[#FF00FF] rounded-full flex items-center justify-center text-6xl bg-[#330066] mb-4"
            style={{ boxShadow: '0 0 40px #FF00FF50' }}
          >
            {profile.avatar}
          </div>

          {/* Match Score */}
          {profile.matchScore && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{
                background: profile.matchScore >= 80
                  ? 'linear-gradient(90deg, #39FF14, #00FFFF)'
                  : profile.matchScore >= 60
                    ? 'linear-gradient(90deg, #FFFF00, #FF6600)'
                    : 'rgba(255, 255, 255, 0.2)',
                boxShadow: profile.matchScore >= 80 ? '0 0 20px rgba(57, 255, 20, 0.4)' : 'none',
              }}
            >
              <span className="text-lg">💕</span>
              <span className="font-bold text-white text-sm" style={{ textShadow: '1px 1px 0 #000' }}>
                {profile.matchScore}% compatible
              </span>
            </div>
          )}

          {/* Badge Célib */}
          {profile.isCelib && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 animate-pulse ml-2"
              style={{ background: 'linear-gradient(90deg, #FF00FF, #FF6B9D)', boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)' }}
            >
              <span>💕</span>
              <span className="font-bold text-white text-sm">Célib !</span>
            </div>
          )}

          {/* Pseudo */}
          <h1 className="text-3xl text-[#FF00FF] font-bold mb-2" style={{ textShadow: '0 0 15px #FF00FF' }}>
            {profile.pseudo}
          </h1>
          <p className="text-white/60 text-lg mb-4">
            {profile.age} ans • {profile.city}
          </p>

          {/* Bio */}
          {profile.bio && (
            <p className="text-white/80 italic mb-6 px-4">
              "{profile.bio}"
            </p>
          )}

          {/* Intentions */}
          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {profile.intentions.map(intent => (
              <span
                key={intent}
                className="px-4 py-2 text-sm font-bold rounded-lg"
                style={{ background: '#330066', border: '2px solid #00FFFF', color: '#00FFFF' }}
              >
                {getIntentionLabel(intent)}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00FFFF]">{profile.gamesPlayed}</div>
              <div className="text-xs text-white/50">parties jouées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FFFF00]">{profile.badges.length}</div>
              <div className="text-xs text-white/50">badges</div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Badges */}
        {profile.badges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg text-[#FFFF00] font-bold mb-4 text-center" style={{ textShadow: '0 0 10px #FFFF00' }}>
              🏅 Badges
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {profile.badges.map((badge, i) => (
                <div
                  key={i}
                  className="px-4 py-3 rounded-xl text-center"
                  style={{ background: 'rgba(255, 255, 0, 0.1)', border: '2px solid rgba(255, 255, 0, 0.3)' }}
                >
                  <span className="text-2xl mr-2">{badge.icon}</span>
                  <span className="text-sm text-white font-bold">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résultats de jeux */}
        {profile.gameResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg text-[#00FFFF] font-bold mb-4 text-center" style={{ textShadow: '0 0 10px #00FFFF' }}>
              🎮 Résultats de jeux
            </h2>
            <div className="space-y-3">
              {profile.gameResults.map((result, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl flex items-center gap-4"
                  style={{ background: 'rgba(0, 255, 255, 0.1)', border: '2px solid rgba(0, 255, 255, 0.3)' }}
                >
                  <span className="text-2xl">{result.icon}</span>
                  <div>
                    <div className="text-xs text-white/50">{result.label}</div>
                    <div className="text-white font-bold">{result.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => setShowGiftModal(true)}
            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)',
              boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)',
            }}
          >
            <span className="text-2xl">🎁</span>
            Envoyer un cadeau
          </button>

          <Link
            href="/messages"
            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition hover:scale-105"
            style={{
              background: 'rgba(0, 255, 255, 0.15)',
              border: '3px solid #00FFFF',
              color: '#00FFFF',
            }}
          >
            <span className="text-2xl">💬</span>
            Envoyer un message
          </Link>

          <button
            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <span className="text-2xl">🎮</span>
            Défier à un jeu
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 rounded-xl text-center" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p className="text-white/40 text-sm">
            Les cadeaux envoyés sont visibles par {profile.pseudo} dans ses notifications
          </p>
        </div>
      </main>

      {/* Modal d'envoi de cadeau */}
      <SendGiftModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        recipientName={profile.pseudo}
        recipientId={profile.id}
      />
    </div>
  )
}
