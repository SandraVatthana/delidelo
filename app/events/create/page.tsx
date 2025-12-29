'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Thèmes disponibles
const themes = [
  { id: 'boardgames', label: 'Jeux de société', emoji: '🎲', desc: 'Catan, Uno, Loup-Garou...' },
  { id: 'brunch', label: 'Brunch', emoji: '🥐', desc: 'Manger et jouer' },
  { id: 'retrogaming', label: 'Rétro Gaming', emoji: '🕹️', desc: 'Bornes arcade, consoles old-school' },
  { id: 'karaoke', label: 'Karaoké', emoji: '🎤', desc: 'Chanter (faux c\'est ok)' },
  { id: 'escapegame', label: 'Escape Game', emoji: '🔐', desc: 'Résoudre des énigmes' },
  { id: 'apero', label: 'Apéro Simple', emoji: '🍻', desc: 'Bières et discussions' },
  { id: 'picnic', label: 'Pique-nique', emoji: '🧺', desc: 'Plein air et détente' },
  { id: 'cinema', label: 'Ciné', emoji: '🎬', desc: 'Film + débriefe' },
]

// Jeux brise-glace
const icebreakers = [
  { id: 'manege', label: 'Le Manège', emoji: '🎠', desc: 'Questions en duo anonyme' },
  { id: 'actionverite', label: 'Action ou Vérité', emoji: '🎯', desc: 'Le classique revisité' },
  { id: 'quiz80s', label: 'Quiz 80s', emoji: '💃', desc: 'Ambiance Dirty Dancing' },
  { id: 'twonever', label: 'Jamais Je N\'ai', emoji: '🍺', desc: 'Révélations garanties' },
  { id: 'wouldyou', label: 'Tu Préfères', emoji: '🤔', desc: 'Choix impossibles' },
]

export default function CreateEventPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    theme: '',
    locationName: '',
    locationAddress: '',
    city: '',
    date: '',
    time: '',
    spotsTotal: 6,
    description: '',
    icebreaker: 'manege',
    reservationConfirmed: false,
  })

  const updateForm = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canGoNext = () => {
    switch (step) {
      case 1:
        return formData.theme !== ''
      case 2:
        return formData.locationName && formData.city && formData.date && formData.time
      case 3:
        return formData.title && formData.description
      case 4:
        return formData.reservationConfirmed
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-pattern" />
        <div className="card-90s p-8 text-center max-w-md" style={{ borderColor: '#39FF14', boxShadow: '0 0 30px #39FF1440' }}>
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-[#39FF14] mb-4" style={{ textShadow: '0 0 15px #39FF14' }}>
            Event créé !
          </h1>
          <p className="text-white/80 mb-6">
            Ton event est maintenant visible. Les gens peuvent s'inscrire !
          </p>
          <div className="bg-[#330066] p-4 mb-6 text-left">
            <p className="text-sm text-white/60 mb-2">Prochaine étape :</p>
            <p className="text-[#FFFF00] font-bold">N'oublie pas de réserver ta table au {formData.locationName} !</p>
          </div>
          <div className="space-y-3">
            <Link href="/events" className="btn-cta-primary w-full justify-center" style={{ background: '#FF6600' }}>
              Voir mon event
            </Link>
            <Link href="/dashboard" className="btn-cta-secondary w-full justify-center">
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-10">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link href="/events" className="text-[#00FFFF] font-bold hover:text-[#FFFF00] transition">
              ← Annuler
            </Link>
            <span className="text-[#FF6600] font-bold" style={{ textShadow: '0 0 10px #FF6600' }}>
              🎉 Créer un event
            </span>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="flex gap-2 mb-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex-1 h-2 transition-all ${
                s <= step ? 'bg-[#FF6600]' : 'bg-[#330066]'
              }`}
              style={s <= step ? { boxShadow: '0 0 10px #FF6600' } : {}}
            />
          ))}
        </div>
        <p className="text-xs text-white/40 text-center">Étape {step}/4</p>
      </div>

      {/* Contenu */}
      <main className="px-4 max-w-lg mx-auto">
        {/* Step 1: Thème */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#FF6600] mb-2" style={{ textShadow: '0 0 10px #FF6600' }}>
                Quel type de soirée ?
              </h1>
              <p className="text-white/60 text-sm">Choisis le thème de ton event</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updateForm('theme', theme.id)}
                  className={`p-4 text-left transition-all ${
                    formData.theme === theme.id
                      ? 'bg-[#FF6600]/20 border-2 border-[#FF6600]'
                      : 'bg-[#330066] border-2 border-transparent hover:border-[#FF6600]/50'
                  }`}
                  style={formData.theme === theme.id ? { boxShadow: '0 0 15px #FF660040' } : {}}
                >
                  <div className="text-3xl mb-2">{theme.emoji}</div>
                  <div className="font-bold text-white text-sm">{theme.label}</div>
                  <div className="text-xs text-white/50">{theme.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Lieu & Date */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#FF6600] mb-2" style={{ textShadow: '0 0 10px #FF6600' }}>
                Où et quand ?
              </h1>
              <p className="text-white/60 text-sm">Les détails pratiques</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">📍 Nom du lieu</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => updateForm('locationName', e.target.value)}
                  placeholder="Ex: Le Dernier Bar avant la Fin du Monde"
                  className="input-90s w-full"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">🏙️ Ville</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  placeholder="Ex: Paris"
                  className="input-90s w-full"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">📮 Adresse (optionnel)</label>
                <input
                  type="text"
                  value={formData.locationAddress}
                  onChange={(e) => updateForm('locationAddress', e.target.value)}
                  placeholder="Ex: 12 rue de la Soif"
                  className="input-90s w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 uppercase mb-2 block">📅 Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateForm('date', e.target.value)}
                    className="input-90s w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase mb-2 block">🕐 Heure</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateForm('time', e.target.value)}
                    className="input-90s w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">👥 Nombre de places (max 10)</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateForm('spotsTotal', Math.max(3, formData.spotsTotal - 1))}
                    className="btn-90s w-12 h-12"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-[#FF6600] flex-1 text-center">{formData.spotsTotal}</span>
                  <button
                    onClick={() => updateForm('spotsTotal', Math.min(10, formData.spotsTotal + 1))}
                    className="btn-90s w-12 h-12"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-white/40 text-center mt-2">Toi inclus</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Détails */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#FF6600] mb-2" style={{ textShadow: '0 0 10px #FF6600' }}>
                Décris ton event
              </h1>
              <p className="text-white/60 text-sm">Donne envie aux gens de venir !</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">✨ Titre accrocheur</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="Ex: Soirée Jeux de Société & Bières"
                  className="input-90s w-full"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">📝 Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="Décris l'ambiance, ce que tu prévois, le dress code..."
                  className="input-90s w-full h-32 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase mb-2 block">🎲 Jeu brise-glace</label>
                <p className="text-xs text-white/50 mb-3">On enverra ce jeu aux participants avant la soirée</p>
                <div className="space-y-2">
                  {icebreakers.map(game => (
                    <button
                      key={game.id}
                      onClick={() => updateForm('icebreaker', game.id)}
                      className={`w-full p-3 text-left flex items-center gap-3 transition-all ${
                        formData.icebreaker === game.id
                          ? 'bg-[#FF6600]/20 border-2 border-[#FF6600]'
                          : 'bg-[#330066] border-2 border-transparent hover:border-[#FF6600]/50'
                      }`}
                    >
                      <span className="text-2xl">{game.emoji}</span>
                      <div>
                        <div className="font-bold text-white text-sm">{game.label}</div>
                        <div className="text-xs text-white/50">{game.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-xl font-bold text-[#FF6600] mb-2" style={{ textShadow: '0 0 10px #FF6600' }}>
                Récap & Confirmation
              </h1>
              <p className="text-white/60 text-sm">Vérifie que tout est bon !</p>
            </div>

            {/* Récap */}
            <div className="card-90s p-4" style={{ borderColor: '#FF6600' }}>
              <div className="text-center mb-4">
                <span className="text-4xl">{themes.find(t => t.id === formData.theme)?.emoji}</span>
                <h2 className="text-lg font-bold text-white mt-2">{formData.title || 'Mon event'}</h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">📍 Lieu</span>
                  <span className="text-white font-bold">{formData.locationName}, {formData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">📅 Date</span>
                  <span className="text-white font-bold">{formData.date} à {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">👥 Places</span>
                  <span className="text-white font-bold">{formData.spotsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">🎲 Brise-glace</span>
                  <span className="text-white font-bold">{icebreakers.find(g => g.id === formData.icebreaker)?.label}</span>
                </div>
              </div>

              {formData.description && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 uppercase mb-1">Description</p>
                  <p className="text-white/80 text-sm">{formData.description}</p>
                </div>
              )}
            </div>

            {/* Checkbox réservation */}
            <div
              className={`p-4 border-2 transition-all cursor-pointer ${
                formData.reservationConfirmed
                  ? 'border-[#39FF14] bg-[#39FF14]/10'
                  : 'border-[#FFFF00] bg-[#FFFF00]/10'
              }`}
              onClick={() => updateForm('reservationConfirmed', !formData.reservationConfirmed)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-6 h-6 border-2 flex items-center justify-center ${
                    formData.reservationConfirmed
                      ? 'border-[#39FF14] bg-[#39FF14]'
                      : 'border-white/50'
                  }`}
                >
                  {formData.reservationConfirmed && <span className="text-[#1A0033] font-bold">✓</span>}
                </div>
                <div>
                  <p className="font-bold text-[#FFFF00]">Je m'engage à réserver la table</p>
                  <p className="text-xs text-white/60 mt-1">
                    Tu es responsable de la réservation. GameCrush ne gère pas les réservations.
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-[#330066] p-4 border-l-4 border-[#00FFFF]">
              <p className="text-sm text-white/80">
                <span className="text-[#00FFFF] font-bold">💡 Conseil : </span>
                Réserve ta table dès maintenant au {formData.locationName || 'lieu choisi'} pour éviter les mauvaises surprises !
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="btn-cta-secondary flex-1">
              ← Retour
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canGoNext()}
              className="btn-cta-primary flex-1"
              style={{
                background: canGoNext() ? '#FF6600' : '#333',
                opacity: canGoNext() ? 1 : 0.5,
              }}
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canGoNext() || isSubmitting}
              className="btn-cta-primary flex-1"
              style={{
                background: canGoNext() ? '#39FF14' : '#333',
                color: canGoNext() ? '#1A0033' : '#666',
              }}
            >
              {isSubmitting ? '⏳ Création...' : '🎉 Créer mon event'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
