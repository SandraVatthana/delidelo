'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function JeuOiePage() {
  useEffect(() => {
    // Masquer la scrollbar du body quand l'iframe est chargée
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0015' }}>
      {/* Header minimaliste */}
      <header className="flex-shrink-0 bg-[#1A0033]/95 backdrop-blur-sm px-4 py-2 flex items-center justify-between z-50">
        <Link
          href="/games"
          className="text-white/60 hover:text-[#FF00FF] transition flex items-center gap-2"
        >
          <span>←</span>
          <span className="hidden sm:inline">Retour aux jeux</span>
        </Link>
        <h1
          className="text-lg font-bold"
          style={{
            fontFamily: 'Bangers, cursive',
            color: '#FF00FF',
            textShadow: '0 0 10px #FF00FF'
          }}
        >
          🎲 Jeu de l'Oie
        </h1>
        <Link
          href="/dashboard"
          className="text-white/60 hover:text-[#00FFFF] transition"
        >
          🏠
        </Link>
      </header>

      {/* Iframe qui charge le jeu HTML */}
      <iframe
        src="/jeu-oie-v3.html"
        className="flex-1 w-full border-0"
        style={{
          minHeight: 'calc(100vh - 50px)',
          background: '#0D0015'
        }}
        title="Jeu de l'Oie V3"
        allow="fullscreen"
      />
    </div>
  )
}
