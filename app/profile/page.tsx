'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  // Données utilisateur simulées
  const user = {
    pseudo: 'Player123',
    avatar: '👤',
    age: 25,
    city: 'Paris',
    intentions: ['love', 'friends'],
    idealEvening: 'boardgames',
    childhoodGame: 'Mario Kart',
    threeWords: ['curieux', 'drôle', 'créatif'],
  }

  // Stats simulées
  const stats = {
    gamesPlayed: 12,
    matches: 5,
    points: 850,
    badges: 3,
    rank: 42,
  }

  // Badges débloqués
  const badges = [
    { id: 1, icon: '🎠', name: 'Premier Manège', desc: 'Premier tour de manège complété' },
    { id: 2, icon: '🎲', name: 'Joueur de l\'Oie', desc: 'Première partie de l\'Oie' },
    { id: 3, icon: '💕', name: 'First Match', desc: 'Premier match obtenu' },
  ]

  const getIntentionLabel = (id: string) => {
    const labels: Record<string, string> = {
      love: '💕 Amour',
      friends: '🤝 Amitié',
      network: '🌐 Réseau',
      fun: '🎮 Fun',
    }
    return labels[id] || id
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

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-5">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="logo-90s text-xl">
              <span className="animate-spin inline-block text-lg">🎠</span>
              GameCrush
            </Link>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-90s text-sm py-2 px-4"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {/* Navigation desktop uniquement */}
          <nav className="max-w-5xl mx-auto mt-3">
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
              <Link href="/invite" className="top-nav-item">
                <span className="nav-emoji">👯</span>
                Inviter
              </Link>
              <Link href="/profile" className="top-nav-item active">
                <span className="nav-emoji">👤</span>
                Profil
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Contenu principal - Centré */}
      <main className="px-6 py-8" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Profil Header - Centré avec avatar plus grand */}
        <div className="text-center mb-8">
          {/* Avatar 120px */}
          <div
            className="w-32 h-32 mx-auto border-4 border-[#FF00FF] rounded-full flex items-center justify-center text-6xl bg-[#330066] mb-6"
            style={{ boxShadow: '0 0 40px #FF00FF50' }}
          >
            {user.avatar}
          </div>

          {/* Pseudo */}
          <h1 className="text-3xl text-[#FF00FF] font-bold mb-2" style={{ textShadow: '0 0 15px #FF00FF' }}>
            {user.pseudo}
          </h1>
          <p className="text-white/60 text-lg mb-6">
            {user.age} ans • {user.city}
          </p>

          {/* Intentions - Plus grands */}
          <div className="flex justify-center gap-3 flex-wrap">
            {user.intentions.map(intent => (
              <span
                key={intent}
                className="px-4 py-2 text-sm font-bold rounded-lg"
                style={{ background: '#330066', border: '2px solid #00FFFF', color: '#00FFFF' }}
              >
                {getIntentionLabel(intent)}
              </span>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Stats - Cards plus espacées */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-90s p-5 text-center" style={{ borderColor: '#FF00FF40' }}>
            <div className="text-3xl font-bold text-[#FF00FF] mb-2">{stats.gamesPlayed}</div>
            <div className="text-xs text-white/60 uppercase">Parties</div>
          </div>
          <div className="card-90s p-5 text-center" style={{ borderColor: '#00FFFF40' }}>
            <div className="text-3xl font-bold text-[#00FFFF] mb-2">{stats.matches}</div>
            <div className="text-xs text-white/60 uppercase">Matchs</div>
          </div>
          <div className="card-90s p-5 text-center" style={{ borderColor: '#39FF1440' }}>
            <div className="text-3xl font-bold text-[#39FF14] mb-2">{stats.points}</div>
            <div className="text-xs text-white/60 uppercase">Points</div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Rang - Plus visible */}
        <div className="card-90s p-6 mb-8" style={{ borderColor: '#39FF14', boxShadow: '0 0 20px #39FF1430' }}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🏆</span>
            <div>
              <p className="text-2xl font-bold text-[#39FF14]" style={{ textShadow: '0 0 10px #39FF14' }}>
                Rang #{stats.rank}
              </p>
              <p className="text-white/60">Top 10% des joueurs</p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="bg-[#330066] rounded-full h-4 overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#39FF14] to-[#00FFFF]"
              style={{ width: '65%' }}
            />
          </div>
          <p className="text-right text-sm text-white/50">
            <span className="text-[#FFFF00] font-bold">150 pts</span> → prochain palier
          </p>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Badges - Plus grands en grid */}
        <div className="mb-8">
          <h2 className="text-xl text-[#FFFF00] font-bold mb-6 text-center" style={{ textShadow: '0 0 10px #FFFF00' }}>
            🏅 MES BADGES ({badges.length})
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {badges.map(badge => (
              <div
                key={badge.id}
                className="card-90s p-5 text-center"
                style={{ borderColor: '#FFFF00', boxShadow: '0 0 15px #FFFF0040' }}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <p className="text-sm text-[#FFFF00] font-bold leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Infos personnelles */}
        <div className="card-90s p-6 mb-8" style={{ borderColor: '#FF00FF40' }}>
          <h2 className="text-xl text-[#FF00FF] font-bold mb-6 text-center" style={{ textShadow: '0 0 10px #FF00FF' }}>
            ✨ MON PROFIL
          </h2>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase mb-2">Soirée idéale</p>
              <p className="text-white font-bold text-lg">🎲 Jeux de société</p>
            </div>

            <div className="border-t border-white/10" />

            <div className="text-center">
              <p className="text-xs text-white/40 uppercase mb-2">Jeu d'enfance préféré</p>
              <p className="text-white font-bold text-lg">🎮 {user.childhoodGame}</p>
            </div>

            <div className="border-t border-white/10" />

            <div className="text-center">
              <p className="text-xs text-white/40 uppercase mb-2">3 mots qui me décrivent</p>
              <div className="flex gap-3 justify-center flex-wrap mt-2">
                {user.threeWords.map((word, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 text-sm font-bold rounded-lg"
                    style={{ background: '#FF00FF', color: 'white' }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-white/10 my-8" />

        {/* Actions - Plus d'espace */}
        <div className="space-y-4">
          <button className="btn-cta-secondary w-full justify-center py-4 text-lg">
            ⚙️ Paramètres
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full text-center py-4 text-[#FF3131] font-bold hover:text-[#FFFF00] transition text-lg"
          >
            Se déconnecter
          </button>
        </div>

        {/* Badge confiance - Plus d'espace */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <span className="badge-90s badge-outline text-sm px-4 py-2">🇫🇷 IA Mistral</span>
          <span className="badge-90s badge-outline text-sm px-4 py-2">🔒 RGPD</span>
        </div>
      </main>
    </div>
  )
}
