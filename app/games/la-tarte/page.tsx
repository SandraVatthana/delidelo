'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient, demoMode } from '@/lib/supabase'
import { moderateText, checkText, bdInsultSuggestions, targetEmojis as targetEmojisFromHook } from '@/hooks/useBDModeration'

// Types
type GameStep = 'accueil' | 'cible' | 'crime' | 'arme' | 'animation' | 'resultat'
type TargetType = 'ex' | 'boss' | 'ami' | 'famille' | 'institution' | 'politique' | 'inconnu' | 'autre'
type TarteType = 'cream' | 'lemon' | 'chocolate' | 'apple' | 'cake' | 'mud'

interface TarteData {
  targetType: TargetType | null
  targetNickname: string
  crimeDescription: string
  tarteType: TarteType | null
}

// Configuration des cibles
const targetOptions: { type: TargetType; icon: string; label: string }[] = [
  { type: 'ex', icon: '💔', label: 'Mon ex' },
  { type: 'boss', icon: '💼', label: 'Mon boss / Collègue' },
  { type: 'ami', icon: '🗡️', label: 'Ami(e) traître' },
  { type: 'famille', icon: '👨‍👩‍👧', label: 'Ma famille' },
  { type: 'institution', icon: '🏛️', label: 'Institution' },
  { type: 'politique', icon: '🎭', label: 'Politique' },
  { type: 'inconnu', icon: '😤', label: 'Inconnu(e)' },
  { type: 'autre', icon: '✏️', label: 'Autre' },
]

// Configuration des tartes
const tarteOptions: { type: TarteType; icon: string; name: string; description: string; color: string }[] = [
  { type: 'cream', icon: '🍰', name: 'CREME', description: 'Classique', color: '#FFF8DC' },
  { type: 'lemon', icon: '🍋', name: 'CITRON', description: 'Pour les aigris', color: '#FFF44F' },
  { type: 'chocolate', icon: '🍫', name: 'CHOCOLAT', description: 'La lourde', color: '#8B4513' },
  { type: 'apple', icon: '🥧', name: 'POMMES', description: 'Terroir', color: '#8FBC8F' },
  { type: 'cake', icon: '🎂', name: 'GATEAU', description: 'Trahison majeure', color: '#FFB6C1' },
  { type: 'mud', icon: '💩', name: 'BOUE', description: 'Le pire', color: '#8B7355' },
]

// Insultes BD
const bdInsults = [
  { text: 'Sac a crottes', icon: '💩' },
  { text: 'Raclure de bidet', icon: '🚽' },
  { text: 'Abruti des alpages', icon: '🐄' },
  { text: '@#$%&!', icon: '🤬' },
  { text: 'Patate cosmique', icon: '🥔' },
  { text: 'Triple buse', icon: '🦅' },
]

// Emojis cibles
const targetEmojis = ['🧦', '🐍', '🦨', '🐀', '🪳', '🐌', '👻', '🤡', '👹', '🦠', '🗑️', '🚽']

export default function LaTartePage() {
  const router = useRouter()
  const [step, setStep] = useState<GameStep>('accueil')
  const [tarteData, setTarteData] = useState<TarteData>({
    targetType: null,
    targetNickname: '',
    crimeDescription: '',
    tarteType: null,
  })
  const [customTarget, setCustomTarget] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🧦')
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [showModerationPopup, setShowModerationPopup] = useState(false)
  const [moderationMessage, setModerationMessage] = useState<{ type: 'insult' | 'name' | 'blocked', original: string, suggestions: string[] } | null>(null)
  const [score, setScore] = useState(1337)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [showFieldsError, setShowFieldsError] = useState(false)

  // Animation state
  const [animationPhase, setAnimationPhase] = useState<'throw' | 'splat' | 'done'>('throw')

  // Gerer l'animation SPLAT
  useEffect(() => {
    if (step === 'animation') {
      setAnimationPhase('throw')
      const timer1 = setTimeout(() => setAnimationPhase('splat'), 800)
      const timer2 = setTimeout(() => {
        setAnimationPhase('done')
        setScore(prev => prev + 100)
        setStep('resultat')
      }, 2000)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [step])

  const handleTargetSelect = (type: TargetType) => {
    setTarteData(prev => ({ ...prev, targetType: type }))
    if (type !== 'autre') {
      setStep('crime')
    }
  }

  const handleCrimeSubmit = () => {
    if (!tarteData.targetNickname || !tarteData.crimeDescription) {
      setShowFieldsError(true)
      setTimeout(() => setShowFieldsError(false), 3000)
      return
    }

    setShowFieldsError(false)
    const moderationResult = moderateText(tarteData.crimeDescription)

    if (moderationResult.hasBlockedWords) {
      setModerationMessage({
        type: 'blocked',
        original: tarteData.crimeDescription,
        suggestions: ['Ici c\'est CARTOON, pas TRIBUNAL !', 'Reformule sans violence, avec du fun BD.']
      })
      setShowModerationPopup(true)
      return
    }

    if (moderationResult.hasPersonalInfo) {
      setModerationMessage({
        type: 'name',
        original: moderationResult.foundPersonalInfo.join(', '),
        suggestions: ['Utilise un surnom rigolo', 'Exemple: "Mon ex le 🐍"']
      })
      setShowModerationPopup(true)
      return
    }

    if (moderationResult.hasInsults) {
      setTarteData(prev => ({ ...prev, crimeDescription: moderationResult.cleanedText }))
      setModerationMessage({
        type: 'insult',
        original: moderationResult.foundInsults.join(', '),
        suggestions: ['Converti en style BD !']
      })
      setShowModerationPopup(true)
      setTimeout(() => {
        setShowModerationPopup(false)
        setStep('arme')
      }, 2000)
      return
    }

    setStep('arme')
  }

  const handleTarteSelect = (type: TarteType) => {
    setTarteData(prev => ({ ...prev, tarteType: type }))
    setStep('animation')
  }

  const handlePublish = async (isPublic: boolean) => {
    setIsPublishing(true)
    try {
      // Mode démo : sauvegarder dans localStorage
      if (demoMode) {
        const newTarte = {
          id: `demo-${Date.now()}`,
          user_id: 'demo-user',
          target_type: tarteData.targetType,
          target_nickname: tarteData.targetNickname,
          crime_description: tarteData.crimeDescription,
          tarte_type: tarteData.tarteType,
          is_public: isPublic,
          reactions_bienmerite: 0,
          reactions_solidaire: 0,
          reactions_mdr: 0,
          reactions_pareil: 0,
          is_tarte_du_jour: false,
          created_at: new Date().toISOString(),
          comments_count: 0,
        }

        // Récupérer les tartes existantes du localStorage
        const existingTartes = JSON.parse(localStorage.getItem('demo_tartes') || '[]')
        existingTartes.unshift(newTarte)
        localStorage.setItem('demo_tartes', JSON.stringify(existingTartes))

        console.log('🎮 Mode démo - Tarte sauvegardée:', newTarte)
        await new Promise(resolve => setTimeout(resolve, 500))
        setPublishSuccess(true)
        setIsPublishing(false)
        return
      }

      const supabase = getSupabaseClient()
      if (!supabase) {
        setPublishSuccess(true)
        setIsPublishing(false)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('tartes').insert({
          user_id: user.id,
          target_type: tarteData.targetType,
          target_nickname: tarteData.targetNickname,
          crime_description: tarteData.crimeDescription,
          tarte_type: tarteData.tarteType,
          is_public: isPublic,
        })
      }
      setPublishSuccess(true)
    } catch (error) {
      console.error('Erreur:', error)
      if (demoMode) {
        setPublishSuccess(true)
      }
    }
    setIsPublishing(false)
  }

  const resetGame = () => {
    setStep('accueil')
    setTarteData({ targetType: null, targetNickname: '', crimeDescription: '', tarteType: null })
    setPublishSuccess(false)
    setSelectedEmoji('🧦')
    setCustomTarget('')
  }

  const selectedTarte = tarteOptions.find(t => t.type === tarteData.tarteType)

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* ==================== STYLES CSS ==================== */}
      <style jsx>{`
        /* === FONTS === */
        .font-arcade { font-family: 'Press Start 2P', monospace; }
        .font-title { font-family: 'Bangers', cursive; }

        /* === BACKGROUND === */
        .bg-arcade {
          background: linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%);
        }

        /* Grille neon */
        .grid-pattern {
          background-image:
            linear-gradient(rgba(255, 0, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
          animation: gridScroll 20s linear infinite;
        }

        @keyframes gridScroll {
          0% { background-position: 0 0, 0 0, 0 0, 0 0; }
          100% { background-position: 100px 100px, 100px 100px, 20px 20px, 20px 20px; }
        }

        /* Scanlines CRT */
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
        }

        /* Etoiles */
        .stars {
          background-image:
            radial-gradient(1px 1px at 20px 30px, white, transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 50px 160px, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, white, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.7), transparent),
            radial-gradient(2px 2px at 160px 120px, rgba(255,0,255,0.5), transparent);
          background-size: 200px 200px;
          animation: twinkle 4s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* === GLOW EFFECTS === */
        .glow-pink { text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff; }
        .glow-orange { text-shadow: 0 0 10px #ff6600, 0 0 20px #ff6600, 0 0 40px #ff6600; }
        .glow-yellow { text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 40px #ffff00; }
        .glow-cyan { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff; }
        .glow-green { text-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14; }

        .box-glow-pink { box-shadow: 0 0 20px rgba(255, 0, 255, 0.5), inset 0 0 20px rgba(255, 0, 255, 0.1); }
        .box-glow-orange { box-shadow: 0 0 20px rgba(255, 102, 0, 0.5), inset 0 0 20px rgba(255, 102, 0, 0.1); }
        .box-glow-green { box-shadow: 0 0 20px rgba(57, 255, 20, 0.5), inset 0 0 20px rgba(57, 255, 20, 0.1); }

        /* === ARCADE CABINET FRAME === */
        .arcade-frame {
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          border: 4px solid #333;
          border-radius: 20px;
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,0.1),
            inset 0 -2px 0 rgba(0,0,0,0.3),
            0 10px 40px rgba(0,0,0,0.5),
            0 0 60px rgba(255, 0, 255, 0.2);
          position: relative;
          max-width: 480px;
          padding: 32px;
        }

        .arcade-frame::before {
          content: '';
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          bottom: 14px;
          border: 2px solid rgba(255, 0, 255, 0.3);
          border-radius: 12px;
          pointer-events: none;
        }

        /* === SECTION SPACING === */
        .section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .section-title {
          margin-bottom: 12px;
        }

        .section-label {
          margin-bottom: 8px;
        }

        /* Vis decoratives */
        .screw {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #666 0%, #333 100%);
          border-radius: 50%;
          position: absolute;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.5);
        }
        .screw::after {
          content: '+';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #222;
          font-size: 8px;
          font-weight: bold;
        }

        /* === ARCADE BUTTONS === */
        .btn-arcade {
          position: relative;
          padding: 16px 32px;
          font-family: 'Press Start 2P', monospace;
          font-size: 12px;
          text-transform: uppercase;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.1s ease;
          transform-style: preserve-3d;
        }

        .btn-arcade-primary {
          background: linear-gradient(180deg, #39ff14 0%, #32cd32 50%, #228b22 100%);
          color: #000;
          box-shadow:
            0 6px 0 #1a5c1a,
            0 8px 10px rgba(0,0,0,0.4),
            inset 0 2px 0 rgba(255,255,255,0.4),
            0 0 30px rgba(57, 255, 20, 0.5);
          text-shadow: 0 1px 0 rgba(255,255,255,0.3);
        }

        .btn-arcade-primary:hover {
          transform: translateY(2px);
          box-shadow:
            0 4px 0 #1a5c1a,
            0 6px 8px rgba(0,0,0,0.4),
            inset 0 2px 0 rgba(255,255,255,0.4),
            0 0 40px rgba(57, 255, 20, 0.7);
        }

        .btn-arcade-primary:active {
          transform: translateY(6px);
          box-shadow:
            0 0 0 #1a5c1a,
            0 2px 4px rgba(0,0,0,0.4),
            inset 0 2px 0 rgba(255,255,255,0.2);
        }

        .btn-arcade-secondary {
          background: linear-gradient(180deg, #ff00ff 0%, #cc00cc 50%, #990099 100%);
          color: #fff;
          box-shadow:
            0 4px 0 #660066,
            0 6px 8px rgba(0,0,0,0.4),
            inset 0 2px 0 rgba(255,255,255,0.3),
            0 0 20px rgba(255, 0, 255, 0.4);
        }

        .btn-arcade-secondary:hover {
          transform: translateY(2px);
          box-shadow:
            0 2px 0 #660066,
            0 4px 6px rgba(0,0,0,0.4),
            inset 0 2px 0 rgba(255,255,255,0.3),
            0 0 30px rgba(255, 0, 255, 0.6);
        }

        .btn-arcade-secondary:active {
          transform: translateY(4px);
          box-shadow: 0 0 0 #660066, inset 0 2px 0 rgba(255,255,255,0.2);
        }

        /* === BUTTON GROUPS === */
        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }

        .btn-group-row {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        /* === INPUT FIELDS === */
        .input-field {
          padding: 16px;
          line-height: 1.4;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .input-field:focus {
          border-color: #ff6600;
          outline: none;
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        textarea.input-field {
          resize: none;
        }

        /* === ANIMATIONS === */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-neon {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.8; filter: brightness(1.2); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          75% { transform: translateX(5px) rotate(2deg); }
        }

        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes tarteFly {
          0% { transform: translateX(-150px) translateY(80px) rotate(0deg) scale(0.3); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateX(0) translateY(0) rotate(720deg) scale(1); }
        }

        @keyframes splat {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes particles {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-neon { animation: pulse-neon 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-flash { animation: flash 0.2s ease-in-out 3; }
        .tarte-fly { animation: tarteFly 0.8s ease-out forwards; }
        .splat-effect { animation: splat 0.4s ease-out forwards; }
        .particle { animation: particles 1s ease-out forwards; }
        .bounce-in { animation: bounce-in 0.5s ease-out; }

        /* === DECORATIVE SPRITES === */
        .sprite {
          position: absolute;
          pointer-events: none;
          opacity: 0.6;
        }

        /* === TARGET OPTIONS === */
        .target-option {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 0, 255, 0.3);
          border-radius: 8px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1.4;
        }
        .target-option:hover {
          border-color: #ff00ff;
          background: rgba(255, 0, 255, 0.1);
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
          transform: scale(1.02);
        }
        .target-option.selected {
          border-color: #39ff14;
          background: rgba(57, 255, 20, 0.15);
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
        }

        /* === TARTE CARDS === */
        .tarte-card {
          background: rgba(0, 0, 0, 0.5);
          border: 3px solid rgba(255, 102, 0, 0.3);
          border-radius: 12px;
          padding: 20px 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tarte-card:hover {
          border-color: #ff6600;
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 10px 30px rgba(255, 102, 0, 0.4);
        }

        /* === INSULT CHIPS === */
        .chips-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin: 16px 0;
        }

        .insult-chip {
          background: rgba(255, 102, 0, 0.2);
          border: 1px solid rgba(255, 102, 0, 0.5);
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          line-height: 1.4;
        }
        .insult-chip:hover {
          background: rgba(255, 102, 0, 0.4);
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }

        /* === EMOJI BUTTONS === */
        .emoji-btn {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid transparent;
          background: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .emoji-btn:hover { background: rgba(255, 255, 255, 0.1); transform: scale(1.1); }
        .emoji-btn.selected {
          border-color: #ff6600;
          background: rgba(255, 102, 0, 0.3);
          box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }

        /* === SCORE DISPLAY === */
        .score-display {
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          color: #39ff14;
          text-shadow: 0 0 10px #39ff14;
          background: rgba(0, 0, 0, 0.6);
          padding: 10px 16px;
          border-radius: 6px;
          border: 1px solid rgba(57, 255, 20, 0.3);
        }

        /* === INSERT COIN === */
        .insert-coin {
          margin-top: 24px;
          padding: 12px;
        }
      `}</style>

      {/* ==================== BACKGROUND LAYERS ==================== */}
      <div className="fixed inset-0 bg-arcade" />
      <div className="fixed inset-0 grid-pattern" />
      <div className="fixed inset-0 stars" />
      <div className="fixed inset-0 scanlines" />

      {/* Sprites decoratifs */}
      <div className="sprite text-4xl animate-float" style={{ top: '10%', right: '5%', animationDelay: '0s' }}>🥧</div>
      <div className="sprite text-3xl animate-float" style={{ top: '30%', right: '8%', animationDelay: '1s' }}>🎯</div>
      <div className="sprite text-2xl animate-float" style={{ top: '50%', right: '3%', animationDelay: '2s' }}>⭐</div>
      <div className="sprite text-3xl animate-float" style={{ top: '70%', right: '10%', animationDelay: '0.5s' }}>💥</div>
      <div className="sprite text-2xl animate-float" style={{ top: '20%', left: '3%', animationDelay: '1.5s' }}>✨</div>
      <div className="sprite text-3xl animate-float" style={{ top: '60%', left: '5%', animationDelay: '2.5s' }}>🎮</div>

      {/* ==================== MAIN CONTAINER ==================== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 min-h-screen">

        {/* ARCADE CABINET */}
        <div className="arcade-frame w-full relative">
          {/* Vis */}
          <div className="screw" style={{ top: '8px', left: '8px' }} />
          <div className="screw" style={{ top: '8px', right: '8px' }} />
          <div className="screw" style={{ bottom: '8px', left: '8px' }} />
          <div className="screw" style={{ bottom: '8px', right: '8px' }} />

          {/* Header avec score */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/games" className="text-white/60 hover:text-white transition text-sm flex items-center gap-1">
              <span>◀</span>
              <span className="hidden sm:inline">RETOUR</span>
            </Link>
            <div className="score-display">
              SCORE: {score.toString().padStart(6, '0')}
            </div>
            <Link href="/games/la-tarte/mur" className="text-[#ff00ff] hover:text-white transition text-sm font-arcade" style={{ fontSize: '8px' }}>
              LE MUR
            </Link>
          </div>

          {/* ==================== ETAPE 1: ACCUEIL ==================== */}
          {step === 'accueil' && (
            <div className="text-center bounce-in">
              {/* Logo avec glow */}
              <div className="text-7xl mb-6 animate-float animate-pulse-neon" style={{ filter: 'drop-shadow(0 0 30px #ff6600)' }}>
                🥧
              </div>

              {/* Titre style arcade */}
              <div className="section-title">
                <h1 className="font-arcade text-lg sm:text-xl text-[#ff6600] glow-orange mb-2 leading-relaxed">
                  LE JEU DE
                </h1>
                <h1 className="font-title text-5xl sm:text-6xl text-[#ffff00] glow-yellow mb-4" style={{ letterSpacing: '4px', WebkitTextStroke: '2px #ff6600' }}>
                  LA TARTE
                </h1>
              </div>

              {/* Sous-titre */}
              <p className="font-arcade text-[8px] sm:text-[10px] text-[#00ffff] glow-cyan mb-8 leading-relaxed">
                "LANCE TA FRUSTRATION"
              </p>

              {/* Description courte */}
              <div className="bg-black/40 rounded-lg p-5 mb-8 border border-[#ff00ff]/30 box-glow-pink">
                <p className="text-white/80 text-sm leading-relaxed mb-3">
                  🎯 Qui mérite une tarte aujourd'hui ?
                </p>
                <p className="text-white/50 text-xs">
                  Ton ex • Ton boss • Les impôts
                </p>
              </div>

              {/* Boutons */}
              <div className="btn-group">
                <button
                  onClick={() => setStep('cible')}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  className={`btn-arcade btn-arcade-primary w-full ${isButtonHovered ? 'animate-shake' : ''}`}
                >
                  <span className="mr-2">🎮</span> LANCER UNE TARTE
                </button>

                <Link href="/games/la-tarte/mur" className="btn-arcade btn-arcade-secondary w-full inline-block text-center" style={{ fontSize: '10px', padding: '12px 24px' }}>
                  👀 VOIR LE MUR
                </Link>
              </div>

              {/* Regle d'or */}
              <div className="mt-8 pt-4 border-t border-white/10">
                <p className="font-arcade text-[7px] text-[#ff00ff]/60">
                  🎪 MODE CARTOON • ZERO HAINE
                </p>
                {demoMode && (
                  <p className="font-arcade text-[6px] text-[#ffff00]/50 mt-2">
                    ⚠️ MODE DÉMO - DONNÉES NON SAUVEGARDÉES
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ==================== ETAPE 2: CHOIX CIBLE ==================== */}
          {step === 'cible' && (
            <div className="bounce-in">
              <div className="text-center mb-8">
                <span className="text-4xl mb-3 block animate-float">🎯</span>
                <h2 className="font-arcade text-xs text-[#ff6600] glow-orange">
                  QUI MÉRITE UNE TARTE ?
                </h2>
              </div>

              <div className="section">
                <div className="grid grid-cols-2 gap-3">
                  {targetOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => handleTargetSelect(option.type)}
                      className={`target-option flex items-center gap-3 ${tarteData.targetType === option.type ? 'selected' : ''}`}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <span className="text-white/80 text-xs">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {tarteData.targetType === 'autre' && (
                <div className="section">
                  <input
                    type="text"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    placeholder="Qui veux-tu tarter ?"
                    className="input-field w-full"
                  />
                  <button
                    onClick={() => { if (customTarget) setStep('crime') }}
                    disabled={!customTarget}
                    className="btn-arcade btn-arcade-primary w-full disabled:opacity-50"
                  >
                    SUIVANT ▶
                  </button>
                </div>
              )}

              <p className="text-center text-white/30 text-[8px] mt-6 font-arcade">
                ⚠ PAS DE VRAI NOM
              </p>

              <button onClick={() => setStep('accueil')} className="w-full mt-6 text-white/40 hover:text-white text-xs text-center py-2">
                ◀ RETOUR
              </button>
            </div>
          )}

          {/* ==================== ETAPE 3: DESCRIPTION CRIME ==================== */}
          {step === 'crime' && (
            <div className="bounce-in">
              <div className="text-center mb-8">
                <span className="text-3xl mb-3 block">📝</span>
                <h2 className="font-arcade text-[10px] text-[#ff6600] glow-orange">
                  SON CRIME ?
                </h2>
              </div>

              {/* Surnom */}
              <div className="section">
                <label className="text-white/50 text-xs block section-label">Surnom de ta cible :</label>
                <input
                  type="text"
                  value={tarteData.targetNickname}
                  onChange={(e) => setTarteData(prev => ({ ...prev, targetNickname: e.target.value }))}
                  placeholder={`Clique sur un emoji ou tape un surnom`}
                  className="input-field w-full"
                />
                <p className="text-white/30 text-[10px] mt-2 mb-2">Clique sur un emoji pour remplir automatiquement :</p>
                <div className="flex flex-wrap gap-2">
                  {targetEmojis.slice(0, 8).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setSelectedEmoji(emoji)
                        // Auto-remplir le surnom avec le type de cible
                        const nickname = `Ma cible le ${emoji}`
                        setTarteData(prev => ({ ...prev, targetNickname: nickname }))
                      }}
                      className={`emoji-btn ${selectedEmoji === emoji ? 'selected' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Crime */}
              <div className="section">
                <label className="text-white/50 text-xs block section-label">Ce qu'il/elle a fait :</label>
                <textarea
                  value={tarteData.crimeDescription}
                  onChange={(e) => setTarteData(prev => ({ ...prev, crimeDescription: e.target.value.slice(0, 280) }))}
                  placeholder="Raconte..."
                  rows={3}
                  className="input-field w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-white/30 text-[8px]">💡 STYLE BD !</span>
                  <span className={`text-[10px] ${tarteData.crimeDescription.length >= 250 ? 'text-red-400' : 'text-white/30'}`}>
                    {tarteData.crimeDescription.length}/280
                  </span>
                </div>
              </div>

              {/* Insultes BD */}
              <div className="section">
                <label className="text-white/40 text-[8px] block section-label font-arcade">INSULTES BD :</label>
                <div className="chips-group">
                  {bdInsults.map((insult) => (
                    <button
                      key={insult.text}
                      onClick={() => setTarteData(prev => ({
                        ...prev,
                        crimeDescription: prev.crimeDescription + ` ${insult.text} ${insult.icon}`
                      }))}
                      className="insult-chip"
                    >
                      {insult.icon} {insult.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message d'erreur */}
              {showFieldsError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-center animate-shake">
                  <p className="text-red-400 text-xs font-bold">
                    ⚠️ Merci de remplir tous les champs !
                  </p>
                </div>
              )}

              <div className="btn-group-row">
                <button onClick={() => setStep('cible')} className="btn-arcade btn-arcade-secondary flex-1" style={{ fontSize: '10px', padding: '14px' }}>
                  ◀ RETOUR
                </button>
                <button
                  onClick={handleCrimeSubmit}
                  className="btn-arcade btn-arcade-primary flex-1"
                >
                  SUIVANT ▶
                </button>
              </div>
            </div>
          )}

          {/* ==================== ETAPE 4: CHOIX ARME ==================== */}
          {step === 'arme' && (
            <div className="bounce-in">
              <div className="text-center mb-8">
                <span className="text-3xl mb-3 block animate-float">🥧</span>
                <h2 className="font-arcade text-[10px] text-[#ff6600] glow-orange">
                  CHOISIS TON ARME
                </h2>
              </div>

              <div className="section">
                <div className="grid grid-cols-3 gap-3">
                  {tarteOptions.map((tarte) => (
                    <button
                      key={tarte.type}
                      onClick={() => handleTarteSelect(tarte.type)}
                      className="tarte-card text-center"
                    >
                      <div className="text-4xl mb-3" style={{ filter: `drop-shadow(0 0 10px ${tarte.color})` }}>
                        {tarte.icon}
                      </div>
                      <h3 className="text-white font-arcade text-[7px] mb-2">{tarte.name}</h3>
                      <p className="text-white/40 text-[8px]">{tarte.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => setStep('crime')} className="w-full mt-8 text-white/40 hover:text-white text-xs text-center py-2">
                ◀ RETOUR
              </button>
            </div>
          )}

          {/* ==================== ETAPE 5: ANIMATION SPLAT ==================== */}
          {step === 'animation' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className={`relative ${animationPhase === 'splat' ? 'animate-shake' : ''}`}>
                <div className="text-8xl relative">
                  🎯
                  {animationPhase === 'throw' && (
                    <span className="absolute inset-0 flex items-center justify-center text-6xl tarte-fly">
                      {selectedTarte?.icon || '🥧'}
                    </span>
                  )}
                  {(animationPhase === 'splat' || animationPhase === 'done') && (
                    <span className="absolute inset-0 flex items-center justify-center text-8xl splat-effect">
                      💥
                    </span>
                  )}
                </div>

                {(animationPhase === 'splat' || animationPhase === 'done') && (
                  <div className="text-center mt-4 splat-effect">
                    <h2 className="font-title text-5xl text-[#ffff00] glow-yellow" style={{ WebkitTextStroke: '2px #ff6600' }}>
                      SPLATTTT !
                    </h2>
                    <p className="font-arcade text-[8px] text-[#39ff14] glow-green mt-2">
                      +100 POINTS
                    </p>
                  </div>
                )}
              </div>

              {animationPhase === 'splat' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute particle text-2xl"
                      style={{
                        left: '50%',
                        top: '40%',
                        '--tx': `${(Math.random() - 0.5) * 200}px`,
                        '--ty': `${(Math.random() - 0.5) * 200}px`,
                      } as React.CSSProperties}
                    >
                      {['💦', '✨', selectedTarte?.icon || '🥧'][i % 3]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== ETAPE 6: RESULTAT ==================== */}
          {step === 'resultat' && (
            <div className="bounce-in">
              <div className="text-center mb-8">
                <span className="text-4xl mb-3 block animate-pulse-neon">🎉</span>
                <h2 className="font-arcade text-xs text-[#39ff14] glow-green">
                  TARTE ENVOYÉE !
                </h2>
              </div>

              {/* Resume */}
              <div className="section">
                <div className="bg-black/40 rounded-lg p-5 border border-[#ff6600]/30">
                  <div className="space-y-3 text-sm">
                    <p><span className="text-white/50">🎯 Cible:</span> <span className="text-[#ff6600]">{tarteData.targetNickname}</span></p>
                    <p><span className="text-white/50">📝 Crime:</span> <span className="text-white/80">{tarteData.crimeDescription.slice(0, 80)}...</span></p>
                    <p><span className="text-white/50">🥧 Arme:</span> <span className="text-white">{selectedTarte?.icon} {selectedTarte?.name}</span></p>
                  </div>
                </div>
              </div>

              {!publishSuccess ? (
                <div className="btn-group">
                  <button
                    onClick={() => handlePublish(true)}
                    disabled={isPublishing}
                    className="btn-arcade btn-arcade-primary w-full"
                  >
                    {isPublishing ? '⏳...' : '📤 PUBLIER'}
                  </button>
                  <button
                    onClick={() => handlePublish(false)}
                    disabled={isPublishing}
                    className="btn-arcade btn-arcade-secondary w-full" style={{ fontSize: '10px' }}
                  >
                    🔒 GARDER PRIVÉ
                  </button>
                </div>
              ) : (
                <div className="btn-group">
                  <div className="bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-lg p-4 text-center">
                    <span className="text-2xl">✅</span>
                    <p className="text-[#39ff14] text-sm font-bold mt-2">Publié !</p>
                  </div>
                  <Link href="/games/la-tarte/mur" className="btn-arcade btn-arcade-primary w-full inline-block text-center">
                    👀 VOIR LE MUR
                  </Link>
                </div>
              )}

              <button onClick={resetGame} className="w-full mt-8 text-white/40 hover:text-white text-xs text-center py-2">
                🥧 REJOUER
              </button>
            </div>
          )}

        </div>

        {/* INSERT COIN */}
        <div className="insert-coin font-arcade text-[8px] text-[#ff00ff]/50 animate-pulse">
          INSERT COIN TO CONTINUE
        </div>
      </div>

      {/* ==================== POPUP MODERATION ==================== */}
      {showModerationPopup && moderationMessage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => moderationMessage.type !== 'insult' && setShowModerationPopup(false)}>
          <div className="arcade-frame p-6 max-w-sm w-full bounce-in" style={{
            borderColor: moderationMessage.type === 'blocked' ? '#ff3131' : moderationMessage.type === 'name' ? '#ffff00' : '#39ff14'
          }} onClick={(e) => e.stopPropagation()}>

            <div className="text-center mb-4">
              <span className="text-5xl block mb-2">
                {moderationMessage.type === 'blocked' ? '🚨' : moderationMessage.type === 'name' ? '⚠️' : '🤖'}
              </span>
              <h3 className="font-arcade text-[10px]" style={{
                color: moderationMessage.type === 'blocked' ? '#ff3131' : moderationMessage.type === 'name' ? '#ffff00' : '#39ff14'
              }}>
                {moderationMessage.type === 'blocked' ? 'STOP ! MODE BD !' : moderationMessage.type === 'name' ? 'ATTENTION !' : 'CONVERTI EN BD !'}
              </h3>
            </div>

            <div className="space-y-2 mb-4">
              {moderationMessage.suggestions.map((s, i) => (
                <p key={i} className="text-white/70 text-xs text-center">💡 {s}</p>
              ))}
            </div>

            {moderationMessage.type !== 'insult' && (
              <button onClick={() => setShowModerationPopup(false)} className="btn-arcade btn-arcade-primary w-full">
                JE MODIFIE ✍️
              </button>
            )}

            {moderationMessage.type === 'insult' && (
              <p className="text-center text-white/40 text-[8px] font-arcade animate-pulse">
                CONTINUATION...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
