'use client'

import { useState } from 'react'
import { useUser } from '../contexts/UserContext'

interface SendGiftModalProps {
  isOpen: boolean
  onClose: () => void
  recipientName: string
  recipientId: string
}

// Types de billes disponibles
const billeTypes = [
  { id: 'cristal', name: 'Cristal', emoji: '⚪', color: '#00FFFF', cost: 1 },
  { id: 'ruby', name: 'Rubis', emoji: '🔴', color: '#FF3131', cost: 2 },
  { id: 'emerald', name: 'Émeraude', emoji: '🟢', color: '#39FF14', cost: 2 },
  { id: 'sapphire', name: 'Saphir', emoji: '🔵', color: '#0066FF', cost: 2 },
  { id: 'gold', name: 'Or', emoji: '🟡', color: '#FFD700', cost: 5 },
]

// Types de bonbons disponibles
const bonbonTypes = [
  { id: 'malabar', name: 'Malabar', emoji: '🍬', meaning: 'Je pense à toi', color: '#FF69B4' },
  { id: 'carambar', name: 'Carambar', emoji: '🟫', meaning: 'Tiens, une blague nulle', color: '#8B4513' },
  { id: 'sucette', name: 'Sucette', emoji: '🍭', meaning: 'Un petit sucre dans ta journée', color: '#FF6B6B' },
  { id: 'reglisse', name: 'Réglisse', emoji: '➰', meaning: "T'es long à répondre toi", color: '#1a1a1a' },
  { id: 'tetes-brulees', name: 'Têtes brûlées', emoji: '💥', meaning: "T'es fou/folle et j'adore", color: '#FFD700' },
  { id: 'kinder', name: 'Kinder', emoji: '🥚', meaning: "T'es plein(e) de surprises", color: '#FFA500' },
  { id: 'chocolat', name: 'Chocolat', emoji: '🍫', meaning: 'Réconfort', color: '#5D3A1A' },
]

export default function SendGiftModal({ isOpen, onClose, recipientName, recipientId }: SendGiftModalProps) {
  const { user, setUser } = useUser()
  const [activeTab, setActiveTab] = useState<'billes' | 'bonbons'>('billes')
  const [selectedBille, setSelectedBille] = useState<string | null>(null)
  const [selectedBonbon, setSelectedBonbon] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  if (!isOpen) return null

  const handleSendGift = async () => {
    if (activeTab === 'billes' && !selectedBille) return
    if (activeTab === 'bonbons' && !selectedBonbon) return

    // Vérifier le solde
    if (activeTab === 'billes') {
      const billeCost = billeTypes.find(b => b.id === selectedBille)?.cost || 1
      if (user.billes < billeCost) {
        alert('Pas assez de billes !')
        return
      }
    } else {
      if (user.bonbons < 1) {
        alert('Pas assez de bonbons !')
        return
      }
    }

    setSending(true)

    // Simuler l'envoi (sera remplacé par Supabase)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mettre à jour le solde
    if (activeTab === 'billes') {
      const billeCost = billeTypes.find(b => b.id === selectedBille)?.cost || 1
      setUser({ ...user, billes: user.billes - billeCost })
    } else {
      setUser({ ...user, bonbons: user.bonbons - 1 })
    }

    setSending(false)
    setSent(true)

    // Fermer après un délai
    setTimeout(() => {
      setSent(false)
      setSelectedBille(null)
      setSelectedBonbon(null)
      setMessage('')
      onClose()
    }, 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#1A0033', border: '3px solid #FF00FF', boxShadow: '0 0 40px rgba(255, 0, 255, 0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)' }}>
          <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Bangers, cursive', textShadow: '2px 2px 0 #000' }}>
            🎁 Envoyer un cadeau
          </h3>
          <p className="text-white/90 text-sm mt-1">
            à <span className="font-bold">{recipientName}</span>
          </p>
        </div>

        {/* Sent confirmation */}
        {sent ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <p className="text-2xl font-bold text-[#39FF14] mb-2" style={{ textShadow: '0 0 15px #39FF14' }}>
              Cadeau envoyé !
            </p>
            <p className="text-white/70">
              {recipientName} va recevoir une notification
            </p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('billes')}
                className="flex-1 py-4 font-bold transition"
                style={{
                  background: activeTab === 'billes' ? 'rgba(0, 255, 255, 0.15)' : 'transparent',
                  color: activeTab === 'billes' ? '#00FFFF' : 'rgba(255, 255, 255, 0.5)',
                  borderBottom: activeTab === 'billes' ? '3px solid #00FFFF' : '3px solid transparent',
                }}
              >
                🔵 Billes ({user.billes})
              </button>
              <button
                onClick={() => setActiveTab('bonbons')}
                className="flex-1 py-4 font-bold transition"
                style={{
                  background: activeTab === 'bonbons' ? 'rgba(255, 0, 255, 0.15)' : 'transparent',
                  color: activeTab === 'bonbons' ? '#FF00FF' : 'rgba(255, 255, 255, 0.5)',
                  borderBottom: activeTab === 'bonbons' ? '3px solid #FF00FF' : '3px solid transparent',
                }}
              >
                🍬 Bonbons ({user.bonbons})
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              {activeTab === 'billes' ? (
                <div className="grid grid-cols-3 gap-3">
                  {billeTypes.map(bille => (
                    <button
                      key={bille.id}
                      onClick={() => setSelectedBille(bille.id)}
                      className="p-4 rounded-xl text-center transition hover:scale-105"
                      style={{
                        background: selectedBille === bille.id ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: selectedBille === bille.id ? `3px solid ${bille.color}` : '3px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: selectedBille === bille.id ? `0 0 20px ${bille.color}50` : 'none',
                      }}
                    >
                      <div className="text-3xl mb-2" style={{ filter: `drop-shadow(0 0 8px ${bille.color})` }}>
                        {bille.emoji}
                      </div>
                      <div className="text-xs text-white font-bold">{bille.name}</div>
                      <div className="text-xs text-white/50 mt-1">Coût: {bille.cost}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {bonbonTypes.map(bonbon => (
                    <button
                      key={bonbon.id}
                      onClick={() => setSelectedBonbon(bonbon.id)}
                      className="w-full p-4 rounded-xl flex items-center gap-4 transition"
                      style={{
                        background: selectedBonbon === bonbon.id ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: selectedBonbon === bonbon.id ? '3px solid #FF00FF' : '3px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <span className="text-3xl">{bonbon.emoji}</span>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-white">{bonbon.name}</div>
                        <div className="text-xs text-white/60 italic">"{bonbon.meaning}"</div>
                      </div>
                      {selectedBonbon === bonbon.id && (
                        <span className="text-[#FF00FF] text-xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Message optionnel */}
              <div className="mt-4">
                <label className="text-white/60 text-sm mb-2 block">Message (optionnel)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ajoute un petit mot..."
                  maxLength={100}
                  className="w-full p-3 rounded-xl text-white placeholder-white/30 resize-none"
                  style={{ background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(255, 255, 255, 0.1)' }}
                  rows={2}
                />
                <div className="text-right text-xs text-white/40 mt-1">{message.length}/100</div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <button
                onClick={handleSendGift}
                disabled={sending || (activeTab === 'billes' && !selectedBille) || (activeTab === 'bonbons' && !selectedBonbon)}
                className="w-full py-4 rounded-xl font-bold text-lg transition"
                style={{
                  background: (activeTab === 'billes' && selectedBille) || (activeTab === 'bonbons' && selectedBonbon)
                    ? 'linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: (activeTab === 'billes' && selectedBille) || (activeTab === 'bonbons' && selectedBonbon)
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.3)',
                  cursor: (activeTab === 'billes' && selectedBille) || (activeTab === 'bonbons' && selectedBonbon)
                    ? 'pointer'
                    : 'not-allowed',
                }}
              >
                {sending ? '⏳ Envoi en cours...' : '🎁 Envoyer le cadeau'}
              </button>
              <button
                onClick={onClose}
                className="w-full mt-2 py-3 text-white/50 hover:text-white transition"
              >
                Annuler
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
