'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '../contexts/UserContext'

// Types de billes
interface Bille {
  id: string
  type: string
  name: string
  emoji: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  description: string
  obtainedFrom?: string
  obtainedAt?: string
}

// Catalogue des billes possibles
const billesCatalogue: Omit<Bille, 'id' | 'obtainedFrom' | 'obtainedAt'>[] = [
  { type: 'cristal', name: 'Cristal', emoji: '⚪', color: '#00FFFF', rarity: 'common', description: 'La bille de base, transparente comme ton coeur' },
  { type: 'ruby', name: 'Rubis', emoji: '🔴', color: '#FF3131', rarity: 'rare', description: 'Rouge passion, pour les coeurs enflammés' },
  { type: 'emerald', name: 'Émeraude', emoji: '🟢', color: '#39FF14', rarity: 'rare', description: 'Verte comme l\'espoir d\'un match parfait' },
  { type: 'sapphire', name: 'Saphir', emoji: '🔵', color: '#0066FF', rarity: 'rare', description: 'Bleue comme la fidélité' },
  { type: 'gold', name: 'Or', emoji: '🟡', color: '#FFD700', rarity: 'epic', description: 'Précieuse comme une vraie connexion' },
  { type: 'rainbow', name: 'Arc-en-ciel', emoji: '🟣', color: 'linear-gradient(90deg, #FF00FF, #00FFFF, #39FF14, #FFFF00)', rarity: 'epic', description: 'Toutes les couleurs de l\'amour' },
  { type: 'galaxy', name: 'Galaxie', emoji: '🟤', color: '#663399', rarity: 'legendary', description: 'Aussi infinie que les possibilités' },
  { type: 'heart', name: 'Coeur', emoji: '💗', color: '#FF69B4', rarity: 'legendary', description: 'La plus rare, symbole d\'une connexion unique' },
]

// Billes de l'utilisateur (mock - sera remplacé par Supabase)
const mockUserBilles: Bille[] = [
  { id: '1', type: 'cristal', name: 'Cristal', emoji: '⚪', color: '#00FFFF', rarity: 'common', description: 'La bille de base', obtainedFrom: 'Jeu de l\'Oie', obtainedAt: '2024-01-15' },
  { id: '2', type: 'cristal', name: 'Cristal', emoji: '⚪', color: '#00FFFF', rarity: 'common', description: 'La bille de base', obtainedFrom: 'Le Manège', obtainedAt: '2024-01-16' },
  { id: '3', type: 'emerald', name: 'Émeraude', emoji: '🟢', color: '#39FF14', rarity: 'rare', description: 'Verte comme l\'espoir', obtainedFrom: 'Action ou Vérité', obtainedAt: '2024-01-17' },
]

const rarityConfig = {
  common: { label: 'Commune', color: '#AAAAAA', glow: 'rgba(170, 170, 170, 0.3)' },
  rare: { label: 'Rare', color: '#00FFFF', glow: 'rgba(0, 255, 255, 0.3)' },
  epic: { label: 'Épique', color: '#FF00FF', glow: 'rgba(255, 0, 255, 0.3)' },
  legendary: { label: 'Légendaire', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)' },
}

export default function CollectionPage() {
  const { user: userData } = useUser()
  const [selectedBille, setSelectedBille] = useState<Bille | null>(null)
  const [activeTab, setActiveTab] = useState<'collection' | 'catalogue'>('collection')

  // Compter les billes par type
  const billeCount = mockUserBilles.reduce((acc, bille) => {
    acc[bille.type] = (acc[bille.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen pb-20">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#0D001A]/98 backdrop-blur-sm px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="text-white/60 hover:text-white transition flex items-center gap-2">
              <span>←</span>
              <span>Retour</span>
            </Link>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Bangers, cursive', color: '#00FFFF', textShadow: '0 0 15px #00FFFF' }}>
              🔵 Ma Collection
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0, 255, 255, 0.15)', border: '2px solid rgba(0, 255, 255, 0.4)' }}>
              <span className="text-lg">🔵</span>
              <span className="text-[#00FFFF] font-bold">{userData.billes}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="flex gap-2 p-1 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
          <button
            onClick={() => setActiveTab('collection')}
            className="flex-1 py-3 px-4 rounded-lg font-bold transition"
            style={{
              background: activeTab === 'collection' ? 'rgba(0, 255, 255, 0.2)' : 'transparent',
              color: activeTab === 'collection' ? '#00FFFF' : 'rgba(255, 255, 255, 0.5)',
              border: activeTab === 'collection' ? '2px solid rgba(0, 255, 255, 0.5)' : '2px solid transparent',
            }}
          >
            Mes Billes ({mockUserBilles.length})
          </button>
          <button
            onClick={() => setActiveTab('catalogue')}
            className="flex-1 py-3 px-4 rounded-lg font-bold transition"
            style={{
              background: activeTab === 'catalogue' ? 'rgba(255, 0, 255, 0.2)' : 'transparent',
              color: activeTab === 'catalogue' ? '#FF00FF' : 'rgba(255, 255, 255, 0.5)',
              border: activeTab === 'catalogue' ? '2px solid rgba(255, 0, 255, 0.5)' : '2px solid transparent',
            }}
          >
            Catalogue
          </button>
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', marginTop: '2rem' }}>

        {activeTab === 'collection' && (
          <>
            {/* Stats rapides */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {Object.entries(rarityConfig).map(([rarity, config]) => {
                const count = mockUserBilles.filter(b => b.rarity === rarity).length
                return (
                  <div key={rarity} className="text-center p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${config.color}30` }}>
                    <div className="text-2xl font-bold" style={{ color: config.color }}>{count}</div>
                    <div className="text-xs text-white/50">{config.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Liste des billes */}
            {mockUserBilles.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔵</div>
                <h3 className="text-xl font-bold text-white/60 mb-2">Pas encore de billes</h3>
                <p className="text-white/40 mb-6">Joue pour gagner des billes !</p>
                <Link
                  href="/games"
                  className="inline-block px-6 py-3 rounded-lg font-bold"
                  style={{ background: '#FF00FF', color: 'white' }}
                >
                  Jouer maintenant
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {mockUserBilles.map((bille) => {
                  const rarityInfo = rarityConfig[bille.rarity]
                  return (
                    <button
                      key={bille.id}
                      onClick={() => setSelectedBille(bille)}
                      className="p-4 rounded-xl text-center transition hover:scale-105"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `2px solid ${rarityInfo.color}40`,
                        boxShadow: `0 0 20px ${rarityInfo.glow}`,
                      }}
                    >
                      <div className="text-4xl mb-2" style={{ filter: `drop-shadow(0 0 10px ${bille.color})` }}>
                        {bille.emoji}
                      </div>
                      <div className="text-sm font-bold text-white">{bille.name}</div>
                      <div className="text-xs mt-1" style={{ color: rarityInfo.color }}>{rarityInfo.label}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'catalogue' && (
          <>
            <p className="text-white/50 text-sm mb-6 text-center">
              Découvre toutes les billes que tu peux collectionner !
            </p>
            <div className="grid grid-cols-2 gap-4">
              {billesCatalogue.map((bille) => {
                const rarityInfo = rarityConfig[bille.rarity]
                const owned = billeCount[bille.type] || 0
                return (
                  <div
                    key={bille.type}
                    className="p-4 rounded-xl transition"
                    style={{
                      background: owned > 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                      border: `2px solid ${owned > 0 ? rarityInfo.color : 'rgba(255, 255, 255, 0.1)'}`,
                      opacity: owned > 0 ? 1 : 0.5,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="text-4xl"
                        style={{
                          filter: owned > 0 ? `drop-shadow(0 0 10px ${bille.color})` : 'grayscale(100%)',
                        }}
                      >
                        {bille.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{bille.name}</span>
                          {owned > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: rarityInfo.color, color: '#0D001A' }}>
                              x{owned}
                            </span>
                          )}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: rarityInfo.color }}>{rarityInfo.label}</div>
                        <p className="text-xs text-white/40 mt-2">{bille.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>

      {/* Modal détail bille */}
      {selectedBille && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setSelectedBille(null)}
        >
          <div
            className="w-full max-w-sm p-6 rounded-2xl"
            style={{
              background: '#1A0033',
              border: `3px solid ${rarityConfig[selectedBille.rarity].color}`,
              boxShadow: `0 0 40px ${rarityConfig[selectedBille.rarity].glow}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div
                className="text-7xl mb-4"
                style={{ filter: `drop-shadow(0 0 20px ${selectedBille.color})` }}
              >
                {selectedBille.emoji}
              </div>
              <h3
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: 'Bangers, cursive', color: rarityConfig[selectedBille.rarity].color }}
              >
                {selectedBille.name}
              </h3>
              <div
                className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-4"
                style={{ background: `${rarityConfig[selectedBille.rarity].color}20`, color: rarityConfig[selectedBille.rarity].color }}
              >
                {rarityConfig[selectedBille.rarity].label}
              </div>
              <p className="text-white/60 mb-6">{selectedBille.description}</p>

              {selectedBille.obtainedFrom && (
                <div className="text-left p-3 rounded-lg mb-4" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <div className="text-xs text-white/40 mb-1">Obtenue via</div>
                  <div className="text-white font-bold">{selectedBille.obtainedFrom}</div>
                  {selectedBille.obtainedAt && (
                    <div className="text-xs text-white/40 mt-1">{selectedBille.obtainedAt}</div>
                  )}
                </div>
              )}

              <button
                onClick={() => setSelectedBille(null)}
                className="w-full py-3 rounded-lg font-bold"
                style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
