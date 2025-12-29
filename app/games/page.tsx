'use client'

import { useState } from 'react'
import Link from 'next/link'
import GameCard from '../components/GameCard'

// Configuration des images Midjourney (chemins exacts des fichiers)
const gameImages: Record<string, string> = {
  'manege': '/Images/games/manege.png',
  'action-verite': '/Images/games/action-verite.png',
  'marelle': '/Images/games/Marelle.png',
  'chat-perche': '/Images/games/chat-perche.png',
  'corde': '/Images/games/corde-a-sauter.png',
  'billes': '/Images/games/les-billes.png',
  'temple': '/Images/games/le-temple-maudit.png',
  'goonies': '/Images/games/goonies.png',
  'point-break': '/Images/games/point-break.png',
  'dirty': '/Images/games/dirty-dancing.png',
  'poesie': '/Images/games/poesie.png',
  'lettre': '/Images/games/la-lettre.png',
  'tarte': '/Images/games/la-tarte.png',
  'refais': '/Images/games/refais-la-france.png',
  'apocalypse': '/Images/games/apocalypse.png',
  'proces': '/Images/games/Le-proces.png',
  'jeu-oie': '/Images/games/jeu-de-loie.png',
}

// Tous les jeux organisés par catégorie
const gameCategories = [
  {
    id: 'classiques',
    title: '🎠 Les Classiques de la Récré',
    color: '#FF00FF',
    games: [
      { id: 'manege', icon: '🎠', title: 'Le Manège', desc: 'Questions anonymes', available: true, path: '/games/manege', color: 'pink' },
      { id: 'action-verite', icon: '🎯', title: 'Action ou Vérité', desc: 'Le classique revisité', available: true, color: 'blue' },
      { id: 'marelle', icon: '🔢', title: 'La Marelle', desc: 'De + en + intime', available: false, color: 'green' },
      { id: 'chat-perche', icon: '🏃', title: 'Chat Perché', desc: 'Jeu de séduction', available: false, color: 'yellow' },
      { id: 'corde', icon: '🪢', title: 'Corde à Sauter', desc: '5 sec pour répondre', available: false, color: 'pink' },
      { id: 'billes', icon: '🔮', title: 'Les Billes', desc: 'Paris sur l\'autre', available: false, color: 'blue' },
    ]
  },
  {
    id: 'films',
    title: '🎬 Inspirés de Films Cultes',
    color: '#FF6600',
    games: [
      { id: 'temple', icon: '🗿', title: 'Le Temple Maudit', desc: 'Indiana Jones style', available: false, isNew: true, color: 'orange' },
      { id: 'goonies', icon: '🏴‍☠️', title: 'Les Goonies', desc: 'Chasse au trésor', available: false, isNew: true, color: 'yellow' },
      { id: 'point-break', icon: '🏄', title: 'Point Break', desc: 'Choix extrêmes', available: false, isNew: true, color: 'red' },
      { id: 'dirty', icon: '💃', title: 'Dirty Dancing', desc: 'Vidéos chorés kitsch', available: false, isNew: true, color: 'pink' },
    ]
  },
  {
    id: 'romantiques',
    title: '💕 Les Romantiques',
    color: '#FF00FF',
    games: [
      { id: 'poesie', icon: '📜', title: 'Poésie', desc: 'Complète le poème', available: false, color: 'pink' },
      { id: 'lettre', icon: '💌', title: 'La Lettre', desc: 'Lettre anonyme', available: false, color: 'pink' },
    ]
  },
  {
    id: 'barges',
    title: '🤪 Les Complètement Barges',
    color: '#FFFF00',
    games: [
      { id: 'tarte', icon: '🥧', title: 'La Tarte', desc: 'Tarte ou bisou ?', available: true, path: '/games/la-tarte', isNew: true, color: 'yellow' },
      { id: 'refais', icon: '🏛️', title: 'Refais la France', desc: '100 Mds à répartir', available: true, path: '/games/refais-la-france', isNew: true, color: 'yellow' },
      { id: 'apocalypse', icon: '🧟', title: 'Apocalypse', desc: 'Fin du monde', available: false, color: 'yellow' },
      { id: 'proces', icon: '🎭', title: 'Le Procès', desc: 'Causes absurdes', available: false, color: 'yellow' },
    ]
  },
  {
    id: 'permanent',
    title: '🎲 Jeu Permanent',
    color: '#39FF14',
    games: [
      { id: 'jeu-oie', icon: '🎲', title: 'Le Jeu de l\'Oie', desc: 'Ton parcours quotidien', available: true, path: '/games/jeu-oie', color: 'green', isPermanent: true },
    ]
  },
]

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState('games')

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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-blink {
          animation: blink 1s ease-in-out infinite;
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

          {/* Ligne 2: Navigation */}
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
              <Link href="/games" className="top-nav-item active">
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
      <main className="py-8" style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl text-white mb-2" style={{ textShadow: '0 0 10px #FF00FF, 3px 3px 0 #00FFFF' }}>
            🎮 Tous les Jeux
          </h1>
          <p className="text-[#00FFFF] font-bold">
            Choisis ton jeu et révèle ta personnalité !
          </p>
        </div>

        {/* Catégories de jeux */}
        {gameCategories.map(category => (
          <div key={category.id} className="mb-10">
            <h2
              className="inline-block text-xl px-6 py-2 border-2 mb-6"
              style={{
                color: category.color,
                borderColor: category.color,
                boxShadow: `0 0 15px ${category.color}`,
                textShadow: `0 0 10px ${category.color}`
              }}
            >
              {category.title}
            </h2>

            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 340px))',
              }}
            >
              {category.games.map(game => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  icon={game.icon}
                  title={game.title}
                  desc={game.desc}
                  available={game.available}
                  path={game.path}
                  isNew={game.isNew}
                  isPermanent={game.isPermanent}
                  color={game.color}
                  image={gameImages[game.id]}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Info */}
        <div className="card-90s blue p-6 text-center mt-8">
          <p className="text-[#00FFFF] text-lg mb-2" style={{ textShadow: '0 0 10px #00FFFF' }}>
            💡 De nouveaux jeux chaque semaine !
          </p>
          <p className="text-white/70 text-sm">
            Les jeux grisés seront débloqués progressivement. Reste connecté(e) !
          </p>
        </div>
      </main>
    </div>
  )
}
