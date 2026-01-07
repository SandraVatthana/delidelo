'use client'

import Link from 'next/link'
import { useUser } from '../contexts/UserContext'

const bonbonTypes = [
  { id: 'malabar', name: 'Malabar', emoji: '🍬', meaning: 'Je pense à toi', color: '#FF69B4' },
  { id: 'carambar', name: 'Carambar', emoji: '🟫', meaning: 'Tiens, une blague nulle', color: '#8B4513' },
  { id: 'sucette', name: 'Sucette', emoji: '🍭', meaning: 'Un petit sucre dans ta journée', color: '#FF6B6B' },
  { id: 'reglisse', name: 'Réglisse', emoji: '➰', meaning: "T'es long à répondre toi", color: '#1a1a1a' },
  { id: 'tetes-brulees', name: 'Têtes brûlées', emoji: '💥', meaning: "T'es fou/folle et j'adore", color: '#FFD700' },
  { id: 'kinder', name: 'Kinder', emoji: '🥚', meaning: "T'es plein(e) de surprises", color: '#FFA500' },
  { id: 'chocolat', name: 'Chocolat', emoji: '🍫', meaning: 'Réconfort', color: '#5D3A1A' },
]

export default function BoutiquePage() {
  const { user: userData } = useUser()
  const bonbons = userData.bonbons || 10

  return (
    <div className="boutique-page">
      <style jsx>{`
        .boutique-page {
          --neon-pink: #FF00FF;
          --neon-green: #39FF14;
          --neon-blue: #00FFFF;
          --neon-yellow: #FFFF00;
          --purple-dark: #1A0033;
          --purple-mid: #330066;

          font-family: 'Comic Neue', system-ui, sans-serif;
          background: var(--purple-dark);
          color: #fff;
          min-height: 100vh;
          padding-bottom: 50px;
        }

        .header {
          background: linear-gradient(90deg, var(--neon-pink), var(--neon-blue), var(--neon-green));
          padding: 3px;
        }

        .header-inner {
          background: var(--purple-dark);
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-btn {
          color: var(--neon-blue);
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .back-btn:hover {
          color: var(--neon-yellow);
          text-shadow: 0 0 10px var(--neon-yellow);
        }

        .balance {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 2px solid var(--neon-pink);
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
          font-weight: 700;
          font-size: 1.1rem;
        }

        .content {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .title {
          font-family: 'Bangers', cursive;
          font-size: 3rem;
          color: var(--neon-pink);
          text-shadow: 0 0 20px var(--neon-pink), 3px 3px 0 var(--neon-blue);
          text-align: center;
          margin-bottom: 10px;
          letter-spacing: 3px;
        }

        .subtitle {
          text-align: center;
          color: var(--neon-blue);
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 40px;
          text-shadow: 0 0 10px var(--neon-blue);
        }

        .section-title {
          font-family: 'Bangers', cursive;
          font-size: 1.8rem;
          color: var(--neon-yellow);
          text-shadow: 0 0 15px var(--neon-yellow);
          margin-bottom: 20px;
          letter-spacing: 2px;
        }

        .bonbon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 50px;
        }

        .bonbon-card {
          background: rgba(255, 255, 255, 0.03);
          border: 3px solid var(--neon-pink);
          padding: 25px;
          text-align: center;
          transition: all 0.3s;
        }

        .bonbon-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 30px var(--neon-pink);
        }

        .bonbon-emoji {
          font-size: 4rem;
          margin-bottom: 15px;
        }

        .bonbon-name {
          font-family: 'Bangers', cursive;
          font-size: 1.5rem;
          color: var(--neon-pink);
          text-shadow: 0 0 10px var(--neon-pink);
          margin-bottom: 8px;
          letter-spacing: 2px;
        }

        .bonbon-meaning {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          font-style: italic;
          font-weight: 700;
        }

        .recharge-section {
          background: var(--purple-mid);
          border: 3px solid var(--neon-yellow);
          padding: 40px;
          text-align: center;
          box-shadow: 0 0 30px rgba(255, 255, 0, 0.2);
        }

        .recharge-title {
          font-family: 'Bangers', cursive;
          font-size: 2rem;
          color: var(--neon-yellow);
          text-shadow: 0 0 15px var(--neon-yellow);
          margin-bottom: 20px;
          letter-spacing: 2px;
        }

        .recharge-price {
          font-family: 'Bangers', cursive;
          font-size: 4rem;
          color: #fff;
          margin-bottom: 10px;
        }

        .recharge-desc {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
          margin-bottom: 25px;
        }

        .recharge-btn {
          display: inline-block;
          background: var(--neon-yellow);
          color: var(--purple-dark);
          padding: 15px 40px;
          font-family: 'Bangers', cursive;
          font-size: 1.3rem;
          letter-spacing: 2px;
          text-decoration: none;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          box-shadow: 0 0 20px var(--neon-yellow);
          transition: all 0.3s;
        }

        .recharge-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px var(--neon-yellow);
        }

        .note {
          text-align: center;
          margin-top: 20px;
          color: var(--neon-green);
          font-weight: 700;
          font-size: 0.9rem;
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <Link href="/dashboard" className="back-btn">
            ← Retour
          </Link>
          <div className="balance">
            <span>🍬</span>
            <span>{bonbons} bonbons</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="content">
        <h1 className="title">🍬 La Boutique aux Bonbons</h1>
        <p className="subtitle">Envoie des bonbons pour montrer ton affection !</p>

        <h2 className="section-title">Types de bonbons</h2>
        <div className="bonbon-grid">
          {bonbonTypes.map(bonbon => (
            <div key={bonbon.id} className="bonbon-card">
              <div className="bonbon-emoji">{bonbon.emoji}</div>
              <div className="bonbon-name">{bonbon.name}</div>
              <div className="bonbon-meaning">"{bonbon.meaning}"</div>
            </div>
          ))}
        </div>

        <div className="recharge-section">
          <h2 className="recharge-title">⚡ Recharger mes bonbons</h2>
          <div className="recharge-price">2€</div>
          <p className="recharge-desc">+10 bonbons pour envoyer de l'amour</p>
          <button className="recharge-btn">
            🍬 Acheter des bonbons
          </button>
          <p className="note">Pas d'abonnement. Tu recharges que si tu veux.</p>
        </div>
      </div>
    </div>
  )
}
