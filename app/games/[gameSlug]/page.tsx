'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import OnlinePlayers from '@/app/components/games/OnlinePlayers'

// Configuration des jeux
const gamesConfig: Record<string, {
  name: string
  icon: string
  description: string
  image: string
  color: string
  playPath?: string
}> = {
  'manege': {
    name: 'Le Manège Enchanté',
    icon: '🎠',
    description: 'Fais tourner le manège et découvre ton match idéal à travers des questions anonymes',
    image: '/Images/games/manege.png',
    color: '#FF00FF',
    playPath: '/games/manege',
  },
  'jeu-oie': {
    name: 'Le Jeu de l\'Oie',
    icon: '🎲',
    description: 'Avance sur le plateau et réponds aux questions pour révéler ta personnalité',
    image: '/Images/games/jeu-de-loie.png',
    color: '#39FF14',
    playPath: '/games/jeu-oie',
  },
  'la-tarte': {
    name: 'La Tarte à la Crème',
    icon: '🥧',
    description: 'Choisis ou esquive les questions piège dans ce jeu décalé',
    image: '/Images/games/la-tarte.png',
    color: '#FFFF00',
    playPath: '/games/la-tarte',
  },
  'refais-la-france': {
    name: 'Refais la France',
    icon: '🗺️',
    description: 'Tu as 100 milliards à répartir. Tes choix révèlent ta personnalité !',
    image: '/Images/games/refais-la-france.png',
    color: '#00FFFF',
    playPath: '/games/refais-la-france',
  },
  'goonies': {
    name: 'Les Goonies',
    icon: '🎬',
    description: 'L\'aventure vous attend ! Partez à la chasse au trésor comme dans le film culte',
    image: '/Images/games/goonies.png',
    color: '#FF6600',
  },
  'dirty-dancing': {
    name: 'Dirty Dancing',
    icon: '💃',
    description: 'Personne ne met bébé dans un coin. Dansez et connectez !',
    image: '/Images/games/dirty-dancing.png',
    color: '#FF00FF',
  },
}

// Mock stats
const mockGameStats = {
  totalPlayers: 147,
  playersInRegion: 23,
  superCompatible: 8,
  lastPlayer: 'il y a 12 min',
}

export default function GameLandingPage() {
  const params = useParams()
  const router = useRouter()
  const gameSlug = params.gameSlug as string
  const game = gamesConfig[gameSlug]

  const [alertsEnabled, setAlertsEnabled] = useState(false)

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-2xl text-white mb-4">Jeu non trouvé</h1>
          <Link href="/games" className="btn-cta-secondary">
            Retour aux jeux
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-pattern" />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <Link
              href="/games"
              className="text-[#00FFFF] hover:text-[#FFFF00] transition text-xl"
            >
              ←
            </Link>
            <Link href="/" className="logo-90s text-lg">
              <span className="animate-spin inline-block">🎠</span>
              Déli Délo
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Bannière du jeu */}
        <div
          className="relative rounded-lg overflow-hidden mb-6"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${game.color}40 100%)`,
            border: `3px solid ${game.color}`,
            boxShadow: `0 0 30px ${game.color}40`,
          }}
        >
          {/* Image de fond */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${game.image})` }}
          />

          {/* Contenu */}
          <div className="relative p-6 text-center">
            <div
              className="text-7xl mb-4 filter drop-shadow-lg"
              style={{ filter: `drop-shadow(0 0 20px ${game.color})` }}
            >
              {game.icon}
            </div>
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ textShadow: `0 0 20px ${game.color}` }}
            >
              {game.name}
            </h1>
            <p className="text-white/80 max-w-md mx-auto">
              {game.description}
            </p>
          </div>
        </div>

        {/* Joueurs en ligne */}
        <OnlinePlayers
          gameSlug={gameSlug}
          gameName={game.name}
          gameIcon={game.icon}
          players={[]}
          totalPlayers={mockGameStats.totalPlayers}
          playersInRegion={mockGameStats.playersInRegion}
          superCompatible={mockGameStats.superCompatible}
        />

        {/* Ce jeu en chiffres */}
        <div className="card-90s blue p-5 mb-6">
          <h3 className="text-lg font-bold text-[#00FFFF] mb-4" style={{ textShadow: '0 0 10px #00FFFF' }}>
            📊 CE JEU EN CHIFFRES
          </h3>
          <div className="space-y-2 text-white/80">
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>{mockGameStats.totalPlayers} joueurs au total</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{mockGameStats.playersInRegion} dans ta région</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💕</span>
              <span>{mockGameStats.superCompatible} super compatibles (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span>Dernier joueur : {mockGameStats.lastPlayer}</span>
            </div>
          </div>
        </div>

        {/* Alertes */}
        <div className="card-90s p-5 mb-6" style={{ borderColor: alertsEnabled ? '#39FF14' : 'rgba(255,255,255,0.2)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                🔔 Alertes pour ce jeu
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Être notifié quand quelqu'un de compatible joue
              </p>
            </div>
            <button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              className={`w-14 h-8 rounded-full transition-all ${
                alertsEnabled
                  ? 'bg-[#39FF14]'
                  : 'bg-white/20'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  alertsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {alertsEnabled && (
            <Link
              href={`/games/${gameSlug}/alerts`}
              className="block mt-4 text-sm text-[#00FFFF] hover:text-[#FFFF00] transition"
            >
              ⚙️ Configurer les alertes →
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {game.playPath ? (
            <Link
              href={game.playPath}
              className="btn-cta-primary w-full justify-center block"
            >
              ▶️ JOUER
            </Link>
          ) : (
            <button
              disabled
              className="btn-cta-primary w-full justify-center opacity-50 cursor-not-allowed"
            >
              🔒 BIENTÔT DISPONIBLE
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/games/${gameSlug}/players`}
              className="btn-cta-secondary justify-center text-sm py-3"
            >
              👥 Salle des joueurs
            </Link>
            <Link
              href={`/games/${gameSlug}/leaderboard`}
              className="btn-cta-secondary justify-center text-sm py-3"
            >
              🏆 Classement
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
