'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface GameCardProps {
  id: string
  icon: string
  title: string
  desc: string
  available: boolean
  path?: string
  isNew?: boolean
  isPermanent?: boolean
  isPremium?: boolean
  color: string
  image?: string
  userIsPremium?: boolean
  onPremiumBlock?: () => void
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
  isPremium = false,
  color,
  image,
  userIsPremium = false,
  onPremiumBlock
}: GameCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const borderColor = getCardBorderColor(color)

  // Logique d'accès: jeu premium + user non premium = bloqué
  const isLocked = isPremium && !userIsPremium

  const handleClick = () => {
    if (!available) return

    if (isLocked && onPremiumBlock) {
      onPremiumBlock()
      return
    }

    if (path) {
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
        ${available && !isLocked
          ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-2'
          : available && isLocked
          ? 'cursor-pointer hover:scale-[1.01]'
          : 'opacity-40 grayscale cursor-not-allowed'}
      `}
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: `3px solid ${available ? (isLocked ? '#FFD700' : borderColor) : 'rgba(255,255,255,0.2)'}`,
        borderRadius: '20px',
        boxShadow: available && isHovered
          ? `0 0 40px ${isLocked ? '#FFD700' : borderColor}50`
          : available
          ? `0 0 25px ${isLocked ? '#FFD700' : borderColor}30`
          : 'none'
      }}
    >
      {/* Badge FREE/PREMIUM - Position top left */}
      <div className="absolute top-3 left-3 z-20">
        {isPremium ? (
          <span
            className="px-2 py-1 text-xs font-bold flex items-center gap-1"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#1A0033',
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }}
          >
            🔒 PREMIUM
          </span>
        ) : (
          <span
            className="px-2 py-1 text-xs font-bold"
            style={{
              background: '#39FF14',
              color: '#1A0033',
              borderRadius: '4px',
              boxShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
            }}
          >
            GRATUIT
          </span>
        )}
      </div>

      {/* Badges NEW / 24/7 - Position top right */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        {isNew && (
          <span
            className="px-2 py-0.5 text-white text-xs font-bold animate-pulse"
            style={{
              background: '#FF00FF',
              boxShadow: '0 0 10px #FF00FF'
            }}
          >
            NEW
          </span>
        )}
        {isPermanent && (
          <span
            className="px-2 py-0.5 text-xs font-bold"
            style={{ background: '#39FF14', color: '#1A0033' }}
          >
            24/7
          </span>
        )}
      </div>

      {/* Overlay cadenas pour jeux premium verrouillés */}
      {isLocked && available && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(2px)'
          }}
        >
          <div className="text-center">
            <div className="text-5xl mb-2">🔒</div>
            <span
              className="text-sm font-bold px-3 py-1 rounded"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#1A0033'
              }}
            >
              PREMIUM
            </span>
          </div>
        </div>
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
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 340px"
              quality={90}
              className="object-cover transition-transform duration-300"
              style={{ transform: isHovered && !isLocked ? 'scale(1.05)' : 'scale(1)' }}
              onError={() => setImageError(true)}
            />
            {/* Overlay au hover */}
            {isHovered && available && !isLocked && (
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
                transform: isHovered && available && !isLocked ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
                filter: isHovered && available && !isLocked ? `drop-shadow(0 0 20px ${borderColor})` : 'none'
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
            color: available ? (isLocked ? '#FFD700' : borderColor) : 'rgba(255,255,255,0.5)',
            textShadow: available ? `0 0 10px ${isLocked ? '#FFD700' : borderColor}` : 'none',
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
          {available && isLocked && (
            <Link
              href="/premium"
              className="text-sm font-bold hover:underline"
              style={{ color: '#FFD700' }}
              onClick={(e) => e.stopPropagation()}
            >
              💎 Débloquer
            </Link>
          )}
          {available && !isLocked && (
            <span className="text-sm font-bold" style={{ color: '#39FF14' }}>
              ✅ Jouer
            </span>
          )}
        </div>
      </div>

      {/* Effet de brillance au hover */}
      {available && isHovered && !isLocked && (
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
