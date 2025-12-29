'use client'

import { Lock, Play } from 'lucide-react'

interface GameCardProps {
  icon: string
  name: string
  description: string
  isLocked?: boolean
  unlockWeek?: number
  unlockLabel?: string
  onClick?: () => void
  isNew?: boolean
}

export default function GameCard({
  icon,
  name,
  description,
  isLocked = false,
  unlockWeek,
  unlockLabel,
  onClick,
  isNew = false
}: GameCardProps) {
  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={`
        relative card p-6 transition-all duration-300
        ${isLocked
          ? 'opacity-60 grayscale cursor-not-allowed'
          : 'cursor-pointer hover:scale-105 hover:shadow-lg'
        }
      `}
    >
      {/* Badge Nouveau */}
      {isNew && !isLocked && (
        <div className="absolute -top-2 -right-2 bg-coral text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse-soft">
          NEW
        </div>
      )}

      {/* Icône du jeu */}
      <div className="text-5xl mb-4 text-center">
        {icon}
      </div>

      {/* Nom du jeu */}
      <h3 className="text-xl text-center mb-2 text-gray-800">
        {name}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 text-center mb-4">
        {description}
      </p>

      {/* Bouton / Badge */}
      {isLocked ? (
        <div className="flex items-center justify-center gap-2 bg-gray-100 text-gray-500 py-2 px-4 rounded-full text-sm font-medium">
          <Lock className="w-4 h-4" />
          {unlockLabel || (unlockWeek ? `Semaine ${unlockWeek}` : 'Bientôt')}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-coral to-orange text-white py-2 px-4 rounded-full text-sm font-semibold">
          <Play className="w-4 h-4" />
          Jouer
        </div>
      )}
    </div>
  )
}
