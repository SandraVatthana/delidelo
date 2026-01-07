'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { GamePlayer } from '@/types'

// Configuration des jeux
const gamesConfig: Record<string, { name: string; icon: string }> = {
  'manege': { name: 'Le Manège', icon: '🎠' },
  'jeu-oie': { name: 'Le Jeu de l\'Oie', icon: '🎲' },
  'la-tarte': { name: 'La Tarte', icon: '🥧' },
  'refais-la-france': { name: 'Refais la France', icon: '🗺️' },
  'goonies': { name: 'Les Goonies', icon: '🎬' },
  'dirty-dancing': { name: 'Dirty Dancing', icon: '💃' },
  'temple-maudit': { name: 'Le Temple Maudit', icon: '🏛️' },
  'action-verite': { name: 'Action ou Vérité', icon: '🎯' },
}

// Mock data - joueurs
const mockPlayers: GamePlayer[] = [
  {
    user_id: '1',
    game_id: 'manege',
    best_score: 3200,
    best_rank: 1,
    times_played: 12,
    last_played_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // il y a 5 min
    user: { pseudo: 'Sophie', age: 28, city: 'Bayonne' },
    compatibility: 91,
    is_ai_recommended: true,
  },
  {
    user_id: '2',
    game_id: 'manege',
    best_score: 2180,
    best_rank: 35,
    times_played: 5,
    last_played_at: new Date().toISOString(),
    user: { pseudo: 'Lucas', age: 31, city: 'Biarritz' },
    compatibility: 87,
    is_ai_recommended: true,
  },
  {
    user_id: '3',
    game_id: 'manege',
    best_score: 1890,
    best_rank: 52,
    times_played: 3,
    last_played_at: new Date().toISOString(),
    user: { pseudo: 'Marc', age: 29, city: 'Hossegor' },
    compatibility: 72,
  },
  {
    user_id: '4',
    game_id: 'manege',
    best_score: 2450,
    best_rank: 23,
    times_played: 8,
    last_played_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // il y a 2h
    user: { pseudo: 'Léa', age: 26, city: 'Pau' },
    compatibility: 68,
  },
  {
    user_id: '5',
    game_id: 'manege',
    best_score: 1650,
    best_rank: 78,
    times_played: 2,
    last_played_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // hier
    user: { pseudo: 'Antoine', age: 32, city: 'Bordeaux' },
    compatibility: 65,
  },
  {
    user_id: '6',
    game_id: 'manege',
    best_score: 2100,
    best_rank: 40,
    times_played: 4,
    last_played_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // il y a 2 jours
    user: { pseudo: 'Emma', age: 27, city: 'Anglet' },
    compatibility: 82,
    is_ai_recommended: true,
  },
]

type FilterType = 'all' | 'online' | 'region' | 'super'

export default function PlayersRoomPage() {
  const params = useParams()
  const gameSlug = params.gameSlug as string
  const game = gamesConfig[gameSlug] || { name: 'Jeu', icon: '🎮' }

  const [filter, setFilter] = useState<FilterType>('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<GamePlayer | null>(null)

  // Simuler les joueurs en ligne (2 premiers)
  const onlinePlayers = mockPlayers.slice(0, 3)
  const offlinePlayers = mockPlayers.slice(3)

  // Filtrer les joueurs
  const filteredPlayers = useMemo(() => {
    let players = [...mockPlayers]

    switch (filter) {
      case 'online':
        players = onlinePlayers
        break
      case 'region':
        players = mockPlayers.filter(p =>
          ['Biarritz', 'Bayonne', 'Hossegor', 'Anglet'].includes(p.user?.city || '')
        )
        break
      case 'super':
        players = mockPlayers.filter(p => (p.compatibility || 0) >= 80)
        break
    }

    // Trier : recommandés IA d'abord, puis par compatibilité
    return players.sort((a, b) => {
      if (a.is_ai_recommended && !b.is_ai_recommended) return -1
      if (!a.is_ai_recommended && b.is_ai_recommended) return 1
      return (b.compatibility || 0) - (a.compatibility || 0)
    })
  }, [filter])

  const handleInvite = (player: GamePlayer) => {
    setSelectedPlayer(player)
    setShowInviteModal(true)
  }

  const formatLastSeen = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 5) return 'En ligne'
    if (diffMins < 60) return `il y a ${diffMins} min`
    if (diffHours < 24) return `il y a ${diffHours}h`
    if (diffDays === 1) return 'hier'
    return `il y a ${diffDays} jours`
  }

  const isOnline = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime()
    return diffMs < 5 * 60 * 1000 // moins de 5 min
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
              href={`/games/${gameSlug}`}
              className="text-[#00FFFF] hover:text-[#FFFF00] transition text-xl"
            >
              ←
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ textShadow: '0 0 10px #FF00FF' }}>
                👥 Salle des Joueurs
              </h1>
              <p className="text-sm text-white/60">
                {game.icon} {game.name} • {mockPlayers.length} joueurs
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {[
            { id: 'all', label: 'Tous', count: mockPlayers.length },
            { id: 'online', label: 'En ligne', count: onlinePlayers.length, color: '#39FF14' },
            { id: 'region', label: 'Ma région', count: 4 },
            { id: 'super', label: 'Super compatibles', count: 3, color: '#FF00FF' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as FilterType)}
              className={`flex-shrink-0 px-4 py-2 border-2 font-bold text-sm transition ${
                filter === f.id
                  ? 'border-[#FF00FF] bg-[#FF00FF]/20 text-white'
                  : 'border-white/20 text-white/60 hover:border-white/40'
              }`}
              style={filter === f.id && f.color ? { borderColor: f.color, boxShadow: `0 0 10px ${f.color}40` } : {}}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Section En ligne */}
        {(filter === 'all' || filter === 'online') && onlinePlayers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-[#39FF14] mb-3 flex items-center gap-2" style={{ textShadow: '0 0 10px #39FF14' }}>
              <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
              EN LIGNE ({onlinePlayers.length})
            </h2>
            <div className="space-y-3">
              {onlinePlayers.map(player => (
                <PlayerCard
                  key={player.user_id}
                  player={player}
                  isOnline={true}
                  onInvite={() => handleInvite(player)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section Hors ligne */}
        {filter === 'all' && offlinePlayers.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-white/60 mb-3">
              🕐 HORS LIGNE ({offlinePlayers.length})
            </h2>
            <div className="space-y-3">
              {offlinePlayers.map(player => (
                <PlayerCard
                  key={player.user_id}
                  player={player}
                  isOnline={false}
                  lastSeen={formatLastSeen(player.last_played_at)}
                  onInvite={() => handleInvite(player)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Liste filtrée (autres filtres) */}
        {filter !== 'all' && filter !== 'online' && (
          <div className="space-y-3">
            {filteredPlayers.map(player => (
              <PlayerCard
                key={player.user_id}
                player={player}
                isOnline={isOnline(player.last_played_at)}
                lastSeen={!isOnline(player.last_played_at) ? formatLastSeen(player.last_played_at) : undefined}
                onInvite={() => handleInvite(player)}
              />
            ))}
          </div>
        )}

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <div className="text-5xl mb-4">🔍</div>
            <p>Aucun joueur trouvé avec ce filtre</p>
          </div>
        )}
      </main>

      {/* Modal d'invitation */}
      {showInviteModal && selectedPlayer && (
        <InviteModal
          player={selectedPlayer}
          gameName={game.name}
          gameIcon={game.icon}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  )
}

// Composant PlayerCard
interface PlayerCardProps {
  player: GamePlayer
  isOnline: boolean
  lastSeen?: string
  onInvite: () => void
}

function PlayerCard({ player, isOnline, lastSeen, onInvite }: PlayerCardProps) {
  return (
    <div className="card-90s p-4 flex items-center gap-4" style={{ borderColor: isOnline ? '#39FF14' : 'rgba(255,255,255,0.2)' }}>
      {/* Avatar */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-2xl font-bold">
          {player.user?.pseudo?.charAt(0) || '?'}
        </div>
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#39FF14] rounded-full border-2 border-[#1A0033]" />
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {player.is_ai_recommended && (
            <span className="text-[#FFFF00]" title="Recommandé par l'IA">⭐</span>
          )}
          <span className="font-bold text-white">
            {player.user?.pseudo}, {player.user?.age} ans
          </span>
          {player.user?.city && (
            <span className="text-white/50 text-sm">• {player.user.city}</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm mt-1">
          <span className="text-[#FF00FF]" style={{ textShadow: '0 0 5px #FF00FF' }}>
            💕 {player.compatibility}%
          </span>
          <span className="text-white/50">
            Score: {player.best_score} pts ({player.best_rank}ème)
          </span>
        </div>

        {lastSeen && (
          <div className="text-xs text-white/40 mt-1">
            Dernière connexion : {lastSeen}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onInvite}
          className="px-3 py-1.5 bg-[#FF00FF] text-white text-xs font-bold hover:scale-105 transition"
          style={{ boxShadow: '0 0 10px #FF00FF' }}
        >
          💬 Discuter
        </button>
        <Link
          href={`/profile/${player.user_id}`}
          className="px-3 py-1.5 border border-[#00FFFF] text-[#00FFFF] text-xs font-bold text-center hover:bg-[#00FFFF]/10 transition"
        >
          👀 Profil
        </Link>
      </div>
    </div>
  )
}

// Modal d'invitation (réutilisé)
interface InviteModalProps {
  player: GamePlayer
  gameName: string
  gameIcon: string
  onClose: () => void
}

function InviteModal({ player, gameName, gameIcon, onClose }: InviteModalProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const iceBreakers = [
    `Alors, fan de ${gameName} toi aussi ?`,
    `J'ai vu ton score... pas mal ! Tu veux une revanche ?`,
    `${gameName} c'est ton jeu préféré ou t'as joué par hasard ?`,
  ]

  const handleSend = async () => {
    setSending(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSending(false)
    setSent(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="card-90s pink p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-white/60 hover:text-white"
        >
          ✕
        </button>

        {sent ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-pulse">💌</div>
            <h3 className="text-xl text-[#39FF14] font-bold" style={{ textShadow: '0 0 10px #39FF14' }}>
              Message envoyé !
            </h3>
            <p className="text-white/70 mt-2">
              {player.user?.pseudo} va recevoir ton invitation
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="text-xl text-white font-bold" style={{ textShadow: '0 0 10px #FF00FF' }}>
                Inviter {player.user?.pseudo} à discuter
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Contexte : {gameIcon} {gameName}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-xs text-[#00FFFF] font-bold mb-2">💡 ICE-BREAKERS :</p>
              <div className="space-y-2">
                {iceBreakers.map((ice, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(ice)}
                    className={`w-full text-left p-2 text-sm border rounded transition ${
                      message === ice
                        ? 'border-[#FF00FF] bg-[#FF00FF]/20 text-white'
                        : 'border-white/20 text-white/70 hover:border-white/40'
                    }`}
                  >
                    "{ice}"
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ou écris ton propre message..."
                className="input-90s w-full h-20 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn-cta-secondary flex-1 justify-center text-sm py-3">
                Annuler
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim() || sending}
                className="btn-cta-primary flex-1 justify-center text-sm py-3 disabled:opacity-50"
              >
                {sending ? '⏳' : '💬 Envoyer'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
