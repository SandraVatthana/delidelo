'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock des coeurs reçus
const mockCoeursRecus = [
  {
    id: '1',
    cupidonPseudo: 'Anonyme',
    cupidonId: null,
    isAnonymous: true,
    profil: {
      id: 'p1',
      pseudo: 'StarPlayer',
      age: 25,
      ville: 'Paris',
      bio: 'Gamer passionné, fan de RPG et de soirées gaming entre potes !',
      jeux: ['League of Legends', 'Zelda', 'Mario Kart'],
    },
    message: "Je pense que cette personne te plairait !",
    isNew: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: '2',
    cupidonPseudo: 'LunaStar',
    cupidonId: 'c1',
    isAnonymous: false,
    profil: {
      id: 'p2',
      pseudo: 'NightOwl',
      age: 23,
      ville: 'Lyon',
      bio: 'Insomniak qui cherche des gens pour des sessions nocturnes',
      jeux: ['Valorant', 'Minecraft', 'Among Us'],
    },
    message: "Mon pote te trouve trop stylé(e) ! Vous avez les mêmes jeux !",
    isNew: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
  },
  {
    id: '3',
    cupidonPseudo: 'MaxGamer',
    cupidonId: 'c2',
    isAnonymous: false,
    profil: {
      id: 'p3',
      pseudo: 'PixelQueen',
      age: 27,
      ville: 'Bordeaux',
      bio: 'Fan de jeux indés et de pixel art.',
      jeux: ['Stardew Valley', 'Hollow Knight'],
    },
    message: "Je sens le match !",
    isNew: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
]

type Coeur = typeof mockCoeursRecus[0]

export default function CoeursRecus() {
  const router = useRouter()
  const [coeurs, setCoeurs] = useState(mockCoeursRecus)
  const [selectedCoeur, setSelectedCoeur] = useState<Coeur | null>(null)
  const [showConfirmation, setShowConfirmation] = useState<'accept' | 'refuse' | null>(null)

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `Il y a ${days}j`
    if (hours > 0) return `Il y a ${hours}h`
    return `Il y a ${minutes}min`
  }

  const handleAccept = (coeur: Coeur) => {
    // En prod: mettre à jour en base et créer le match
    setCoeurs(coeurs.map(c =>
      c.id === coeur.id ? { ...c, isNew: false } : c
    ))
    setShowConfirmation('accept')
    setSelectedCoeur(coeur)
  }

  const handleRefuse = (coeur: Coeur) => {
    // En prod: mettre à jour en base
    setCoeurs(coeurs.filter(c => c.id !== coeur.id))
    setShowConfirmation('refuse')
    setSelectedCoeur(coeur)
  }

  const newCount = coeurs.filter(c => c.isNew).length

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <div className="bg-pattern" />

      {/* Header */}
      <header className="px-4 py-4 border-b-2 border-[#FF00FF]/30">
        <div className="h-1 absolute top-0 left-0 right-0 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/attrape-coeurs"
            className="inline-flex items-center gap-2 text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
          >
            ← Retour
          </Link>
          <div className="text-2xl">💌</div>
        </div>
      </header>

      {/* Titre */}
      <div className="text-center py-6 px-4">
        <h1 className="text-3xl font-bold text-[#FF00FF] mb-2" style={{ textShadow: '0 0 20px #FF00FF' }}>
          Mes coeurs reçus
        </h1>
        <p className="text-[#00FFFF] font-bold">
          {newCount > 0 ? `${newCount} nouveau${newCount > 1 ? 'x' : ''} !` : 'Tous vus'}
        </p>
      </div>

      {/* Liste des coeurs */}
      <main className="flex-1 px-4">
        <div className="max-w-md mx-auto space-y-4">
          {coeurs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💌</div>
              <p className="text-white/60 mb-4">Aucun coeur reçu pour l'instant</p>
              <p className="text-sm text-white/40">
                Demande à tes amis de jouer les Cupidons pour toi !
              </p>
            </div>
          ) : (
            coeurs.map((coeur) => (
              <div
                key={coeur.id}
                className={`card-90s overflow-hidden ${coeur.isNew ? 'pink' : ''}`}
              >
                {/* En-tête avec info Cupidon */}
                <div className="px-4 py-3 bg-[#330066] border-b-2 border-[#FF00FF]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏹</span>
                    <span className="text-sm text-white/60">
                      Envoyé par{' '}
                      <strong className={coeur.isAnonymous ? 'text-white/40' : 'text-[#FF00FF]'}>
                        {coeur.cupidonPseudo}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {coeur.isNew && (
                      <span className="px-2 py-0.5 bg-[#39FF14] text-black text-xs font-bold animate-pulse">
                        NEW
                      </span>
                    )}
                    <span className="text-xs text-white/40">{formatTime(coeur.createdAt)}</span>
                  </div>
                </div>

                {/* Profil suggéré */}
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-3xl font-bold flex-shrink-0">
                      {coeur.profil.pseudo[0]}
                    </div>

                    {/* Infos */}
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{coeur.profil.pseudo}</h3>
                      <p className="text-sm text-[#00FFFF] mb-2">
                        {coeur.profil.age} ans • {coeur.profil.ville}
                      </p>
                      <p className="text-sm text-white/70 line-clamp-2">{coeur.profil.bio}</p>
                    </div>
                  </div>

                  {/* Message du Cupidon */}
                  {coeur.message && (
                    <div className="mt-4 p-3 bg-[#1A0033] border-l-4 border-[#FF00FF]">
                      <p className="text-sm text-white/60 mb-1">
                        {coeur.isAnonymous ? 'Message anonyme :' : `${coeur.cupidonPseudo} dit :`}
                      </p>
                      <p className="text-white italic">"{coeur.message}"</p>
                    </div>
                  )}

                  {/* Jeux */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {coeur.profil.jeux.map((jeu, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-[#330066] border border-[#FF00FF]/50 text-xs text-[#FF00FF]"
                      >
                        🎮 {jeu}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAccept(coeur)}
                      className="flex-1 py-3 bg-[#39FF14] border-2 border-[#39FF14] text-black font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      💚 Voir son profil
                    </button>
                    <button
                      onClick={() => handleRefuse(coeur)}
                      className="flex-1 py-3 bg-transparent border-2 border-white/30 text-white/60 font-bold hover:border-[#FF3131] hover:text-[#FF3131] transition"
                    >
                      Pas maintenant
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal de confirmation */}
      {showConfirmation && selectedCoeur && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="card-90s p-6 max-w-sm w-full text-center">
            {showConfirmation === 'accept' ? (
              <>
                <div className="text-6xl mb-4 animate-bounce">💕</div>
                <h2 className="text-2xl font-bold text-[#39FF14] mb-4" style={{ textShadow: '0 0 10px #39FF14' }}>
                  Super !
                </h2>
                <p className="text-white/80 mb-6">
                  Tu vas pouvoir découvrir le profil de{' '}
                  <strong className="text-[#00FFFF]">{selectedCoeur.profil.pseudo}</strong>
                </p>
                <button
                  onClick={() => {
                    setShowConfirmation(null)
                    // En prod: rediriger vers le profil complet
                    router.push(`/profil/${selectedCoeur.profil.id}`)
                  }}
                  className="w-full py-3 bg-[#39FF14] border-2 border-[#39FF14] text-black font-bold hover:opacity-90 transition"
                >
                  Voir le profil complet
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Pas de souci !
                </h2>
                <p className="text-white/60 mb-6">
                  Ce coeur a été archivé. Tu peux changer d'avis plus tard.
                </p>
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="w-full py-3 bg-[#FF00FF] border-2 border-[#FF00FF] text-white font-bold hover:opacity-90 transition"
                >
                  Continuer
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
