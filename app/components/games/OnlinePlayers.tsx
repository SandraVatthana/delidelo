'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { GamePlayer } from '@/types'

interface OnlinePlayersProps {
  gameSlug: string
  gameName: string
  gameIcon: string
  players: GamePlayer[]
  totalPlayers?: number
  playersInRegion?: number
  superCompatible?: number
}

// Données mock pour démo
const mockOnlinePlayers: GamePlayer[] = [
  {
    user_id: '1',
    game_id: 'manege',
    best_score: 2180,
    times_played: 5,
    last_played_at: new Date().toISOString(),
    user: { pseudo: 'Lucas', age: 31, city: 'Biarritz' },
    compatibility: 87,
    is_ai_recommended: true,
  },
  {
    user_id: '2',
    game_id: 'manege',
    best_score: 1890,
    times_played: 3,
    last_played_at: new Date().toISOString(),
    user: { pseudo: 'Marc', age: 29, city: 'Hossegor' },
    compatibility: 72,
  },
  {
    user_id: '3',
    game_id: 'manege',
    best_score: 1650,
    times_played: 2,
    last_played_at: new Date().toISOString(),
    user: { pseudo: 'Sophie', age: 28, city: 'Bayonne' },
    compatibility: 91,
    is_ai_recommended: true,
  },
]

export default function OnlinePlayers({
  gameSlug,
  gameName,
  gameIcon,
  players = mockOnlinePlayers,
  totalPlayers = 147,
  playersInRegion = 23,
  superCompatible = 8,
}: OnlinePlayersProps) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<GamePlayer | null>(null)

  const handleInvite = (player: GamePlayer) => {
    setSelectedPlayer(player)
    setShowInviteModal(true)
  }

  const displayedPlayers = players.slice(0, 3)
  const remainingCount = players.length - 3

  return (
    <>
      <div className="card-90s pink p-5 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#39FF14] flex items-center gap-2" style={{ textShadow: '0 0 10px #39FF14' }}>
            <span className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse" />
            EN CE MOMENT
          </h3>
          <Link
            href={`/games/${gameSlug}/players`}
            className="text-sm text-[#00FFFF] hover:text-[#FFFF00] transition font-bold"
          >
            Voir tous
          </Link>
        </div>

        {/* Liste des joueurs en ligne */}
        {displayedPlayers.length > 0 ? (
          <div className="space-y-3">
            {displayedPlayers.map((player, index) => (
              <div
                key={player.user_id}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 hover:border-[#FF00FF]/50 transition rounded-lg"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-xl font-bold">
                    {player.user?.pseudo?.charAt(0) || '?'}
                  </div>
                  {/* Indicateur en ligne */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#39FF14] rounded-full border-2 border-[#1A0033]" />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {player.is_ai_recommended && (
                      <span className="text-[#FFFF00]" title="Recommandé par l'IA">⭐</span>
                    )}
                    <span className="font-bold text-white truncate">
                      {player.user?.pseudo}, {player.user?.age} ans
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#FF00FF]" style={{ textShadow: '0 0 5px #FF00FF' }}>
                      💕 {player.compatibility}% compatible
                    </span>
                    {player.user?.city && (
                      <span className="text-white/50">• {player.user.city}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInvite(player)}
                    className="p-2 text-xl hover:scale-110 transition"
                    title="Inviter à discuter"
                  >
                    💬
                  </button>
                  <Link
                    href={`/profile/${player.user_id}`}
                    className="p-2 text-xl hover:scale-110 transition"
                    title="Voir le profil"
                  >
                    👀
                  </Link>
                </div>
              </div>
            ))}

            {remainingCount > 0 && (
              <Link
                href={`/games/${gameSlug}/players`}
                className="block text-center text-sm text-white/60 hover:text-[#00FFFF] transition py-2"
              >
                +{remainingCount} autres joueurs...
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-white/60">
            <div className="text-4xl mb-2">🌙</div>
            <p>Personne n'est en ligne pour l'instant</p>
            <p className="text-sm mt-1">Active les alertes pour être notifié(e) !</p>
          </div>
        )}

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-xl font-bold text-[#FFFF00]" style={{ textShadow: '0 0 10px #FFFF00' }}>
              {totalPlayers}
            </div>
            <div className="text-xs text-white/60">joueurs</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#00FFFF]" style={{ textShadow: '0 0 10px #00FFFF' }}>
              {playersInRegion}
            </div>
            <div className="text-xs text-white/60">dans ta région</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#FF00FF]" style={{ textShadow: '0 0 10px #FF00FF' }}>
              {superCompatible}
            </div>
            <div className="text-xs text-white/60">super compatibles</div>
          </div>
        </div>
      </div>

      {/* Modal d'invitation */}
      {showInviteModal && selectedPlayer && (
        <InviteModal
          player={selectedPlayer}
          gameName={gameName}
          gameIcon={gameIcon}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </>
  )
}

// Composant Modal pour l'invitation
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
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSending(false)
    setSent(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="card-90s pink p-6 max-w-md w-full relative">
        {/* Close button */}
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
            {/* Header */}
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💬</div>
              <h3 className="text-xl text-white font-bold" style={{ textShadow: '0 0 10px #FF00FF' }}>
                Inviter {player.user?.pseudo} à discuter
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Contexte : Vous avez tous les deux joué à {gameIcon} {gameName}
              </p>
            </div>

            {/* Ice-breakers suggérés */}
            <div className="mb-4">
              <p className="text-xs text-[#00FFFF] font-bold mb-2">💡 ICE-BREAKERS SUGGÉRÉS :</p>
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

            {/* Message personnalisé */}
            <div className="mb-4">
              <p className="text-xs text-white/60 mb-2">Ou écris ton propre message :</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ton message..."
                className="input-90s w-full h-24 resize-none"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="btn-cta-secondary flex-1 justify-center text-sm py-3"
              >
                Annuler
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim() || sending}
                className="btn-cta-primary flex-1 justify-center text-sm py-3 disabled:opacity-50"
              >
                {sending ? '⏳ Envoi...' : '💬 Envoyer'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
