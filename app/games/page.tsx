'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GameCard from '../components/GameCard'
import { useUser } from '../contexts/UserContext'
import NotificationBell from '../components/NotificationBell'

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
  'bonbon': '/Images/games/candies.png',
}

// Tous les jeux organisés par catégorie
// isPremium: false = GRATUIT, true = PREMIUM
const gameCategories = [
  {
    id: 'classiques',
    title: '🎠 Les Classiques de la Récré',
    color: '#FF00FF',
    games: [
      { id: 'manege', icon: '🎠', title: 'Le Manège', desc: 'Questions anonymes', available: true, path: '/games/manege', color: 'pink', isPremium: false },
      { id: 'action-verite', icon: '🎯', title: 'Action ou Vérité', desc: 'Le classique revisité', available: true, path: '/games/action-verite', color: 'blue', isPremium: true },
      { id: 'marelle', icon: '🔢', title: 'La Marelle', desc: 'De + en + intime', available: false, path: '/games/marelle', color: 'green', isPremium: true },
      { id: 'chat-perche', icon: '🏃', title: 'Chat Perché', desc: 'Jeu de séduction', available: false, path: '/games/chat-perche', color: 'yellow', isPremium: true },
      { id: 'corde', icon: '🪢', title: 'Corde à Sauter', desc: '5 sec pour répondre', available: false, path: '/games/corde', color: 'pink', isPremium: true },
      { id: 'billes', icon: '🔵', title: 'Les Billes', desc: 'Paris sur l\'autre', available: false, path: '/games/billes', color: 'blue', isPremium: true },
    ]
  },
  {
    id: 'films',
    title: '🎬 Inspirés de Films Cultes',
    color: '#FF6600',
    games: [
      { id: 'temple', icon: '🗿', title: 'Le Temple Maudit', desc: 'Indiana Jones style', available: true, path: '/games/temple', isNew: true, color: 'orange', isPremium: true },
      { id: 'goonies', icon: '🏴‍☠️', title: 'Les Goonies', desc: 'Chasse au trésor', available: true, path: '/games/goonies', isNew: true, color: 'yellow', isPremium: true },
      { id: 'point-break', icon: '🏄', title: 'Point Break', desc: 'Choix extrêmes', available: true, path: '/games/point-break', isNew: true, color: 'red', isPremium: true },
      { id: 'dirty', icon: '💃', title: 'Dirty Dancing', desc: 'Vidéos chorés kitsch', available: false, path: '/games/dirty', isNew: true, color: 'pink', isPremium: true },
    ]
  },
  {
    id: 'romantiques',
    title: '💕 Les Romantiques',
    color: '#FF00FF',
    games: [
      { id: 'poesie', icon: '📜', title: 'Poésie', desc: 'Complète le poème', available: true, path: '/games/poesie', color: 'pink', isPremium: true },
      { id: 'lettre', icon: '💌', title: 'La Lettre', desc: 'Lettre anonyme', available: false, path: '/games/lettre', color: 'pink', isPremium: true },
    ]
  },
  {
    id: 'barges',
    title: '🤪 Les Complètement Barges',
    color: '#FFFF00',
    games: [
      { id: 'bonbon', icon: '🍬', title: "C'est quoi ce bonbon ?", desc: 'Devine les bonbons !', available: true, path: '/games/bonbon', isNew: true, color: 'yellow', isPremium: false },
      { id: 'tarte', icon: '🥧', title: 'La Tarte', desc: 'Tarte ou bisou ?', available: true, path: '/games/la-tarte', isNew: true, color: 'yellow', isPremium: false },
      { id: 'refais', icon: '🏛️', title: 'Refais la France', desc: '100 Mds à répartir', available: true, path: '/games/refais-la-france', isNew: true, color: 'yellow', isPremium: false },
      { id: 'apocalypse', icon: '🧟', title: 'Apocalypse', desc: 'Fin du monde', available: true, path: '/games/apocalypse', color: 'yellow', isPremium: true },
      { id: 'proces', icon: '⚖️', title: 'Le Procès', desc: 'Défends l\'indéfendable', available: true, path: '/games/proces', isNew: true, color: 'yellow', isPremium: false },
    ]
  },
  {
    id: 'permanent',
    title: '🎲 Jeu Permanent',
    color: '#39FF14',
    games: [
      { id: 'jeu-oie', icon: '🎲', title: 'Le Jeu de l\'Oie', desc: 'Ton parcours quotidien', available: true, path: '/games/jeu-oie', color: 'green', isPermanent: true, isPremium: false },
    ]
  },
]

export default function GamesPage() {
  const router = useRouter()
  const { user } = useUser()
  const [showPremiumPopup, setShowPremiumPopup] = useState(false)
  const [blockedGame, setBlockedGame] = useState<string | null>(null)

  // Utilise le vrai statut premium depuis UserContext
  const userIsPremium = user.isPremium

  const handlePremiumBlock = (gameTitle: string) => {
    setBlockedGame(gameTitle)
    setShowPremiumPopup(true)
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
              Déli Délo
            </Link>

            <div className="flex items-center gap-2">
              {!userIsPremium && (
                <Link
                  href="/premium"
                  className="px-3 py-1 text-xs font-bold rounded-full animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#1A0033'
                  }}
                >
                  💎 PREMIUM
                </Link>
              )}
              <NotificationBell />
            </div>
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

        {/* Banner Récré Business */}
        <Link
          href="/business"
          className="block mb-24 p-6 rounded-xl transition hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.15), rgba(0, 255, 255, 0.1))',
            border: '2px solid rgba(255, 0, 255, 0.4)',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.2)'
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🍽️</span>
            <div className="flex-1">
              <h3
                className="text-xl font-bold mb-1"
                style={{
                  fontFamily: 'Bangers, cursive',
                  color: '#FF00FF',
                  textShadow: '0 0 10px rgba(255, 0, 255, 0.5)'
                }}
              >
                RÉCRÉ BUSINESS
              </h3>
              <p className="text-white/70 text-sm">
                Organise des dîners networking fun avec tes collègues ou partenaires !
              </p>
            </div>
            <span className="text-white/50 text-2xl">→</span>
          </div>
        </Link>

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
                  isNew={'isNew' in game ? game.isNew : false}
                  isPermanent={'isPermanent' in game ? game.isPermanent : false}
                  isPremium={game.isPremium}
                  color={game.color}
                  image={gameImages[game.id]}
                  userIsPremium={userIsPremium}
                  onPremiumBlock={() => handlePremiumBlock(game.title)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Info Premium */}
        {!userIsPremium && (
          <div
            className="p-6 text-center mt-8 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))',
              border: '2px solid #FFD700'
            }}
          >
            <p className="text-[#FFD700] text-lg mb-2 font-bold" style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>
              💎 Passe à Premium pour tout débloquer !
            </p>
            <p className="text-white/70 text-sm mb-4">
              Accède à tous les jeux, bonbons illimités, et organise des soirées IRL.
            </p>
            <Link
              href="/premium"
              className="inline-block px-6 py-3 font-bold rounded-xl transition hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#1A0033'
              }}
            >
              Découvrir Premium - 5€/mois
            </Link>
          </div>
        )}

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

      {/* Popup Premium */}
      {showPremiumPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setShowPremiumPopup(false)}
        >
          <div
            className="max-w-md w-full rounded-2xl p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, #1A0033, #2D0A4E)',
              border: '3px solid #FFD700',
              boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🔒</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
              }}
            >
              Jeu Premium !
            </h2>
            <p className="text-white/80 mb-4">
              <span className="text-[#FF00FF] font-bold">{blockedGame}</span> est réservé aux membres Premium.
            </p>

            <div
              className="p-4 rounded-xl mb-6"
              style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}
            >
              <p className="text-[#FFD700] font-bold text-lg mb-2">💎 Déli Délo Premium</p>
              <p className="text-white/70 text-sm mb-3">5€/mois</p>
              <ul className="text-left text-sm text-white/80 space-y-1">
                <li>✅ Tous les jeux débloqués</li>
                <li>✅ 1 jeu EXCLUSIF chaque mois</li>
                <li>✅ Bonbons illimités 🍬</li>
                <li>✅ Billes rares + échange 🔮</li>
                <li>✅ Organiser des soirées IRL</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPremiumPopup(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold border-2 border-white/30 text-white/70 hover:bg-white/10 transition"
              >
                Plus tard
              </button>
              <Link
                href="/premium"
                className="flex-1 py-3 px-4 rounded-xl font-bold transition hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#1A0033'
                }}
              >
                S'abonner 💎
              </Link>
            </div>

            <p className="text-white/40 text-xs mt-4">
              💡 Moins cher qu'un McDo. Plus fun qu'un scroll Instagram.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
