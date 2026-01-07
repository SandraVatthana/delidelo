'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabase'

// Types
type TarteType = 'cream' | 'lemon' | 'chocolate' | 'apple' | 'cake' | 'mud'
type ReactionType = 'bienmerite' | 'solidaire' | 'mdr' | 'pareil'
type ReportReason = 'real_name' | 'threat' | 'harassment' | 'hate' | 'other'

interface Tarte {
  id: string
  user_id: string
  target_type: string
  target_nickname: string
  crime_description: string
  tarte_type: TarteType
  reactions_bienmerite: number
  reactions_solidaire: number
  reactions_mdr: number
  reactions_pareil: number
  is_tarte_du_jour: boolean
  created_at: string
}

interface Comment {
  id: string
  user_id: string
  content: string
  created_at: string
}

interface PareillUser {
  id: string
  message?: string
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

const tarteNames: Record<TarteType, string> = {
  cream: 'Creme classique',
  lemon: 'Citron acide',
  chocolate: 'Chocolat lourd',
  apple: 'Pommes terroir',
  cake: 'Gateau ENTIER',
  mud: 'Boue hardcore',
}

// Formater le temps relatif
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "a l'instant"
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)}min`
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `il y a ${Math.floor(seconds / 86400)}j`
  return date.toLocaleDateString('fr-FR')
}

// Donnees mock
const mockTarte: Tarte = {
  id: '1',
  user_id: 'user1',
  target_type: 'ex',
  target_nickname: 'Mon ex le 🐍',
  crime_description: "Parti avec ma meilleure amie apres 3 ans. Le combo classique du @#$%& de compet'",
  tarte_type: 'chocolate',
  reactions_bienmerite: 47,
  reactions_solidaire: 23,
  reactions_mdr: 89,
  reactions_pareil: 34,
  is_tarte_du_jour: true,
  created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
}

const mockComments: Comment[] = [
  { id: '1', user_id: 'user2', content: 'Pareil, 3 ans aussi... Courage 💪', created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
  { id: '2', user_id: 'user3', content: 'Cette tarte au chocolat est BIEN meritee ! @#$%&!', created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  { id: '3', user_id: 'user4', content: 'Le classique... Solidarite 🥧🥧🥧', created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
]

const mockPareillUsers: PareillUser[] = [
  { id: 'user2', message: 'Pareil, 3 ans aussi...' },
  { id: 'user5', message: 'Mon ex aussi est parti avec ma meilleure amie' },
  { id: 'user6', message: 'Solidarite 💪' },
]

export default function TarteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tarteId = params.id as string

  const [tarte, setTarte] = useState<Tarte | null>(null)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [pareillUsers, setPareillUsers] = useState<PareillUser[]>(mockPareillUsers)
  const [newComment, setNewComment] = useState('')
  const [userReactions, setUserReactions] = useState<ReactionType[]>([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState<ReportReason | null>(null)
  const [reportDetails, setReportDetails] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showPareillList, setShowPareillList] = useState(false)

  // Charger la tarte
  useEffect(() => {
    const loadTarte = async () => {
      setIsLoading(true)
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('tartes')
          .select('*')
          .eq('id', tarteId)
          .single()

        if (data) {
          setTarte(data)
        } else {
          // Utiliser mock si pas trouve
          setTarte(mockTarte)
        }

        // Charger les commentaires
        const { data: commentsData } = await supabase
          .from('tarte_comments')
          .select('*')
          .eq('tarte_id', tarteId)
          .order('created_at', { ascending: false })

        if (commentsData && commentsData.length > 0) {
          setComments(commentsData)
        }
      } catch (error) {
        console.error('Erreur chargement:', error)
        setTarte(mockTarte)
      }
      setIsLoading(false)
    }

    loadTarte()
  }, [tarteId])

  // Gerer une reaction
  const handleReact = async (reaction: ReactionType) => {
    if (!tarte) return

    const hasReacted = userReactions.includes(reaction)
    const newReactions = hasReacted
      ? userReactions.filter(r => r !== reaction)
      : [...userReactions, reaction]

    setUserReactions(newReactions)

    // Mettre a jour le compteur local
    const key = `reactions_${reaction}` as keyof Tarte
    const currentCount = tarte[key] as number
    setTarte({
      ...tarte,
      [key]: hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1
    })

    // Si c'est "pareil", afficher la liste
    if (reaction === 'pareil' && !hasReacted) {
      setShowPareillList(true)
    }
  }

  // Poster un commentaire
  const handlePostComment = async () => {
    if (!newComment.trim() || !tarte) return

    const comment: Comment = {
      id: Date.now().toString(),
      user_id: 'current_user',
      content: newComment,
      created_at: new Date().toISOString()
    }

    setComments([comment, ...comments])
    setNewComment('')

    // Envoyer a Supabase
    try {
      const supabase = getSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await supabase.from('tarte_comments').insert({
          tarte_id: tarte.id,
          user_id: user.id,
          content: newComment
        })
      }
    } catch (error) {
      console.error('Erreur commentaire:', error)
    }
  }

  // Signaler la tarte
  const handleReport = async () => {
    if (!reportReason || !tarte) return

    try {
      const supabase = getSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await supabase.from('tarte_reports').insert({
          tarte_id: tarte.id,
          reporter_user_id: user.id,
          reason: reportReason,
          details: reportDetails
        })
      }

      setShowReportModal(false)
      setReportReason(null)
      setReportDetails('')
      alert('Merci pour ton signalement ! On va regarder ca.')
    } catch (error) {
      console.error('Erreur signalement:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A0033] to-[#330066] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-pulse">🥧</span>
          <p className="text-white/60 mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!tarte) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A0033] to-[#330066] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🤷</span>
          <p className="text-white/60 mt-4">Tarte introuvable</p>
          <Link href="/games/la-tarte/mur" className="text-[#FF00FF] mt-4 block">
            ← Retour au mur
          </Link>
        </div>
      </div>
    )
  }

  const totalReactions = tarte.reactions_bienmerite + tarte.reactions_solidaire + tarte.reactions_mdr + tarte.reactions_pareil

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A0033] to-[#330066]">
      <style jsx>{`
        .card-tarte {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 102, 0, 0.3);
          border-radius: 16px;
        }
        .reaction-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
          transition: all 0.2s;
          text-align: center;
        }
        .reaction-btn:hover {
          border-color: rgba(255, 102, 0, 0.5);
          background: rgba(255, 102, 0, 0.1);
        }
        .reaction-btn.active {
          border-color: #39FF14;
          background: rgba(57, 255, 20, 0.2);
        }
        .comment-input {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          padding: 12px 20px;
          color: white;
          width: 100%;
        }
        .comment-input:focus {
          outline: none;
          border-color: #FF6600;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .modal-content {
          background: #1A0033;
          border: 2px solid #FF6600;
          border-radius: 16px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 p-4 sticky top-0 bg-gradient-to-b from-[#1A0033] to-transparent">
        <div className="h-1 bg-gradient-to-r from-[#FF6600] via-[#FF00FF] to-[#FFFF00] mb-4" />
        <div className="flex items-center justify-between">
          <Link href="/games/la-tarte/mur" className="text-white/60 hover:text-white transition flex items-center gap-2">
            <span>←</span>
            <span className="text-sm">Retour au mur</span>
          </Link>
          <button
            onClick={() => setShowReportModal(true)}
            className="text-white/40 hover:text-[#FF3131] text-sm flex items-center gap-1"
          >
            🚩 Signaler
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8 max-w-2xl mx-auto w-full">

        {/* Tarte Card */}
        <div className="card-tarte p-6 mb-6 relative">
          {tarte.is_tarte_du_jour && (
            <div className="absolute -top-3 -right-3 bg-[#FFFF00] text-[#1A0033] px-3 py-1 rounded-full text-xs font-bold">
              👑 TARTE DU JOUR
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6600] to-[#FF00FF] flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="text-white/60 text-sm">{formatTimeAgo(tarte.created_at)}</p>
              <p className="text-white/40 text-xs capitalize">{tarte.target_type}</p>
            </div>
            <div className="ml-auto text-3xl">
              {tarteIcons[tarte.tarte_type]}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-[#FF6600] font-bold text-xl mb-3">🎯 {tarte.target_nickname}</p>
            <p className="text-white text-lg leading-relaxed">{tarte.crime_description}</p>
          </div>

          <div className="p-3 rounded-lg mb-4" style={{ background: 'rgba(255, 102, 0, 0.1)' }}>
            <p className="text-white/60 text-sm">
              Arme : <span className="text-[#FF6600]">{tarteIcons[tarte.tarte_type]} {tarteNames[tarte.tarte_type]}</span>
            </p>
          </div>

          <div className="text-center py-3 rounded-lg" style={{ background: 'rgba(255, 255, 0, 0.1)', border: '2px solid rgba(255, 255, 0, 0.3)' }}>
            <span className="text-2xl">💥</span>
            <span className="text-[#FFFF00] font-bold ml-2" style={{ fontFamily: 'Bangers, cursive' }}>
              {totalReactions} reactions
            </span>
          </div>
        </div>

        {/* Reactions */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <button
            onClick={() => handleReact('bienmerite')}
            className={`reaction-btn ${userReactions.includes('bienmerite') ? 'active' : ''}`}
          >
            <span className="text-2xl block">🎯</span>
            <span className="text-white/60 text-sm">{tarte.reactions_bienmerite}</span>
            <p className="text-white/40 text-xs mt-1">Bien merite</p>
          </button>
          <button
            onClick={() => handleReact('solidaire')}
            className={`reaction-btn ${userReactions.includes('solidaire') ? 'active' : ''}`}
          >
            <span className="text-2xl block">🥧</span>
            <span className="text-white/60 text-sm">+{tarte.reactions_solidaire}</span>
            <p className="text-white/40 text-xs mt-1">J'en rajoute</p>
          </button>
          <button
            onClick={() => handleReact('mdr')}
            className={`reaction-btn ${userReactions.includes('mdr') ? 'active' : ''}`}
          >
            <span className="text-2xl block">😂</span>
            <span className="text-white/60 text-sm">{tarte.reactions_mdr}</span>
            <p className="text-white/40 text-xs mt-1">MDR</p>
          </button>
          <button
            onClick={() => handleReact('pareil')}
            className={`reaction-btn ${userReactions.includes('pareil') ? 'active' : ''}`}
          >
            <span className="text-2xl block">🤝</span>
            <span className="text-white/60 text-sm">{tarte.reactions_pareil}</span>
            <p className="text-white/40 text-xs mt-1">Pareil...</p>
          </button>
        </div>

        {/* Liste des Pareil */}
        {showPareillList && (
          <div className="card-tarte p-4 mb-6" style={{ borderColor: 'rgba(57, 255, 20, 0.3)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#39FF14] font-bold">🤝 {tarte.reactions_pareil} personnes se reconnaissent</h3>
              <button onClick={() => setShowPareillList(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              {pareillUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] flex items-center justify-center text-sm">
                    👤
                  </div>
                  <p className="text-white/80 text-sm flex-1">{user.message || 'Se reconnait dans cette histoire'}</p>
                  <button className="text-[#FF00FF] text-xs hover:text-white">💬 Discuter</button>
                </div>
              ))}
            </div>
            <p className="text-center text-white/40 text-xs mt-4">
              C'est ICI que le lien se cree ! Les "Pareil" deviennent des conversations 💬
            </p>
          </div>
        )}

        {/* Commentaires */}
        <div className="mb-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            💬 Commentaires ({comments.length})
          </h3>

          {/* Nouveau commentaire */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="comment-input flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
            />
            <button
              onClick={handlePostComment}
              disabled={!newComment.trim()}
              className="bg-[#FF6600] text-white px-4 py-2 rounded-full disabled:opacity-50"
            >
              Envoyer
            </button>
          </div>

          {/* Liste des commentaires */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6600] to-[#FF00FF] flex items-center justify-center text-xs">
                    👤
                  </div>
                  <span className="text-white/40 text-xs">{formatTimeAgo(comment.created_at)}</span>
                </div>
                <p className="text-white/90">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Modal Signalement */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[#FF3131] font-bold text-lg mb-4">🚩 Signaler ce contenu</h3>
            <p className="text-white/60 text-sm mb-4">Pourquoi signales-tu cette tarte ?</p>

            <div className="space-y-2 mb-4">
              {[
                { value: 'real_name' as ReportReason, label: 'Contient un vrai nom / donnees personnelles' },
                { value: 'threat' as ReportReason, label: 'Menace / appel a la violence' },
                { value: 'harassment' as ReportReason, label: 'Harcelement cible' },
                { value: 'hate' as ReportReason, label: 'Contenu haineux (racisme, sexisme, etc.)' },
                { value: 'other' as ReportReason, label: 'Autre' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setReportReason(option.value)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    reportReason === option.value
                      ? 'bg-[#FF3131]/20 border-2 border-[#FF3131]'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <span className="text-white/80 text-sm">{option.label}</span>
                </button>
              ))}
            </div>

            {reportReason === 'other' && (
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Precisions..."
                className="w-full p-3 rounded-lg bg-white/5 border-2 border-white/10 text-white placeholder-white/40 mb-4 resize-none"
                rows={3}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 p-3 rounded-lg bg-white/10 text-white/60"
              >
                Annuler
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="flex-1 p-3 rounded-lg bg-[#FF3131] text-white disabled:opacity-50"
              >
                Signaler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
