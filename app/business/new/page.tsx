'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function NewBusinessSessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const kitType = searchParams.get('kit') || 'standard'

  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    maxParticipants: 8,
    organizerName: '',
    organizerEmail: '',
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    // Générer un code unique pour la session
    const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Sauvegarder en localStorage pour la démo
    const sessionData = {
      ...formData,
      kitType,
      sessionCode,
      createdAt: new Date().toISOString(),
      status: 'open',
      participants: [{
        name: formData.organizerName,
        email: formData.organizerEmail,
        isOrganizer: true,
        profileCompleted: false,
      }],
    }
    localStorage.setItem(`recre_session_${sessionCode}`, JSON.stringify(sessionData))

    // Rediriger vers la page de confirmation
    setTimeout(() => {
      router.push(`/business/success?code=${sessionCode}`)
    }, 1000)
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .input-business {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .input-business:focus {
          outline: none;
          border-color: #FF00FF;
          box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
        }
        .input-business::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .participant-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .participant-btn.selected {
          border-color: #FF00FF;
          background: rgba(255, 0, 255, 0.2);
          color: #FF00FF;
        }
        .participant-btn:hover {
          border-color: #FF00FF;
        }
        .btn-create {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-create:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
        }
        .btn-create:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/business" className="flex items-center gap-2 text-white/60 hover:text-white transition">
            <span>←</span>
            <span className="text-sm">Retour</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-white/60 text-sm">
              Kit {kitType === 'surprise' ? '+ Surprise' : 'Standard'}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-12">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🎯</div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                fontFamily: 'Bangers, cursive',
                color: '#FF00FF',
                textShadow: '0 0 20px rgba(255, 0, 255, 0.5)'
              }}
            >
              CONFIGURE TA RÉCRÉ BUSINESS
            </h1>
            <p className="text-white/60">
              Plus que quelques infos et c'est parti !
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom de l'événement */}
            <div>
              <label className="block text-white/80 font-bold mb-2 text-sm">
                Nom de l'événement
              </label>
              <input
                type="text"
                className="input-business"
                placeholder="Ex: Dîner des Entrepreneurs du Sud-Ouest"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-white/80 font-bold mb-2 text-sm">
                Date prévue
              </label>
              <input
                type="date"
                className="input-business"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Lieu */}
            <div>
              <label className="block text-white/80 font-bold mb-2 text-sm">
                Lieu <span className="text-white/40">(optionnel)</span>
              </label>
              <input
                type="text"
                className="input-business"
                placeholder="Ex: Restaurant Le Comptoir, Biarritz"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Nombre de participants */}
            <div>
              <label className="block text-white/80 font-bold mb-3 text-sm">
                Nombre de participants max
              </label>
              <div className="flex gap-3 flex-wrap">
                {[4, 6, 8, 10, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`participant-btn ${formData.maxParticipants === num ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, maxParticipants: num })}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 my-8" />

            {/* Infos organisateur */}
            <div>
              <label className="block text-white/80 font-bold mb-2 text-sm">
                Ton prénom
              </label>
              <input
                type="text"
                className="input-business"
                placeholder="Ex: Sandra"
                value={formData.organizerName}
                onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-white/80 font-bold mb-2 text-sm">
                Ton email
              </label>
              <input
                type="email"
                className="input-business"
                placeholder="Ex: sandra@exemple.com"
                value={formData.organizerEmail}
                onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                required
              />
              <p className="text-white/40 text-xs mt-2">
                On t'enverra le récap de la soirée ici
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-create"
              disabled={isCreating || !formData.eventName || !formData.eventDate || !formData.organizerName || !formData.organizerEmail}
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Création en cours...
                </span>
              ) : (
                '🚀 Créer mon événement'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 p-4 rounded-xl" style={{ background: 'rgba(57, 255, 20, 0.1)', border: '1px solid rgba(57, 255, 20, 0.3)' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-[#39FF14] font-bold text-sm mb-1">Pas de panique !</p>
                <p className="text-white/60 text-sm">
                  Tu pourras modifier ces infos plus tard. Et tes invités pourront s'inscrire jusqu'au jour J.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function NewBusinessSessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">🍽️</div>
      </div>
    }>
      <NewBusinessSessionContent />
    </Suspense>
  )
}
