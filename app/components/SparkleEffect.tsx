'use client'

import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
}

interface SparkleEffectProps {
  children: React.ReactNode
  colors?: string[]
  count?: number
  size?: number
  className?: string
}

export default function SparkleEffect({
  children,
  colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#39FF14'],
  count = 6,
  size = 8,
  className = ''
}: SparkleEffectProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = []
      for (let i = 0; i < count; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: size * (0.5 + Math.random() * 0.5),
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2
        })
      }
      setSparkles(newSparkles)
    }

    generateSparkles()
    const interval = setInterval(generateSparkles, 2000)
    return () => clearInterval(interval)
  }, [colors, count, size])

  return (
    <div className={`relative inline-block ${className}`}>
      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
        }
        .sparkle-star {
          position: absolute;
          pointer-events: none;
          animation: sparkle 2s ease-in-out infinite;
        }
        .sparkle-star::before,
        .sparkle-star::after {
          content: '';
          position: absolute;
          background: currentColor;
        }
        .sparkle-star::before {
          width: 100%;
          height: 30%;
          top: 35%;
          left: 0;
          border-radius: 50%;
        }
        .sparkle-star::after {
          width: 30%;
          height: 100%;
          top: 0;
          left: 35%;
          border-radius: 50%;
        }
      `}</style>

      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle-star"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            color: sparkle.color,
            animationDelay: `${sparkle.delay}s`,
            filter: `drop-shadow(0 0 ${sparkle.size / 2}px ${sparkle.color})`
          }}
        />
      ))}
      {children}
    </div>
  )
}
