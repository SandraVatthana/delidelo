'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface GameCardProps {
  id: string
  icon: string
  title: string
  desc: string
  available: boolean
  path?: string
  isNew?: boolean
  isPermanent?: boolean
  color: string
  image?: string // Chemin vers image Midjourney
}

// Mapping des couleurs
const getCardBorderColor = (color: string) => {
  switch(color) {
    case 'pink': return '#FF00FF'
    case 'green': return '#39FF14'
    case 'blue': return '#00FFFF'
    case 'yellow': return '#FFFF00'
    case 'orange': return '#FF6600'
    case 'red': return '#FF3131'
    default: return '#FF00FF'
  }
}

export default function GameCard({
  id,
  icon,
  title,
  desc,
  available,
  path,
  isNew,
  isPermanent,
  color,
  image
}: GameCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const borderColor = getCardBorderColor(color)

  const handleClick = () => {
    if (available && path) {
      router.push(path)
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        game-card relative overflow-hidden transition-all duration-300
        ${available
          ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-2'
          : 'opacity-40 grayscale cursor-not-allowed'}
      `}
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: `3px solid ${available ? borderColor : 'rgba(255,255,255,0.2)'}`,
        borderRadius: '20px',
        boxShadow: available && isHovered ? `0 0 40px ${borderColor}50` : available ? `0 0 25px ${borderColor}30` : 'none'
      }}
    >
      {/* Badges */}
      {isNew && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          <span
            className="px-2 py-0.5 text-white text-xs font-bold animate-pulse"
            style={{
              background: '#FF00FF',
              boxShadow: '0 0 10px #FF00FF'
            }}
          >
            NEW
          </span>
        </div>
      )}
      {isPermanent && (
        <span
          className="absolute top-3 right-3 z-10 px-2 py-0.5 text-xs font-bold"
          style={{ background: '#39FF14', color: '#1A0033' }}
        >
          24/7
        </span>
      )}

      {/* Image ou Emoji */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: image && !imageError ? '1' : 'auto',
          borderBottom: image && !imageError ? `2px solid ${borderColor}` : 'none'
        }}
      >
        {image && !imageError ? (
          <>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              onError={() => setImageError(true)}
            />
            {/* Overlay au hover */}
            {isHovered && available && (
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                style={{ background: 'rgba(26, 0, 51, 0.7)' }}
              >
                <span className="text-6xl animate-bounce">{icon}</span>
              </div>
            )}
          </>
        ) : (
          <div className="p-5 text-center">
            <div
              className="text-5xl mb-3 transition-transform duration-300"
              style={{
                transform: isHovered && available ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
                filter: isHovered && available ? `drop-shadow(0 0 20px ${borderColor})` : 'none'
              }}
            >
              {icon}
            </div>
          </div>
        )}
      </div>

      {/* Contenu texte */}
      <div className="p-5 text-center">
        {(!image || imageError) && <div className="mb-0" />}
        <h3
          className="text-xl font-bold mb-2"
          style={{
            fontFamily: 'Bangers, cursive',
            color: available ? borderColor : 'rgba(255,255,255,0.5)',
            textShadow: available ? `0 0 10px ${borderColor}` : 'none',
            letterSpacing: '1px'
          }}
        >
          {title}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
          {desc}
        </p>

        {/* Status */}
        <div className="mt-3">
          {!available && (
            <span className="text-sm text-white/50">🔒 Bientôt</span>
          )}
          {available && (
            <span className="text-sm font-bold" style={{ color: '#39FF14' }}>
              ✅ Jouer
            </span>
          )}
        </div>
      </div>

      {/* Effet de brillance au hover */}
      {available && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 40%, ${borderColor}20 50%, transparent 60%)`,
            animation: 'shine 0.5s ease-out'
          }}
        />
      )}

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
