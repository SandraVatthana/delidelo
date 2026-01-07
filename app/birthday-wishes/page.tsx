'use client'

import { useState } from 'react'
import Link from 'next/link'

// Mock data pour les vœux reçus
const mockWishes = [
  {
    id: '1',
    sender: { pseudo: 'Marie', avatar: '👩' },
    type: 'bonbon',
    bonbonType: 'Malabar',
    message: 'Joyeux anniv ma belle ! 🎉',
    hasCard: true,
    createdAt: '10:32',
  },
  {
    id: '2',
    sender: { pseudo: 'Lucas', avatar: '😎' },
    type: 'bille',
    billeType: 'Galaxie',
    message: 'Bon anniv ! On se fait un jeu pour fêter ça ?',
    hasInvite: true,
    createdAt: '09:15',
  },
  {
    id: '3',
    sender: { pseudo: 'Sophie', avatar: '🧑‍🦰' },
    type: 'simple',
    createdAt: '08:45',
  },
  {
    id: '4',
    sender: { pseudo: 'Antoine', avatar: '🧔' },
    type: 'simple',
    createdAt: '08:20',
  },
  {
    id: '5',
    sender: { pseudo: 'Mamie', avatar: '👵' },
    type: 'bonbon',
    bonbonType: 'Chocolat',
    message: 'Bon anniversaire mon petit cœur',
    hasCard: true,
    createdAt: '07:00',
  },
  {
    id: '6',
    sender: { pseudo: 'Emma', avatar: '👩‍🦳' },
    type: 'bille',
    billeType: 'Arc-en-ciel',
    message: 'Happy birthday !!',
    createdAt: '06:30',
  },
  {
    id: '7',
    sender: { pseudo: 'Thomas', avatar: '🧑' },
    type: 'simple',
    createdAt: '00:01',
  },
]

export default function BirthdayWishesPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const getWishIcon = (type: string) => {
    switch (type) {
      case 'bonbon': return '🍬'
      case 'bille': return '🔵'
      default: return '🎉'
    }
  }

  const getWishColor = (type: string) => {
    switch (type) {
      case 'bonbon': return '#FF00FF'
      case 'bille': return '#00FFFF'
      default: return '#39FF14'
    }
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg, #1A0033 0%, #2D0A4E 50%, #1A0033 100%)' }}>
      <style jsx>{`
        .wish-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.3s;
        }

        .wish-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 107, 171, 0.3);
        }

        .wish-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .wish-avatar {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }

        .wish-info {
          flex: 1;
        }

        .wish-sender {
          font-weight: 700;
          color: #fff;
          font-size: 1rem;
        }

        .wish-type {
          font-size: 0.85rem;
          margin-top: 2px;
        }

        .wish-message {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 12px 16px;
          margin-top: 12px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.8);
        }

        .wish-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 2px solid;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 12px;
          text-decoration: none;
        }

        .wish-action.card {
          color: #FF00FF;
          border-color: #FF00FF;
        }

        .wish-action.card:hover {
          background: #FF00FF;
          color: #1A0033;
        }

        .wish-action.invite {
          color: #00FFFF;
          border-color: #00FFFF;
        }

        .wish-action.invite:hover {
          background: #00FFFF;
          color: #1A0033;
        }

        .wish-time {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
        }

        .stats-summary {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 32px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 16px 24px;
          text-align: center;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .stat-number {
          font-family: 'Bangers', cursive;
          font-size: 2rem;
          color: #FFFF00;
          text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          margin-top: 4px;
        }

        /* Card Modal */
        .card-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .card-modal {
          background: linear-gradient(135deg, #FFD700 0%, #FF69B4 50%, #00CED1 100%);
          border-radius: 20px;
          padding: 4px;
          max-width: 350px;
          width: 100%;
        }

        .card-modal-inner {
          background: linear-gradient(180deg, #2D0A4E 0%, #1A0033 100%);
          border-radius: 18px;
          padding: 32px;
          text-align: center;
        }

        .card-emoji {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .card-from {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .card-message {
          font-size: 1.2rem;
          color: #fff;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .card-gift {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
        }

        .card-gift-type {
          color: #FF00FF;
          font-weight: 700;
        }

        .card-close {
          padding: 12px 32px;
          background: linear-gradient(135deg, #FF00FF, #FF3399);
          color: #fff;
          border: none;
          border-radius: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .card-close:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#FFD700] to-[#FF00FF]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href="/dashboard" className="text-white/60 hover:text-white transition flex items-center gap-2">
              <span>←</span>
              <span>Retour</span>
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: 'Bangers, cursive', color: '#FF6BAB', textShadow: '0 0 15px rgba(255, 107, 171, 0.5)' }}>
              <span className="text-2xl">🎂</span>
              Mes vœux
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Titre */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 0 15px rgba(255, 107, 171, 0.5)' }}>
            Tes vœux d'anniversaire
          </h2>
          <p className="text-white/60">
            {mockWishes.length} personnes t'ont souhaité ton anniversaire
          </p>
        </div>

        {/* Stats */}
        <div className="stats-summary">
          <div className="stat-item">
            <div className="stat-number">🍬 {mockWishes.filter(w => w.type === 'bonbon').length}</div>
            <div className="stat-label">Bonbons reçus</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">🔵 {mockWishes.filter(w => w.type === 'bille').length}</div>
            <div className="stat-label">Billes reçues</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">🎉 {mockWishes.filter(w => w.type === 'simple').length}</div>
            <div className="stat-label">Vœux simples</div>
          </div>
        </div>

        {/* Liste des vœux */}
        <div>
          {mockWishes.map(wish => (
            <div key={wish.id} className="wish-card">
              <div className="wish-header">
                <div className="wish-avatar">{wish.sender.avatar}</div>
                <div className="wish-info">
                  <div className="wish-sender">{wish.sender.pseudo}</div>
                  <div className="wish-type" style={{ color: getWishColor(wish.type) }}>
                    {getWishIcon(wish.type)} {wish.type === 'bonbon' ? `t'a envoyé un ${wish.bonbonType}` : wish.type === 'bille' ? `t'a envoyé une bille ${wish.billeType || ''}` : 't\'a souhaité ton anniversaire'}
                  </div>
                </div>
                <span className="wish-time">{wish.createdAt}</span>
              </div>

              {wish.message && (
                <div className="wish-message">
                  "{wish.message}"
                </div>
              )}

              {wish.hasCard && (
                <button
                  className="wish-action card"
                  onClick={() => setSelectedCard(wish.id)}
                >
                  <span>💌</span> Voir la carte
                </button>
              )}

              {wish.hasInvite && (
                <Link href="/games" className="wish-action invite">
                  <span>🎮</span> Accepter l'invitation
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Lien retour */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 rounded-xl font-bold"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Retour à l'accueil
          </Link>
        </div>
      </main>

      {/* Modal Carte */}
      {selectedCard && (
        <div className="card-modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="card-modal" onClick={e => e.stopPropagation()}>
            <div className="card-modal-inner">
              <div className="card-emoji">🎂🎈🎉</div>
              <p className="card-from">De la part de {mockWishes.find(w => w.id === selectedCard)?.sender.pseudo}</p>
              <p className="card-message">
                "{mockWishes.find(w => w.id === selectedCard)?.message || 'Joyeux anniversaire !'}"
              </p>
              <div className="card-gift">
                <span className="card-gift-type">
                  🍬 {mockWishes.find(w => w.id === selectedCard)?.bonbonType}
                </span>
              </div>
              <button className="card-close" onClick={() => setSelectedCard(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
