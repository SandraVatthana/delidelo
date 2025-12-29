'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock des amis pour qui on peut chasser
const mockAmis = [
  { id: '1', pseudo: 'LunaStar', photo: null },
  { id: '2', pseudo: 'MaxGamer', photo: null },
  { id: '3', pseudo: 'CyberKat', photo: null },
]

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

export default function ChasseCoeurs() {
  const router = useRouter()
  const [selectedAmi, setSelectedAmi] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedProfil, setSelectedProfil] = useState<typeof mockProfils[0] | null>(null)

  const currentProfil = mockProfils[currentIndex]
  const selectedAmiData = mockAmis.find(a => a.id === selectedAmi)

  const handlePass = () => {
    if (currentIndex < mockProfils.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Plus de profils
      router.push('/attrape-coeurs')
    }
  }

  const handleCatch = () => {
    setSelectedProfil(currentProfil)
    setShowSendModal(true)
  }

  // Étape 1: Choisir pour quel ami on chasse
  if (!selectedAmi) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-pattern" />

        <header className="px-4 py-4">
          <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Link
              href="/attrape-coeurs"
              className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
            >
              ← Retour
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h1 className="text-3xl font-bold text-[#FF00FF] mb-2" style={{ textShadow: '0 0 20px #FF00FF' }}>
                Pour qui chasses-tu ?
              </h1>
              <p className="text-[#00FFFF] font-bold">
                Choisis l'ami(e) pour qui tu veux attraper des coeurs
              </p>
            </div>

            <div className="space-y-3">
              {mockAmis.map((ami) => (
                <button
                  key={ami.id}
                  onClick={() => setSelectedAmi(ami.id)}
                  className="w-full card-90s cyan p-4 flex items-center gap-4 hover:scale-[1.02] transition"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-2xl font-bold">
                    {ami.pseudo[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-white text-lg">{ami.pseudo}</h3>
                    <p className="text-sm text-[#00FFFF]">Chasser pour lui/elle</p>
                  </div>
                  <span className="text-2xl">🏹</span>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/attrape-coeurs/inviter"
                className="text-[#FF00FF] hover:text-[#FFFF00] transition font-bold"
              >
                + Inviter un nouvel ami
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Étape 2: Défilé des profils
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-pattern" />

      {/* Header avec info ami */}
      <header className="px-4 py-4 border-b-2 border-[#FF00FF]/30">
        <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setSelectedAmi(null)}
            className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
          >
            ← Changer
          </button>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm">Chasse pour</span>
            <span className="px-3 py-1 bg-[#FF00FF] text-white font-bold">
              {selectedAmiData?.pseudo}
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
            <div className="aspect-[4/3] bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center">
              <span className="text-8xl">{currentProfil.pseudo[0]}</span>
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

              {/* Jeux */}
              <div>
                <p className="text-xs text-white/40 uppercase mb-2">Jeux préférés</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfil.jeux.map((jeu, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#330066] border border-[#FF00FF] text-sm text-[#FF00FF]"
                    >
                      🎮 {jeu}
                    </span>
                  ))}
                </div>
              </div>
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
              className="flex-1 py-4 bg-[#FF00FF] border-2 border-[#FF00FF] text-white font-bold text-lg hover:bg-[#FF00FF]/80 transition flex items-center justify-center gap-2"
            >
              💘 Attraper
            </button>
          </div>

          {/* Tip */}
          <p className="text-center text-white/40 text-xs mt-4">
            Tu penses que {currentProfil.pseudo} plairait à {selectedAmiData?.pseudo} ?
          </p>
        </div>
      </main>

      {/* Modal d'envoi */}
      {showSendModal && selectedProfil && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="card-90s pink p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">💘</div>
              <h2 className="text-2xl font-bold text-[#FF00FF] mb-2" style={{ textShadow: '0 0 10px #FF00FF' }}>
                Envoyer le coeur !
              </h2>
              <p className="text-white/60">
                Tu vas envoyer <strong className="text-[#00FFFF]">{selectedProfil.pseudo}</strong> à{' '}
                <strong className="text-[#FF00FF]">{selectedAmiData?.pseudo}</strong>
              </p>
            </div>

            {/* Preview */}
            <div className="p-4 bg-[#330066] border-2 border-[#FF00FF] mb-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-2xl font-bold">
                {selectedProfil.pseudo[0]}
              </div>
              <div>
                <p className="font-bold text-white">{selectedProfil.pseudo}</p>
                <p className="text-sm text-[#00FFFF]">{selectedProfil.age} ans • {selectedProfil.ville}</p>
              </div>
            </div>

            {/* Message optionnel */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#FF00FF] mb-2 uppercase">
                Un petit mot pour {selectedAmiData?.pseudo} ? (optionnel)
              </label>
              <textarea
                className="input-90s w-full h-20 resize-none"
                placeholder="Je pense que cette personne te plairait..."
              />
            </div>

            {/* Option anonyme */}
            <div className="flex items-center gap-3 p-3 bg-[#1A0033] border border-white/20 mb-6">
              <input
                type="checkbox"
                id="anonymous"
                className="w-5 h-5 accent-[#FF00FF]"
              />
              <label htmlFor="anonymous" className="text-sm text-white/80">
                Rester anonyme (ton ami ne saura pas que c'est toi)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 py-3 bg-transparent border-2 border-white/30 text-white/60 font-bold hover:border-white hover:text-white transition"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowSendModal(false)
                  // En prod: sauvegarder en base
                  if (currentIndex < mockProfils.length - 1) {
                    setCurrentIndex(currentIndex + 1)
                  } else {
                    router.push('/attrape-coeurs?sent=true')
                  }
                }}
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
