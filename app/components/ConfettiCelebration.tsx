'use client'

import { useEffect, useState } from 'react'

interface ConfettiCelebrationProps {
  trigger: boolean
  duration?: number
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  rotation: number
  speedX: number
  speedY: number
  rotationSpeed: number
}

const COLORS = ['#FF00FF', '#00FFFF', '#39FF14', '#FFFF00', '#FF6600', '#FF3131']

export default function ConfettiCelebration({
  trigger,
  duration = 3000,
  onComplete
}: ConfettiCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)

      // Générer les particules
      const newParticles: Particle[] = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          size: 8 + Math.random() * 8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
          speedX: (Math.random() - 0.5) * 3,
          speedY: 2 + Math.random() * 3,
          rotationSpeed: (Math.random() - 0.5) * 10
        })
      }
      setParticles(newParticles)

      // Nettoyer après la durée
      const timer = setTimeout(() => {
        setParticles([])
        setIsActive(false)
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [trigger, isActive, duration, onComplete])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-particle {
          position: absolute;
          animation: confettiFall 3s ease-out forwards;
        }
      `}</style>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${Math.random() * 0.5}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            boxShadow: `0 0 ${particle.size / 2}px ${particle.color}`
          }}
        />
      ))}
    </div>
  )
}
