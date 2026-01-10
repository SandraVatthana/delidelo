'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useUser } from '../contexts/UserContext'
import { useMessages } from '@/hooks/useMessages'
import NotificationBell from '../components/NotificationBell'

const bonbonTypes = [
  { id: 'carambar', emoji: '🍬', name: 'Carambar', message: 'Un petit bonbon pour toi !', cost: 1 },
  { id: 'sucette', emoji: '🍭', name: 'Sucette', message: 'Une sucette pour ta journée !', cost: 1 },
  { id: 'bonbon-coeur', emoji: '💗', name: 'Bonbon Coeur', message: 'Tu me fais craquer...', cost: 2 },
  { id: 'fraise-tagada', emoji: '🍓', name: 'Fraise Tagada', message: 'Aussi sweet que toi !', cost: 2 },
  { id: 'chamallow', emoji: '☁️', name: 'Chamallow', message: 'Doux comme un nuage !', cost: 3 },
]

export default function MessagesPage() {
  const { user: userData, setUser } = useUser()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { conversations, messages, activeConversationId, activeConversation, loading, selectConversation, sendMessage } = useMessages()
  const [newMessage, setNewMessage] = useState('')
  const [showBonbonModal, setShowBonbonModal] = useState(false)
  const [bonbonSent, setBonbonSent] = useState<string | null>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const formatTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return "à l'instant"
    if (diffMins < 60) return `il y a ${diffMins} min`
    if (diffHours < 24) return `il y a ${diffHours}h`
    if (diffDays === 1) return 'hier'
    if (diffDays < 7) return `il y a ${diffDays} jours`
    return date.toLocaleDateString('fr-FR')
  }

  const formatMessageTime = (dateStr: string): string => new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const handleSendBonbon = async (bonbon: typeof bonbonTypes[0]) => {
    if (userData.bonbons < bonbon.cost) return
    setUser({ bonbons: userData.bonbons - bonbon.cost })
    await sendMessage(`${bonbon.emoji} ${bonbon.message}`, 'bonbon', { bonbon_id: bonbon.id })
    setBonbonSent(bonbon.emoji)
    setShowBonbonModal(false)
    setTimeout(() => setBonbonSent(null), 2000)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    await sendMessage(newMessage.trim())
    setNewMessage('')
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="bg-pattern" />
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-5">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            {activeConversationId ? (
              <>
                <button onClick={() => selectConversation(null)} className="text-[#00FFFF] font-bold">← Retour</button>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeConversation?.other_user_avatar}</span>
                  <div>
                    <div className="text-white font-bold">{activeConversation?.other_user_name}</div>
                    <div className="text-xs text-[#39FF14]">{activeConversation?.is_online ? '🟢 En ligne' : '⚫ Hors ligne'}</div>
                  </div>
                </div>
                <div className="w-16" />
              </>
            ) : (
              <>
                <Link href="/dashboard" className="logo-90s text-xl">🎠 Déli Délo</Link>
                <div className="flex items-center gap-3">
                  <span className="text-[#FF00FF] font-bold text-xl">💬 Messages</span>
                  <NotificationBell />
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="px-6 py-8" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="text-4xl animate-bounce">💬</div></div>
        ) : !activeConversationId ? (
          <>
            <h1 className="text-center text-2xl text-white mb-8">💬 Mes Conversations</h1>
            <div className="space-y-6">
              {conversations.length > 0 ? conversations.map(conv => (
                <div key={conv.id} onClick={() => selectConversation(conv.id)} className="card-90s p-6 cursor-pointer transition-all hover:scale-[1.02]" style={{ borderColor: conv.unread_count > 0 ? '#FF00FF' : 'rgba(255,255,255,0.3)' }}>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 border-3 border-[#FF00FF] rounded-full flex items-center justify-center text-3xl bg-[#330066]">{conv.other_user_avatar}</div>
                      {conv.is_online && <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#39FF14] border-2 border-[#1A0033] rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-lg">{conv.other_user_name}</span>
                        <span className="text-sm text-white/60">{formatTimeAgo(conv.last_message_at)}</span>
                      </div>
                      <p className="text-base text-white/80 truncate mb-2">{conv.last_message || 'Nouvelle conversation'}</p>
                      {conv.matched_game && <span className="text-sm text-[#00FFFF]">🎮 Match via {conv.matched_game}</span>}
                    </div>
                    {conv.unread_count > 0 && <div className="w-7 h-7 bg-[#FF00FF] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{conv.unread_count}</div>}
                  </div>
                </div>
              )) : (
                <div className="card-90s p-10 text-center">
                  <div className="text-7xl mb-6">💬</div>
                  <h3 className="text-2xl text-white mb-3">Pas encore de messages</h3>
                  <p className="text-white/60 mb-8 text-lg">Joue à des jeux pour matcher !</p>
                  <Link href="/games" className="btn-cta-primary inline-flex text-lg px-8 py-4">🎮 Voir les jeux</Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-4" style={{ minHeight: '300px' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl ${msg.is_mine ? 'bg-[#FF00FF] text-white' : 'bg-[#330066] border-2 border-[#00FFFF] text-white'}`}>
                    <p className="font-bold text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.is_mine ? 'text-white/70' : 'text-white/50'}`}>{formatMessageTime(msg.created_at)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowBonbonModal(true)} className="px-4 py-2 rounded-lg font-bold" style={{ background: 'linear-gradient(135deg, #FF00FF, #FF6B9D)', color: 'white' }}>🍬</button>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="input-90s flex-1" placeholder="Ton message..." />
              <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="btn-90s px-6">➤</button>
            </div>
            <div className="flex justify-center mt-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{ background: 'rgba(255, 0, 255, 0.15)' }}>
                <span>🍬</span><span className="text-[#FF00FF] font-bold">{userData.bonbons} bonbons</span>
              </div>
            </div>
          </>
        )}
      </main>
      {bonbonSent && <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"><div className="text-8xl animate-bounce">{bonbonSent}</div></div>}
      {showBonbonModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.8)' }} onClick={() => setShowBonbonModal(false)}>
          <div className="w-full max-w-md p-6 rounded-t-2xl sm:rounded-2xl" style={{ background: '#1A0033', border: '3px solid #FF00FF' }} onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#FF00FF' }}>🍬 Envoyer un bonbon</h3>
              <p className="text-white/60 text-sm">Montre ton intérêt avec un petit cadeau sucré !</p>
            </div>
            <div className="space-y-3">
              {bonbonTypes.map(bonbon => (
                <button key={bonbon.id} onClick={() => handleSendBonbon(bonbon)} disabled={userData.bonbons < bonbon.cost} className="w-full p-4 rounded-xl flex items-center gap-4" style={{ background: userData.bonbons >= bonbon.cost ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.3)', border: '2px solid', borderColor: userData.bonbons >= bonbon.cost ? 'rgba(255, 0, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)', opacity: userData.bonbons >= bonbon.cost ? 1 : 0.5 }}>
                  <span className="text-4xl">{bonbon.emoji}</span>
                  <div className="flex-1 text-left"><div className="font-bold text-white">{bonbon.name}</div><div className="text-sm text-white/50">{bonbon.message}</div></div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255, 0, 255, 0.2)' }}><span className="text-[#FF00FF] font-bold">{bonbon.cost}</span><span className="text-sm">🍬</span></div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowBonbonModal(false)} className="w-full mt-6 py-3 rounded-lg font-bold text-white/60 hover:text-white" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  )
}
