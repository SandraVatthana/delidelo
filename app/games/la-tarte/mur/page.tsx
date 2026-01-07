'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSupabaseClient, demoMode } from '@/lib/supabase'

// Types
type TarteType = 'cream' | 'lemon' | 'chocolate' | 'apple' | 'cake' | 'mud'
type TabType = 'tendances' | 'recentes' | 'top'
type ReactionType = 'bienmerite' | 'solidaire' | 'mdr' | 'pareil'

interface Tarte {
  id: string
  user_id: string
  target_type: string
  target_nickname: string
  crime_description: string
  tarte_type: TarteType
  is_public: boolean
  reactions_bienmerite: number
  reactions_solidaire: number
  reactions_mdr: number
  reactions_pareil: number
  is_tarte_du_jour: boolean
  created_at: string
  user_reactions?: ReactionType[]
  comments_count?: number
}

// Config des tartes
const tarteIcons: Record<TarteType, string> = {
  cream: '🍰',
  lemon: '🍋',
  chocolate: '🍫',
  apple: '🥧',
  cake: '🎂',
  mud: '💩',
}

// Formater le temps relatif
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "à l'instant"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}j`
  return date.toLocaleDateString('fr-FR')
}

// Donnees fictives pour la demo
const mockTartes: Tarte[] = [
  {
    id: '1',
    user_id: 'user1',
    target_type: 'ex',
    target_nickname: 'Mon ex le 🐍',
    crime_description: "Parti avec ma meilleure amie après 3 ans. Le combo classique du @#$%& de compèt'",
    tarte_type: 'chocolate',
    is_public: true,
    reactions_bienmerite: 47,
    reactions_solidaire: 23,
    reactions_mdr: 89,
    reactions_pareil: 34,
    is_tarte_du_jour: true,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    comments_count: 12,
  },
  {
    id: '2',
    user_id: 'user2',
    target_type: 'institution',
    target_nickname: 'Les Impots 🏛️',
    crime_description: "3 ans de retard pour mon remboursement. 3 ANS. Bande de 🐌 administratifs !",
    tarte_type: 'apple',
    is_public: true,
    reactions_bienmerite: 156,
    reactions_solidaire: 89,
    reactions_mdr: 203,
    reactions_pareil: 78,
    is_tarte_du_jour: false,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    comments_count: 45,
  },
  {
    id: '3',
    user_id: 'user3',
    target_type: 'famille',
    target_nickname: 'Ma mere la 👑',
    crime_description: "Me critique depuis 1982. Cette semaine : 'Tu devrais trouver un vrai travail.' J'AI UNE STARTUP MAMAN.",
    tarte_type: 'lemon',
    is_public: true,
    reactions_bienmerite: 34,
    reactions_solidaire: 12,
    reactions_mdr: 67,
    reactions_pareil: 45,
    is_tarte_du_jour: false,
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    comments_count: 8,
  },
  {
    id: '4',
    user_id: 'user4',
    target_type: 'boss',
    target_nickname: 'Mon boss le 🦨',
    crime_description: "M'a dit que j'étais 'trop qualifié' pour la promotion. C'EST QUOI CETTE LOGIQUE DE 🥔 ?!",
    tarte_type: 'mud',
    is_public: true,
    reactions_bienmerite: 89,
    reactions_solidaire: 56,
    reactions_mdr: 120,
    reactions_pareil: 67,
    is_tarte_du_jour: false,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    comments_count: 23,
  },
  {
    id: '5',
    user_id: 'user5',
    target_type: 'ami',
    target_nickname: "L'ami le 🐀",
    crime_description: "M'a balancé mes secrets à tout le groupe WhatsApp. Triple buse 🦅 ce Raclure de bidet 🚽 !",
    tarte_type: 'cake',
    is_public: true,
    reactions_bienmerite: 78,
    reactions_solidaire: 45,
    reactions_mdr: 92,
    reactions_pareil: 56,
    is_tarte_du_jour: false,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    comments_count: 18,
  },
]

// Composant pour une carte de tarte
function TarteCard({
  tarte,
  onReact,
  userReactions = []
}: {
  tarte: Tarte,
  onReact: (tarteId: string, reaction: ReactionType) => void,
  userReactions: ReactionType[]
}) {
  const [showPareilPopup, setShowPareilPopup] = useState(false)
  const totalReactions = tarte.reactions_bienmerite + tarte.reactions_solidaire + tarte.reactions_mdr + tarte.reactions_pareil

  const getTarteLevel = () => {
    if (totalReactions > 400) return 3
    if (totalReactions > 100) return 2
    return 1
  }

  return (
    <div className="tarte-card">
      {/* Badge Tarte du jour */}
      {tarte.is_tarte_du_jour && (
        <div className="tarte-du-jour-badge">
          👑 TARTE DU JOUR
        </div>
      )}

      {/* Header: Auteur + Temps */}
      <div className="tarte-header">
        <div className="tarte-author">
          <div className="avatar">👤</div>
          <span className="time">il y a {formatTimeAgo(tarte.created_at)}</span>
        </div>
        <div className="tarte-icons">
          {[...Array(getTarteLevel())].map((_, i) => (
            <span key={i}>{tarteIcons[tarte.tarte_type]}</span>
          ))}
        </div>
      </div>

      {/* Contenu: Cible + Crime */}
      <div className="tarte-content">
        <p className="tarte-target">🎯 {tarte.target_nickname}</p>
        <p className="tarte-crime">{tarte.crime_description}</p>
      </div>

      {/* Compteurs de reactions (ligne unique) */}
      <div className="tarte-stats">
        <span>🎯 {tarte.reactions_bienmerite}</span>
        <span>🥧 +{tarte.reactions_solidaire}</span>
        <span>😂 {tarte.reactions_mdr}</span>
        <span>🤝 {tarte.reactions_pareil}</span>
        <Link href={`/games/la-tarte/mur/${tarte.id}`} className="comments-link">
          💬 {tarte.comments_count}
        </Link>
      </div>

      {/* Actions principales */}
      <div className="tarte-actions">
        <button
          onClick={() => onReact(tarte.id, 'solidaire')}
          className={`btn-action-primary ${userReactions.includes('solidaire') ? 'active' : ''}`}
        >
          🥧 J'en rajoute une !
        </button>
        <button
          onClick={() => {
            onReact(tarte.id, 'pareil')
            setShowPareilPopup(true)
            setTimeout(() => setShowPareilPopup(false), 3000)
          }}
          className={`btn-action-secondary ${userReactions.includes('pareil') ? 'active' : ''}`}
        >
          🤝 Pareil...
        </button>
      </div>

      {/* Quick reactions */}
      <div className="tarte-quick-reactions">
        <button
          onClick={() => onReact(tarte.id, 'bienmerite')}
          className={`quick-btn ${userReactions.includes('bienmerite') ? 'active' : ''}`}
        >
          🎯 Bien mérité
        </button>
        <button
          onClick={() => onReact(tarte.id, 'mdr')}
          className={`quick-btn ${userReactions.includes('mdr') ? 'active' : ''}`}
        >
          😂 MDR
        </button>
      </div>

      {/* Popup Pareil */}
      {showPareilPopup && (
        <div className="pareil-popup">
          <div className="pareil-content">
            <span className="pareil-emoji">🤝</span>
            <p className="pareil-title">Tu te reconnais !</p>
            <p className="pareil-count">
              {tarte.reactions_pareil + 1} personnes partagent cette frustration
            </p>
            <button onClick={() => setShowPareilPopup(false)} className="pareil-link">
              💬 Rejoindre la discussion
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MurDesTartesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('tendances')
  const [tartes, setTartes] = useState<Tarte[]>(mockTartes)
  const [userReactions, setUserReactions] = useState<Record<string, ReactionType[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Scroll listener pour le bouton retour en haut
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Charger les tartes depuis Supabase ou localStorage (mode démo)
  useEffect(() => {
    const loadTartes = async () => {
      setIsLoading(true)

      // En mode démo, charger depuis localStorage
      if (demoMode) {
        try {
          const demoTartes = JSON.parse(localStorage.getItem('demo_tartes') || '[]')
          // Filtrer seulement les tartes publiques
          const publicDemoTartes = demoTartes.filter((t: Tarte) => t.is_public)
          // Fusionner avec les mock tartes (démo en premier)
          setTartes([...publicDemoTartes, ...mockTartes])
        } catch (error) {
          console.error('Erreur chargement localStorage:', error)
        }
        setIsLoading(false)
        return
      }

      try {
        const supabase = getSupabaseClient()
        if (!supabase) {
          setIsLoading(false)
          return
        }
        const { data, error } = await supabase
          .from('tartes')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(50)

        if (data && data.length > 0) {
          setTartes(data)
        }
      } catch (error) {
        console.error('Erreur chargement tartes:', error)
      }
      setIsLoading(false)
    }

    loadTartes()
  }, [])

  // Gerer une reaction
  const handleReact = async (tarteId: string, reaction: ReactionType) => {
    const currentReactions = userReactions[tarteId] || []
    const hasReacted = currentReactions.includes(reaction)

    const newReactions = hasReacted
      ? currentReactions.filter(r => r !== reaction)
      : [...currentReactions, reaction]

    setUserReactions(prev => ({
      ...prev,
      [tarteId]: newReactions
    }))

    setTartes(prev => prev.map(t => {
      if (t.id === tarteId) {
        const key = `reactions_${reaction}` as keyof Tarte
        const currentCount = t[key] as number
        return {
          ...t,
          [key]: hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1
        }
      }
      return t
    }))

    // Envoyer a Supabase si pas en mode demo
    if (!demoMode) {
      try {
        const supabase = getSupabaseClient()
        if (!supabase) return
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          if (hasReacted) {
            await supabase
              .from('tarte_reactions')
              .delete()
              .eq('tarte_id', tarteId)
              .eq('user_id', user.id)
              .eq('reaction_type', reaction)
          } else {
            await supabase
              .from('tarte_reactions')
              .insert({
                tarte_id: tarteId,
                user_id: user.id,
                reaction_type: reaction
              })
          }
        }
      } catch (error) {
        console.error('Erreur reaction:', error)
      }
    }
  }

  // Filtrer les tartes selon l'onglet
  const getFilteredTartes = () => {
    switch (activeTab) {
      case 'tendances':
        return [...tartes].sort((a, b) => {
          const totalA = a.reactions_bienmerite + a.reactions_solidaire + a.reactions_mdr + a.reactions_pareil
          const totalB = b.reactions_bienmerite + b.reactions_solidaire + b.reactions_mdr + b.reactions_pareil
          return totalB - totalA
        })
      case 'recentes':
        return [...tartes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case 'top':
        return [...tartes].filter(t => {
          const total = t.reactions_bienmerite + t.reactions_solidaire + t.reactions_mdr + t.reactions_pareil
          return total > 50
        }).sort((a, b) => {
          const totalA = a.reactions_bienmerite + a.reactions_solidaire + a.reactions_mdr + a.reactions_pareil
          const totalB = b.reactions_bienmerite + b.reactions_solidaire + b.reactions_mdr + b.reactions_pareil
          return totalB - totalA
        })
      default:
        return tartes
    }
  }

  const tarteDuJour = tartes.find(t => t.is_tarte_du_jour)
  const filteredTartes = getFilteredTartes()
  const displayedCount = filteredTartes.filter(t => !(activeTab === 'tendances' && t.is_tarte_du_jour)).length

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mur-container">
      <style jsx>{`
        /* === CONTAINER === */
        .mur-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0015 0%, #1a0033 50%, #2d0052 100%);
          position: relative;
        }

        /* === BACKGROUND EFFECTS === */
        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 0, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        .scanlines {
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          z-index: 1;
        }

        /* === HEADER === */
        .mur-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: linear-gradient(180deg, #0a0015 0%, rgba(10, 0, 21, 0.95) 100%);
          border-bottom: 3px solid;
          border-image: linear-gradient(90deg, #FF6600, #FF00FF, #FFFF00) 1;
          padding: 16px;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .back-link {
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }
        .back-link:hover { color: white; }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Bangers', cursive;
        }
        .header-title .emoji { font-size: 32px; }
        .header-title .text {
          font-size: 24px;
          color: #FF6600;
          text-shadow: 0 0 20px #FF6600, 0 0 40px #FF6600;
          letter-spacing: 2px;
        }

        .header-counter {
          background: rgba(255, 102, 0, 0.2);
          border: 1px solid rgba(255, 102, 0, 0.5);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          color: #FF6600;
        }

        .btn-launch {
          background: linear-gradient(135deg, #FF6600 0%, #FF3131 100%);
          color: white;
          font-weight: bold;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 14px;
          box-shadow: 0 4px 0 #993d00, 0 0 20px rgba(255, 102, 0, 0.4);
          transition: all 0.1s;
        }
        .btn-launch:hover {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #993d00, 0 0 30px rgba(255, 102, 0, 0.6);
        }

        /* === FILTER TABS (STICKY) === */
        .filter-bar {
          position: sticky;
          top: 85px;
          z-index: 40;
          background: rgba(10, 0, 21, 0.95);
          backdrop-filter: blur(10px);
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 0, 255, 0.2);
        }

        .filter-container {
          max-width: 640px;
          margin: 0 auto;
        }

        .filter-label {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          font-family: 'Press Start 2P', monospace;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          background: rgba(0, 0, 0, 0.3);
          padding: 6px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-btn {
          flex: 1;
          padding: 10px 16px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 13px;
          transition: all 0.2s;
          text-align: center;
          white-space: nowrap;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, #FF6600 0%, #FF3131 100%);
          color: white;
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
        }
        .tab-btn:not(.active) {
          background: transparent;
          color: rgba(255,255,255,0.6);
        }
        .tab-btn:not(.active):hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        /* === MAIN CONTENT === */
        .mur-main {
          position: relative;
          z-index: 10;
          max-width: 640px;
          margin: 0 auto;
          padding: 24px 16px 100px;
        }

        /* === PROGRESS INDICATOR === */
        .progress-indicator {
          text-align: center;
          margin-bottom: 24px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }
        .progress-indicator span {
          color: #FF6600;
          font-weight: bold;
        }

        /* === TARTE DU JOUR SECTION === */
        .tarte-du-jour-section {
          margin-bottom: 32px;
        }
        .tarte-du-jour-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-family: 'Press Start 2P', monospace;
          font-size: 12px;
        }
        .tarte-du-jour-title .emoji { font-size: 20px; }
        .tarte-du-jour-title .text {
          color: #FFFF00;
          text-shadow: 0 0 15px #FFFF00;
        }

        /* === TARTE CARD === */
        .tarte-card {
          background: rgba(0, 0, 0, 0.4);
          border: 2px solid rgba(255, 102, 0, 0.2);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 48px;
          position: relative;
          transition: all 0.2s;
        }
        .tarte-card:hover {
          border-color: rgba(255, 102, 0, 0.4);
          box-shadow: 0 0 30px rgba(255, 102, 0, 0.1);
        }

        .tarte-du-jour-badge {
          position: absolute;
          top: -12px;
          right: -8px;
          background: #FFFF00;
          color: #1A0033;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
          font-family: 'Press Start 2P', monospace;
          box-shadow: 0 0 20px rgba(255, 255, 0, 0.5);
        }

        /* Card sections */
        .tarte-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .tarte-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6600, #FF00FF);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .time {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
        }
        .tarte-icons {
          display: flex;
          gap: 4px;
          font-size: 20px;
        }

        .tarte-content {
          margin-bottom: 16px;
        }
        .tarte-target {
          color: #FF6600;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 8px;
        }
        .tarte-crime {
          color: rgba(255,255,255,0.9);
          font-size: 15px;
          line-height: 1.5;
        }

        /* Stats row */
        .tarte-stats {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          margin-bottom: 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-size: 13px;
          color: rgba(255,255,255,0.6);
        }
        .tarte-stats span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .comments-link {
          margin-left: auto;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s;
        }
        .comments-link:hover {
          color: #FF00FF;
        }

        /* Actions */
        .tarte-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }
        .btn-action-primary {
          flex: 1;
          background: linear-gradient(135deg, #FF6600 0%, #FF3131 100%);
          color: white;
          font-weight: bold;
          padding: 12px 16px;
          border-radius: 25px;
          font-size: 14px;
          transition: all 0.2s;
          box-shadow: 0 3px 0 #993d00;
        }
        .btn-action-primary:hover {
          transform: translateY(1px);
          box-shadow: 0 2px 0 #993d00, 0 0 20px rgba(255, 102, 0, 0.4);
        }
        .btn-action-primary.active {
          background: linear-gradient(135deg, #39FF14 0%, #00cc00 100%);
          box-shadow: 0 3px 0 #1a8c1a, 0 0 20px rgba(57, 255, 20, 0.4);
        }

        .btn-action-secondary {
          background: transparent;
          color: #FF00FF;
          font-weight: bold;
          padding: 12px 16px;
          border-radius: 25px;
          border: 2px solid #FF00FF;
          font-size: 14px;
          transition: all 0.2s;
        }
        .btn-action-secondary:hover {
          background: rgba(255, 0, 255, 0.1);
        }
        .btn-action-secondary.active {
          background: rgba(255, 0, 255, 0.3);
          border-color: #39FF14;
          color: #39FF14;
        }

        /* Quick reactions */
        .tarte-quick-reactions {
          display: flex;
          gap: 8px;
        }
        .quick-btn {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255,255,255,0.6);
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s;
        }
        .quick-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .quick-btn.active {
          background: rgba(255, 102, 0, 0.2);
          border-color: #FF6600;
          color: #FF6600;
        }

        /* Pareil popup */
        .pareil-popup {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          animation: fadeIn 0.3s ease-out;
        }
        .pareil-content { text-align: center; padding: 24px; }
        .pareil-emoji { font-size: 48px; display: block; margin-bottom: 16px; }
        .pareil-title { color: #39FF14; font-weight: bold; font-size: 18px; margin-bottom: 8px; }
        .pareil-count { color: rgba(255,255,255,0.6); font-size: 14px; }
        .pareil-link { color: #FF00FF; font-size: 14px; margin-top: 16px; display: inline-block; }
        .pareil-link:hover { color: white; }

        /* === LOADING === */
        .loading {
          text-align: center;
          padding: 48px 0;
        }
        .loading .emoji {
          font-size: 48px;
          animation: pulse 1s ease-in-out infinite;
        }
        .loading p {
          color: rgba(255,255,255,0.6);
          margin-top: 16px;
        }

        /* === EMPTY STATE === */
        .empty-state {
          text-align: center;
          padding: 48px 0;
        }
        .empty-state .emoji { font-size: 64px; margin-bottom: 16px; }
        .empty-state p { color: rgba(255,255,255,0.6); margin-bottom: 16px; }

        /* === RULES === */
        .rules-box {
          margin-top: 40px;
          padding: 24px;
          background: rgba(255, 0, 255, 0.05);
          border: 1px dashed rgba(255, 0, 255, 0.3);
          border-radius: 16px;
          text-align: center;
        }
        .rules-title {
          color: #FF00FF;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 16px;
          font-family: 'Press Start 2P', monospace;
        }
        .rules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          font-size: 13px;
        }
        .rules-yes .label { color: #39FF14; font-weight: bold; margin-bottom: 8px; }
        .rules-no .label { color: #FF3131; font-weight: bold; margin-bottom: 8px; }
        .rules-grid p { color: rgba(255,255,255,0.6); margin: 4px 0; }
        .rules-footer { color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 16px; }

        /* === BACK TO TOP === */
        .back-to-top {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF00FF 0%, #FF6600 100%);
          color: white;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 0 #660066, 0 0 20px rgba(255, 0, 255, 0.5);
          transition: all 0.2s;
          animation: fadeIn 0.3s ease-out;
        }
        .back-to-top:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #660066, 0 0 30px rgba(255, 0, 255, 0.7);
        }

        /* === ANIMATIONS === */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* Background effects */}
      <div className="bg-grid" />
      <div className="scanlines" />

      {/* Header */}
      <header className="mur-header">
        <div className="header-top">
          <Link href="/games/la-tarte" className="back-link">
            ← Retour
          </Link>
          <div className="header-title">
            <span className="emoji">🥧</span>
            <span className="text">LE MUR DES TARTES</span>
          </div>
          <Link href="/games/la-tarte" className="btn-launch">
            🥧 Lancer
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span className="header-counter">
            🥧 {tartes.length} tartes au compteur
          </span>
        </div>
      </header>

      {/* Filter bar (sticky) */}
      <div className="filter-bar">
        <div className="filter-container">
          <p className="filter-label">Filtrer par</p>
          <div className="filter-tabs">
            <button
              onClick={() => setActiveTab('tendances')}
              className={`tab-btn ${activeTab === 'tendances' ? 'active' : ''}`}
            >
              🔥 Tendances
            </button>
            <button
              onClick={() => setActiveTab('recentes')}
              className={`tab-btn ${activeTab === 'recentes' ? 'active' : ''}`}
            >
              🕐 Récentes
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`tab-btn ${activeTab === 'top' ? 'active' : ''}`}
            >
              👑 Top
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mur-main">
        {/* Progress indicator */}
        <div className="progress-indicator">
          <span>{displayedCount}</span> tartes affichées
          {demoMode && <span style={{ color: '#FFFF00' }}> (mode demo)</span>}
        </div>

        {/* Tarte du jour */}
        {tarteDuJour && activeTab === 'tendances' && (
          <div className="tarte-du-jour-section">
            <div className="tarte-du-jour-title">
              <span className="emoji">👑</span>
              <span className="text">TARTE DU JOUR</span>
            </div>
            <TarteCard
              tarte={tarteDuJour}
              onReact={handleReact}
              userReactions={userReactions[tarteDuJour.id] || []}
            />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="loading">
            <span className="emoji">🥧</span>
            <p>Chargement des tartes...</p>
          </div>
        )}

        {/* Liste des tartes */}
        {filteredTartes
          .filter(t => !(activeTab === 'tendances' && t.is_tarte_du_jour))
          .map((tarte) => (
            <TarteCard
              key={tarte.id}
              tarte={tarte}
              onReact={handleReact}
              userReactions={userReactions[tarte.id] || []}
            />
          ))}

        {/* Empty state */}
        {!isLoading && displayedCount === 0 && (
          <div className="empty-state">
            <span className="emoji">🥧</span>
            <p>Aucune tarte pour le moment...</p>
            <Link href="/games/la-tarte" className="btn-launch">
              🥧 Lancer la première tarte
            </Link>
          </div>
        )}

        {/* Rules */}
        <div className="rules-box">
          <p className="rules-title">🎪 LES RÈGLES DE LA TARTE</p>
          <div className="rules-grid">
            <div className="rules-yes">
              <p className="label">✅ OUI</p>
              <p>Surnoms rigolos</p>
              <p>Symboles BD @#$%&!</p>
              <p>Emojis de rage 🤬💢</p>
            </div>
            <div className="rules-no">
              <p className="label">❌ NON</p>
              <p>Vrais noms complets</p>
              <p>Vraies insultes</p>
              <p>Menaces</p>
            </div>
          </div>
          <p className="rules-footer">🚨 Ici c'est CARTOON, pas TRIBUNAL.</p>
        </div>
      </main>

      {/* Back to top button */}
      {showBackToTop && (
        <button onClick={scrollToTop} className="back-to-top">
          ⬆️
        </button>
      )}
    </div>
  )
}
