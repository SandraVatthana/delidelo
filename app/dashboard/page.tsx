'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser, modesConfig, UserMode } from '../contexts/UserContext'

// Jeux par mode
const gamesByMode = {
  love: [
    { id: 'manege', icon: '🎠', title: 'Le Manège', description: '3 candidats t\'attendent !', points: 50, isNew: true, path: '/games/manege', color: 'pink' },
    { id: 'dirty', icon: '💃', title: 'Dirty Dancing', description: 'Vidéos chorés kitsch !', points: 45, isNew: true, path: '/games/dirty-dancing', color: 'pink' },
    { id: 'marelle', icon: '🔢', title: 'La Marelle', description: 'De + en + intime', points: 40, isNew: false, path: '/games/marelle', color: 'pink' },
    { id: 'poesie', icon: '📜', title: 'Poésie', description: 'Complète le poème', points: 35, isNew: false, path: '/games/poesie', color: 'pink' },
  ],
  friends: [
    { id: 'action-verite', icon: '🎯', title: 'Action ou Vérité', description: 'Le classique revisité', points: 50, isNew: true, path: '/games/action-verite', color: 'blue' },
    { id: 'goonies', icon: '🏴‍☠️', title: 'Les Goonies', description: 'Chasse au trésor', points: 45, isNew: true, path: '/games/goonies', color: 'yellow' },
    { id: 'quiz', icon: '🧠', title: 'Quiz 80s', description: 'Culture pop !', points: 40, isNew: false, path: '/games/quiz', color: 'blue' },
    { id: 'barges', icon: '🤪', title: 'Jeux Barges', description: 'Défis fous', points: 35, isNew: false, path: '/games/barges', color: 'yellow' },
  ],
  crew: [
    { id: 'jeu-oie', icon: '🎲', title: 'Jeu de l\'Oie', description: 'Lance le dé !', points: 50, isNew: true, path: '/games/jeu-oie', color: 'green' },
    { id: 'escapegame', icon: '🔐', title: 'Escape Game', description: 'Résous les énigmes', points: 45, isNew: true, path: '/games/escape', color: 'green' },
    { id: 'retrogaming', icon: '🕹️', title: 'Retro Gaming', description: 'Bornes arcade', points: 40, isNew: false, path: '/games/retro', color: 'green' },
    { id: 'karaoke', icon: '🎤', title: 'Karaoké', description: 'Chante faux !', points: 35, isNew: false, path: '/games/karaoke', color: 'orange' },
  ],
}

// Configuration des défis/jeux de la semaine
const weekChallenges = [
  {
    id: 'manege',
    icon: '🎠',
    title: 'Mode Manège',
    description: '3 candidats t\'attendent !',
    points: 50,
    isNew: true,
    path: '/games/manege',
    color: 'pink',
  },
  {
    id: 'dirty',
    icon: '💃',
    title: 'Dirty Dancing',
    description: 'Vidéos chorés kitsch !',
    points: 45,
    isNew: true,
    path: '/games/dirty-dancing',
    color: 'pink',
  },
  {
    id: 'jeu-oie',
    icon: '🎲',
    title: 'Jeu de l\'Oie',
    description: 'Lance le dé et avance !',
    points: 40,
    isNew: false,
    path: '/games/jeu-oie',
    color: 'green',
  },
  {
    id: 'action-verite',
    icon: '🎯',
    title: 'Action ou Vérité',
    description: 'Le classique revisité',
    points: 35,
    isNew: false,
    path: '/games/action-verite',
    color: 'blue',
  },
]

// Jeux à venir (grisés)
const upcomingGames = [
  { id: 'goonies', icon: '🏴‍☠️', title: 'Les Goonies', unlockWeek: 3 },
  { id: 'temple', icon: '🗿', title: 'Temple Maudit', unlockWeek: 4 },
  { id: 'point-break', icon: '🏄', title: 'Point Break', unlockWeek: 5 },
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('home')
  const [showModeSelector, setShowModeSelector] = useState(false)
  const { user: userData, currentMode, setMode, isLoading } = useUser()

  // Données utilisateur
  const user = {
    pseudo: userData.pseudo || 'Visiteur',
    avatar: currentMode.icon,
    notifications: 2,
  }

  // Jeux selon le mode
  const modeGames = gamesByMode[userData.mode] || gamesByMode.love

  // Données saison selon le mode
  const seasonByMode = {
    love: { theme: 'Crush Time', emoji: '💕' },
    friends: { theme: 'Squad Goals', emoji: '🤝' },
    crew: { theme: 'Event Season', emoji: '🎉' },
  }

  const season = {
    number: 1,
    theme: seasonByMode[userData.mode]?.theme || 'Découverte',
    emoji: seasonByMode[userData.mode]?.emoji || '🎠',
    startDate: '10 déc',
    endDate: '17 déc',
    daysLeft: 7,
  }

  // Stats utilisateur
  const stats = {
    challenges: { done: 0, total: 3 },
    points: 0,
    rank: '-',
  }

  // Changer de mode
  const handleModeChange = (mode: UserMode) => {
    setMode(mode)
    setShowModeSelector(false)
  }

  const getCardColor = (color: string) => {
    switch(color) {
      case 'pink': return 'border-[#FF00FF] hover:shadow-[0_0_30px_#FF00FF]'
      case 'green': return 'border-[#39FF14] hover:shadow-[0_0_30px_#39FF14]'
      case 'blue': return 'border-[#00FFFF] hover:shadow-[0_0_30px_#00FFFF]'
      case 'yellow': return 'border-[#FFFF00] hover:shadow-[0_0_30px_#FFFF00]'
      default: return 'border-[#FF00FF]'
    }
  }

  const getTitleColor = (color: string) => {
    switch(color) {
      case 'pink': return 'text-[#FF00FF]'
      case 'green': return 'text-[#39FF14]'
      case 'blue': return 'text-[#00FFFF]'
      case 'yellow': return 'text-[#FFFF00]'
      default: return 'text-[#FF00FF]'
    }
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      <style jsx>{`
        .dashboard-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 32px 24px;
          width: 100%;
        }
        @media (min-width: 768px) {
          .dashboard-main {
            max-width: 800px;
            padding: 40px 32px;
          }
        }
        .section {
          margin-bottom: 48px;
        }
        .section-title {
          margin: 32px 0 20px;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .hero-block {
          background: linear-gradient(135deg, rgba(255, 0, 255, 0.15), rgba(0, 255, 255, 0.08));
          border: 2px solid rgba(255, 0, 255, 0.5);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 48px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 24px;
        }
        .stat-box {
          text-align: center;
          padding: 16px 8px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }
        .stat-value {
          font-family: 'Bangers', cursive;
          font-size: 2rem;
          color: #39FF14;
          text-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
        }
        .stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          margin-top: 4px;
        }
        .game-card {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(57, 255, 20, 0.6);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .game-card:hover {
          border-color: #FF00FF;
          transform: translateX(8px);
          box-shadow: 0 0 30px rgba(255, 0, 255, 0.3);
        }
        .game-card:active {
          transform: translateX(4px) scale(0.98);
        }
        .game-icon {
          font-size: 3rem;
          min-width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        .game-title {
          font-family: 'Bangers', cursive;
          font-size: 1.5rem;
          color: #FFFFFF;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .game-desc {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
        }
        .game-badge {
          margin-left: auto;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .badge-new {
          background: #FF00FF;
          color: white;
        }
        .badge-points {
          background: rgba(57, 255, 20, 0.2);
          color: #39FF14;
          border: 1px solid rgba(57, 255, 20, 0.5);
        }
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
        <div className="bg-[#0D001A]/98 backdrop-blur-sm px-4 py-5">
          {/* Ligne 1: Logo + Mode Selector + Notifications */}
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-3">
            <Link href="/" className="logo-90s text-xl">
              <span className="animate-spin inline-block text-lg">🎠</span>
              GameCrush
            </Link>

            <div className="flex items-center gap-2">
              {/* Mode Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowModeSelector(!showModeSelector)}
                  className="flex items-center gap-3 px-5 py-3 rounded-full transition hover:scale-105"
                  style={{
                    background: currentMode.gradient,
                    boxShadow: `0 0 20px ${currentMode.color}60`,
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <span className="text-2xl">{currentMode.icon}</span>
                  <span className="text-white text-base font-bold">{currentMode.title}</span>
                  <span className="text-white/80 text-sm">▼</span>
                </button>

                {/* Dropdown */}
                {showModeSelector && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#0D001A] border-2 border-white/15 rounded-lg overflow-hidden z-50" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.7)' }}>
                    {Object.values(modesConfig).map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => handleModeChange(mode.id)}
                        className={`w-full flex items-center gap-3 p-3 text-left transition ${
                          userData.mode === mode.id ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                          style={{ background: mode.gradient }}
                        >
                          {mode.icon}
                        </span>
                        <span className="font-bold" style={{ color: mode.color }}>{mode.title}</span>
                        {userData.mode === mode.id && <span className="ml-auto text-[#39FF14]">✓</span>}
                      </button>
                    ))}
                    <div className="p-2 text-center text-xs text-white/40">
                      💡 Change de mode quand tu veux
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-white/60 hover:text-[#FFFF00] transition">
                <span className="text-2xl">🔔</span>
                {user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF00FF] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {user.notifications}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Ligne 2: Navigation */}
          <nav className="max-w-5xl mx-auto">
            <div className="top-nav">
              <Link href="/dashboard" className="top-nav-item active">
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
              <Link href="/profile" className="top-nav-item">
                <span className="nav-emoji">👤</span>
                Profil
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="dashboard-main">

        {/* ========== HERO BLOCK: Mode + Stats ========== */}
        <div className="hero-block">
          {/* Titre Mode */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{currentMode.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '2px' }}>
                Mode {currentMode.title}
              </h1>
              <p className="text-white/60">Saison {season.number} • {season.daysLeft} jours restants</p>
            </div>
          </div>

          {/* Stats en 3 colonnes */}
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">{stats.challenges.done}/{stats.challenges.total}</div>
              <div className="stat-label">Défis</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.points}</div>
              <div className="stat-label">Points</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">#{stats.rank}</div>
              <div className="stat-label">Rang</div>
            </div>
          </div>
        </div>

        {/* ========== SECTION JEUX ========== */}
        <div className="section">
          <h2 className="section-title">🎮 Jeux disponibles</h2>

          {/* Liste des jeux avec vraies cartes */}
          {modeGames.map(game => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => router.push(game.path)}
            >
              <div className="game-icon">{game.icon}</div>
              <div className="flex-1">
                <div className="game-title">{game.title}</div>
                <div className="game-desc">{game.description}</div>
              </div>
              {game.isNew ? (
                <span className="game-badge badge-new">NEW</span>
              ) : (
                <span className="game-badge badge-points">+{game.points} pts</span>
              )}
            </div>
          ))}
        </div>

        {/* ========== SECTION BIENTÔT ========== */}
        <div className="section">
          <h2 className="section-title">🔒 Bientôt disponibles</h2>

          <div className="flex gap-4">
            {upcomingGames.map(game => (
              <div
                key={game.id}
                className="text-center opacity-40"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  flex: 1
                }}
              >
                <div className="text-3xl mb-2 grayscale">{game.icon}</div>
                <div className="text-xs text-white/60">{game.title}</div>
                <div className="text-[10px] text-white/40 mt-1">Sem. {game.unlockWeek}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== SECTION INVITE ========== */}
        <div className="section">
          <div
            className="game-card"
            onClick={() => router.push('/invite')}
            style={{ borderColor: 'rgba(255, 0, 255, 0.5)' }}
          >
            <div className="game-icon">👯</div>
            <div className="flex-1">
              <div className="game-title">Invite tes potes !</div>
              <div className="game-desc">+1 semaine Premium par ami invité</div>
            </div>
            <span style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.4)' }}>→</span>
          </div>
        </div>

        {/* ========== COACH TIP ========== */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}
        >
          <span className="text-2xl">💡</span>
          <p className="text-white/50 text-sm leading-relaxed">
            {userData.mode === 'love' && 'Commence par le Manège pour découvrir des personnalités compatibles !'}
            {userData.mode === 'friends' && 'Lance-toi dans Action ou Vérité avec des inconnus pour briser la glace !'}
            {userData.mode === 'crew' && 'Rejoins ou crée un event IRL ! Les jeux brise-glace sont prévus sur place.'}
          </p>
        </div>

      </main>
    </div>
  )
}
