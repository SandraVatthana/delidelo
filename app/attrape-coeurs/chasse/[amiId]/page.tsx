'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

// Mock des amis
const mockAmis: Record<string, { id: string; pseudo: string; photo: null }> = {
  '1': { id: '1', pseudo: 'LunaStar', photo: null },
  '2': { id: '2', pseudo: 'MaxGamer', photo: null },
  '3': { id: '3', pseudo: 'CyberKat', photo: null },
}

// Mock des profils à chasser
const mockProfils = [
  {
    id: '1',
    pseudo: 'StarPlayer',
    age: 25,
    ville: 'Paris',
    bio: 'Gamer passionné, fan de RPG et de soirées gaming entre potes !',
    jeux: ['League of Legends', 'Zelda', 'Mario Kart'],
    photo: null,
  },
  {
    id: '2',
    pseudo: 'NightOwl',
    age: 23,
    ville: 'Lyon',
    bio: 'Insomniak qui cherche des gens pour des sessions nocturnes',
    jeux: ['Valorant', 'Minecraft', 'Among Us'],
    photo: null,
  },
  {
    id: '3',
    pseudo: 'PixelQueen',
    age: 27,
    ville: 'Bordeaux',
    bio: 'Fan de jeux indés et de pixel art. Toujours partante pour découvrir de nouveaux jeux !',
    jeux: ['Stardew Valley', 'Hollow Knight', 'Celeste'],
    photo: null,
  },
]

export default function ChasseAmi() {
  const router = useRouter()
  const params = useParams()
  const amiId = params.amiId as string

  const ami = mockAmis[amiId]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSendModal, setShowSendModal] = useState(false)
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const currentProfil = mockProfils[currentIndex]

  // Si ami non trouvé
  if (!ami) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-pattern" />
        <div className="text-6xl mb-4">🤷</div>
        <p className="text-white/60 mb-4">Ami non trouvé</p>
        <Link href="/attrape-coeurs" className="btn-cta-primary">
          Retour
        </Link>
      </div>
    )
  }

  const handlePass = () => {
    if (currentIndex < mockProfils.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      router.push('/attrape-coeurs')
    }
  }

  const handleCatch = () => {
    setShowSendModal(true)
  }

  const handleSend = () => {
    // En prod: sauvegarder en base via Supabase
    console.log('Envoi du coeur:', {
      profil: currentProfil,
      pourAmi: ami,
      message,
      isAnonymous,
    })

    setShowSendModal(false)
    setMessage('')

    if (currentIndex < mockProfils.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      router.push('/attrape-coeurs?sent=true')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-pattern" />

      {/* Header avec info ami */}
      <header className="px-4 py-4 border-b-2 border-[#FF00FF]/30">
        <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/attrape-coeurs"
            className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
          >
            ← Retour
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Chasse pour</span>
            <span className="px-3 py-1 bg-[#FF00FF] text-white font-bold">
              {ami.pseudo}
            </span>
          </div>
        </div>
      </header>

      {/* Profil actuel */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          {/* Compteur */}
          <div className="text-center mb-4">
            <span className="text-white/40 text-sm">
              {currentIndex + 1} / {mockProfils.length}
            </span>
          </div>

          {/* Card profil */}
          <div className="card-90s pink overflow-hidden">
            {/* Photo/Avatar */}
            <div className="aspect-[4/3] bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center relative">
              <span className="text-8xl">{currentProfil.pseudo[0]}</span>
              {/* Badge compatibilité (mock) */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#39FF14] text-black font-bold text-sm">
                85% compatible
              </div>
            </div>

            {/* Infos */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {currentProfil.pseudo}
                  </h2>
                  <p className="text-[#00FFFF]">
                    {currentProfil.age} ans • {currentProfil.ville}
                  </p>
                </div>
              </div>

              <p className="text-white/80">{currentProfil.bio}</p>

              {/* Jeux en commun */}
              <div>
                <p className="text-xs text-[#39FF14] uppercase mb-2 font-bold">
                  🎮 Jeux en commun avec {ami.pseudo}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentProfil.jeux.slice(0, 2).map((jeu, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#39FF14]/20 border border-[#39FF14] text-sm text-[#39FF14]"
                    >
                      {jeu}
                    </span>
                  ))}
                </div>
              </div>

              {/* Autres jeux */}
              {currentProfil.jeux.length > 2 && (
                <div>
                  <p className="text-xs text-white/40 uppercase mb-2">Autres jeux</p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfil.jeux.slice(2).map((jeu, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#330066] border border-[#FF00FF] text-sm text-[#FF00FF]"
                      >
                        {jeu}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePass}
              className="flex-1 py-4 bg-transparent border-2 border-white/30 text-white/60 font-bold text-lg hover:border-[#FF3131] hover:text-[#FF3131] transition flex items-center justify-center gap-2"
            >
              ✕ Passer
            </button>
            <button
              onClick={handleCatch}
              className="flex-1 py-4 bg-[#FF00FF] border-2 border-[#FF00FF] text-white font-bold text-lg hover:bg-[#FF00FF]/80 transition flex items-center justify-center gap-2 animate-pulse"
            >
              💘 Attraper
            </button>
          </div>

          {/* Tip */}
          <p className="text-center text-white/40 text-xs mt-4">
            Tu penses que {currentProfil.pseudo} plairait à {ami.pseudo} ?
          </p>
        </div>
      </main>

      {/* Modal d'envoi */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="card-90s pink p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4 animate-bounce">💘</div>
              <h2 className="text-2xl font-bold text-[#FF00FF] mb-2" style={{ textShadow: '0 0 10px #FF00FF' }}>
                Envoyer le coeur !
              </h2>
              <p className="text-white/60">
                Tu vas envoyer <strong className="text-[#00FFFF]">{currentProfil.pseudo}</strong> à{' '}
                <strong className="text-[#FF00FF]">{ami.pseudo}</strong>
              </p>
            </div>

            {/* Preview du profil */}
            <div className="p-4 bg-[#330066] border-2 border-[#FF00FF] mb-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {currentProfil.pseudo[0]}
              </div>
              <div>
                <p className="font-bold text-white">{currentProfil.pseudo}</p>
                <p className="text-sm text-[#00FFFF]">{currentProfil.age} ans • {currentProfil.ville}</p>
              </div>
            </div>

            {/* Message du Cupidon */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-[#FF00FF] mb-2 uppercase">
                Un petit mot pour {ami.pseudo} ? (optionnel)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-90s w-full h-24 resize-none"
                placeholder="Je pense que cette personne te plairait parce que..."
                maxLength={200}
              />
              <p className="text-right text-xs text-white/40 mt-1">
                {message.length}/200
              </p>
            </div>

            {/* Suggestions de messages */}
            <div className="mb-4">
              <p className="text-xs text-white/40 mb-2">Suggestions :</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Vous avez les mêmes jeux !",
                  "Je sens le match !",
                  "Trop votre style !",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(suggestion)}
                    className="px-3 py-1 bg-[#1A0033] border border-white/20 text-xs text-white/60 hover:border-[#FF00FF] hover:text-[#FF00FF] transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Option anonyme */}
            <div className="flex items-center gap-3 p-3 bg-[#1A0033] border border-white/20 mb-6">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 accent-[#FF00FF]"
              />
              <label htmlFor="anonymous" className="text-sm text-white/80">
                Rester anonyme ({ami.pseudo} ne saura pas que c'est toi)
              </label>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSendModal(false)
                  setMessage('')
                }}
                className="flex-1 py-3 bg-transparent border-2 border-white/30 text-white/60 font-bold hover:border-white hover:text-white transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSend}
                className="flex-1 py-3 bg-[#39FF14] border-2 border-[#39FF14] text-black font-bold hover:opacity-90 transition"
              >
                💘 Envoyer !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
