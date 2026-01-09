'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  photo: string
  jobTitle: string
  company: string
  funFact: string
  absurdPitch: string
  businessProblem: string
  linkedinUrl: string
}

const pitchExamples = [
  "Je fais disparaître les bugs... et parfois les deadlines.",
  "Je transforme le café en code depuis 2015.",
  "Expert en réunions qui auraient pu être des emails.",
  "Je convaincs des gens de donner leur argent pour des pixels.",
  "Dompteur de tableurs Excel à temps plein.",
]

const funFactExamples = [
  "J'ai commencé ma carrière en vendant des glaces sur la plage.",
  "Mon premier job était testeur de jeux vidéo.",
  "J'ai fait un stage chez un magicien professionnel.",
  "J'ai été DJ de mariage pendant 3 ans.",
]

export default function JoinRecrePage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    photo: '',
    jobTitle: '',
    company: '',
    funFact: '',
    absurdPitch: '',
    businessProblem: '',
    linkedinUrl: '',
  })
  const [sessionData, setSessionData] = useState<{ eventName: string; organizerName: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewEmoji, setPreviewEmoji] = useState('👤')

  const avatarEmojis = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍🎨', '👨‍🔬', '👩‍🔬', '🧑‍🚀', '👨‍🍳', '👩‍🏫', '🦸', '🦹', '🧙', '🎅']

  useEffect(() => {
    const data = localStorage.getItem(`recre_session_${code}`)
    if (data) {
      setSessionData(JSON.parse(data))
    }
  }, [code])

  const totalSteps = 5

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Charger les données de session existantes
    const existingData = localStorage.getItem(`recre_session_${code}`)
    if (existingData) {
      const session = JSON.parse(existingData)

      // Ajouter le nouveau participant
      const newParticipant = {
        name: formData.name,
        email: formData.email,
        photo: formData.photo || previewEmoji,
        jobTitle: formData.jobTitle,
        company: formData.company,
        funFact: formData.funFact,
        absurdPitch: formData.absurdPitch,
        businessProblem: formData.businessProblem,
        linkedinUrl: formData.linkedinUrl,
        isOrganizer: false,
        profileCompleted: true,
        joinedAt: new Date().toISOString(),
      }

      // Vérifier si le participant existe déjà (par email)
      const existingIndex = session.participants.findIndex(
        (p: { email: string }) => p.email === formData.email
      )

      if (existingIndex >= 0) {
        // Mettre à jour le profil existant
        session.participants[existingIndex] = {
          ...session.participants[existingIndex],
          ...newParticipant,
          isOrganizer: session.participants[existingIndex].isOrganizer,
        }
      } else {
        // Ajouter nouveau participant
        session.participants.push(newParticipant)
      }

      localStorage.setItem(`recre_session_${code}`, JSON.stringify(session))
    }

    // Rediriger vers la page de confirmation
    setTimeout(() => {
      router.push(`/recre/${code}/ready`)
    }, 1000)
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.email.trim()
      case 2:
        return formData.jobTitle.trim()
      case 3:
        return formData.funFact.trim()
      case 4:
        return formData.absurdPitch.trim()
      case 5:
        return true // Optionnel
      default:
        return false
    }
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D001A' }}>
        <div className="text-4xl animate-spin">🍽️</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0D001A 0%, #1A0033 100%)' }}>
      <style jsx>{`
        .input-join {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .input-join:focus {
          outline: none;
          border-color: #FF00FF;
          box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
        }
        .input-join::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .textarea-join {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          min-height: 100px;
          resize: none;
          transition: all 0.3s ease;
        }
        .textarea-join:focus {
          outline: none;
          border-color: #FF00FF;
          box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
        }
        .textarea-join::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .btn-next {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-next:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
        }
        .btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-back {
          padding: 12px 24px;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: white/60;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-back:hover {
          border-color: rgba(255, 255, 255, 0.4);
          color: white;
        }
        .example-chip {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: white/60;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .example-chip:hover {
          border-color: #FF00FF;
          color: #FF00FF;
        }
        .avatar-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .avatar-btn.selected {
          border-color: #FF00FF;
          background: rgba(255, 0, 255, 0.2);
        }
        .avatar-btn:hover {
          border-color: #FF00FF;
        }
      `}</style>

      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href={`/recre/${code}`} className="text-white/60 hover:text-white transition">
            ← Retour
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-white/60 text-sm">{sessionData.eventName}</span>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-6 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i < step
                    ? 'linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%)'
                    : 'rgba(255, 255, 255, 0.1)'
                }}
              />
            ))}
          </div>
          <p className="text-white/40 text-xs mt-2 text-center">
            Étape {step} sur {totalSteps}
          </p>
        </div>
      </div>

      {/* Main */}
      <main className="px-6 py-8">
        <div className="max-w-xl mx-auto">
          {/* Step 1: Identité */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">👋</div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#FF00FF',
                    textShadow: '0 0 15px rgba(255, 0, 255, 0.5)'
                  }}
                >
                  SALUT, C'EST QUI ?
                </h1>
                <p className="text-white/60">
                  {sessionData.organizerName} t'a invité·e !
                </p>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">
                  Ton prénom
                </label>
                <input
                  type="text"
                  className="input-join"
                  placeholder="Ex: Sophie"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">
                  Ton email
                </label>
                <input
                  type="email"
                  className="input-join"
                  placeholder="Ex: sophie@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-3 text-sm">
                  Choisis ton avatar
                </label>
                <div className="flex flex-wrap gap-2">
                  {avatarEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`avatar-btn ${previewEmoji === emoji ? 'selected' : ''}`}
                      onClick={() => setPreviewEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Métier */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">💼</div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#00FFFF',
                    textShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
                  }}
                >
                  TON VRAI MÉTIER
                </h1>
                <p className="text-white/60">
                  Le sérieux, ça va venir après !
                </p>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">
                  Intitulé de poste
                </label>
                <input
                  type="text"
                  className="input-join"
                  placeholder="Ex: Directrice Marketing"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">
                  Entreprise <span className="text-white/40">(optionnel)</span>
                </label>
                <input
                  type="text"
                  className="input-join"
                  placeholder="Ex: Startup XYZ"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">
                  LinkedIn <span className="text-white/40">(optionnel)</span>
                </label>
                <input
                  type="url"
                  className="input-join"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Fun Fact */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎲</div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#39FF14',
                    textShadow: '0 0 15px rgba(57, 255, 20, 0.5)'
                  }}
                >
                  FUN FACT SUR TON PARCOURS
                </h1>
                <p className="text-white/60">
                  Quelque chose de surprenant ou drôle !
                </p>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">
                  Ton anecdote pro WTF
                </label>
                <textarea
                  className="textarea-join"
                  placeholder="Ex: J'ai commencé ma carrière en testant des matelas..."
                  value={formData.funFact}
                  onChange={(e) => setFormData({ ...formData, funFact: e.target.value })}
                />
              </div>

              <div>
                <p className="text-white/40 text-sm mb-3">💡 Besoin d'inspiration ?</p>
                <div className="flex flex-wrap gap-2">
                  {funFactExamples.map((example, i) => (
                    <button
                      key={i}
                      type="button"
                      className="example-chip text-left"
                      onClick={() => setFormData({ ...formData, funFact: example })}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Pitch Absurde */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎤</div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#FF6600',
                    textShadow: '0 0 15px rgba(255, 102, 0, 0.5)'
                  }}
                >
                  TON PITCH ABSURDE
                </h1>
                <p className="text-white/60">
                  Décris ton métier de façon ridicule !
                </p>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">
                  Version décalée de ton job
                </label>
                <textarea
                  className="textarea-join"
                  placeholder="Ex: Je vends du vent à des gens qui n'en veulent pas..."
                  value={formData.absurdPitch}
                  onChange={(e) => setFormData({ ...formData, absurdPitch: e.target.value })}
                />
              </div>

              <div>
                <p className="text-white/40 text-sm mb-3">💡 Exemples de pitchs :</p>
                <div className="flex flex-wrap gap-2">
                  {pitchExamples.map((example, i) => (
                    <button
                      key={i}
                      type="button"
                      className="example-chip text-left"
                      onClick={() => setFormData({ ...formData, absurdPitch: example })}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Problème Business (optionnel) */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">💡</div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{
                    fontFamily: 'Bangers, cursive',
                    color: '#FF00FF',
                    textShadow: '0 0 15px rgba(255, 0, 255, 0.5)'
                  }}
                >
                  TON PROBLÈME BUSINESS
                </h1>
                <p className="text-white/60">
                  Pour le Brainstorm Débile !<br />
                  <span className="text-white/40 text-sm">(totalement optionnel)</span>
                </p>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">
                  Un vrai problème que tu rencontres
                </label>
                <textarea
                  className="textarea-join"
                  placeholder="Ex: Comment convaincre mon équipe de répondre aux emails avant 18h..."
                  value={formData.businessProblem}
                  onChange={(e) => setFormData({ ...formData, businessProblem: e.target.value })}
                />
                <p className="text-white/40 text-xs mt-2">
                  Les autres participants proposeront les pires solutions possibles ! 😈
                </p>
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'rgba(0, 255, 255, 0.1)', border: '1px solid rgba(0, 255, 255, 0.3)' }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">✨</span>
                  <div>
                    <p className="text-[#00FFFF] font-bold text-sm mb-1">Presque fini !</p>
                    <p className="text-white/60 text-sm">
                      Plus qu'à valider et tu seras prêt·e pour la Récré Business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 space-y-4">
            <button
              onClick={nextStep}
              disabled={!canProceed() || isSubmitting}
              className="btn-next"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Enregistrement...
                </span>
              ) : step === totalSteps ? (
                '✅ Valider mon profil'
              ) : (
                'Suivant →'
              )}
            </button>

            {step > 1 && (
              <button onClick={prevStep} className="btn-back w-full">
                ← Retour
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
