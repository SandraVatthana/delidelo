'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Conversations simulées
const mockConversations = [
  {
    id: '1',
    name: 'Alex',
    avatar: '👩‍🦰',
    lastMessage: 'Haha trop bien le jeu !',
    time: 'il y a 2h',
    unread: 2,
    online: true,
    matchedGame: 'Manège',
  },
  {
    id: '2',
    name: 'Sam',
    avatar: '👨‍🦱',
    lastMessage: 'On refait une partie ?',
    time: 'il y a 5h',
    unread: 0,
    online: false,
    matchedGame: 'Jeu de l\'Oie',
  },
  {
    id: '3',
    name: 'Jordan',
    avatar: '🧑',
    lastMessage: 'C\'était vraiment fun !',
    time: 'hier',
    unread: 0,
    online: true,
    matchedGame: 'Action ou Vérité',
  },
]

// Messages simulés pour la conversation active
const mockMessages = [
  { id: 1, from: 'other', text: 'Hey ! On a matché sur le Manège !', time: '14:30' },
  { id: 2, from: 'me', text: 'Ouiii trop bien ! Tes réponses m\'ont fait rire', time: '14:32' },
  { id: 3, from: 'other', text: 'La question sur le red flag était trop drôle', time: '14:33' },
  { id: 4, from: 'other', text: 'Haha trop bien le jeu !', time: '14:35' },
]

export default function MessagesPage() {
  const router = useRouter()
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState(mockMessages)

  const activeChat = mockConversations.find(c => c.id === activeConversation)

  const sendMessage = () => {
    if (!newMessage.trim()) return

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        from: 'me',
        text: newMessage,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setNewMessage('')
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      <style jsx>{`
        .top-nav {
          display: none;
        }
        @media (min-width: 768px) {
          .top-nav {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
            padding-bottom: 8px;
          }
          .top-nav-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            font-size: 0.75rem;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.8);
            transition: all 0.2s;
            border: 2px solid rgba(255, 255, 255, 0.25);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
          }
          .top-nav-item:hover {
            color: #FF00FF;
            border-color: #FF00FF;
            background: rgba(255, 0, 255, 0.15);
            text-shadow: 0 0 10px #FF00FF;
            transform: translateY(-2px);
          }
          .top-nav-item.active {
            color: #FF00FF;
            border-color: #FF00FF;
            background: rgba(255, 0, 255, 0.2);
            text-shadow: 0 0 10px #FF00FF;
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
          }
          .top-nav-item .nav-emoji {
            font-size: 1.2rem;
          }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-[#FF00FF] via-[#00FFFF] to-[#39FF14]" />
        <div className="bg-[#1A0033]/95 backdrop-blur-sm px-4 py-5">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            {activeConversation ? (
              <>
                <button
                  onClick={() => setActiveConversation(null)}
                  className="text-[#00FFFF] font-bold hover:text-[#FFFF00] transition"
                >
                  ← Retour
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeChat?.avatar}</span>
                  <div>
                    <div className="text-white font-bold">{activeChat?.name}</div>
                    <div className="text-xs text-[#39FF14]">
                      {activeChat?.online ? '🟢 En ligne' : '⚫ Hors ligne'}
                    </div>
                  </div>
                </div>
                <div className="w-16" />
              </>
            ) : (
              <>
                <Link href="/dashboard" className="logo-90s text-xl">
                  <span className="animate-spin inline-block text-lg">🎠</span>
                  GameCrush
                </Link>
                <span className="text-[#FF00FF] font-bold text-xl" style={{ textShadow: '0 0 10px #FF00FF' }}>
                  💬 Messages
                </span>
              </>
            )}
          </div>

          {/* Navigation desktop uniquement */}
          {!activeConversation && (
            <nav className="max-w-5xl mx-auto mt-3">
              <div className="top-nav">
                <Link href="/dashboard" className="top-nav-item">
                  <span className="nav-emoji">🏠</span>
                  Accueil
                </Link>
                <Link href="/games/jeu-oie" className="top-nav-item">
                  <span className="nav-emoji">🎲</span>
                  Tirage
                </Link>
                <Link href="/games" className="top-nav-item">
                  <span className="nav-emoji">🎮</span>
                  JEUX
                </Link>
                <Link href="/messages" className="top-nav-item active">
                  <span className="nav-emoji">💬</span>
                  Messages
                </Link>
                <Link href="/events" className="top-nav-item" style={{ color: '#FF6600' }}>
                  <span className="nav-emoji">🍻</span>
                  Events
                </Link>
                <Link href="/invite" className="top-nav-item">
                  <span className="nav-emoji">👯</span>
                  Inviter
                </Link>
                <Link href="/profile" className="top-nav-item">
                  <span className="nav-emoji">👤</span>
                  Profil
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main className="px-6 py-8" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {!activeConversation ? (
          <>
            {/* Titre centré */}
            <h1 className="text-center text-2xl text-white mb-8" style={{ textShadow: '0 0 15px #FF00FF' }}>
              💬 Mes Conversations
            </h1>

            {/* Liste des conversations - Plus espacée */}
            <div className="space-y-6">
              {mockConversations.length > 0 ? (
                mockConversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversation(conv.id)}
                    className="card-90s p-6 cursor-pointer transition-all hover:scale-[1.02]"
                    style={{
                      borderColor: conv.unread > 0 ? '#FF00FF' : 'rgba(255,255,255,0.3)',
                      boxShadow: conv.unread > 0 ? '0 0 15px #FF00FF40' : 'none',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar plus grand - 56px */}
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 border-3 border-[#FF00FF] rounded-full flex items-center justify-center text-3xl bg-[#330066]"
                          style={{ boxShadow: '0 0 10px #FF00FF40' }}
                        >
                          {conv.avatar}
                        </div>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#39FF14] border-2 border-[#1A0033] rounded-full" />
                        )}
                      </div>

                      {/* Info - Plus d'espace */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold text-lg">{conv.name}</span>
                          <span className="text-sm text-white/60">{conv.time}</span>
                        </div>
                        <p className="text-base text-white/80 truncate mb-2">{conv.lastMessage}</p>
                        <span className="text-sm text-[#00FFFF]">🎮 Match via {conv.matchedGame}</span>
                      </div>

                      {/* Badge non lu */}
                      {conv.unread > 0 && (
                        <div
                          className="w-7 h-7 bg-[#FF00FF] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ boxShadow: '0 0 10px #FF00FF' }}
                        >
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="card-90s p-10 text-center">
                  <div className="text-7xl mb-6">💬</div>
                  <h3 className="text-2xl text-white mb-3" style={{ textShadow: '0 0 10px #FF00FF' }}>
                    Pas encore de messages
                  </h3>
                  <p className="text-white/60 mb-8 text-lg">
                    Joue à des jeux pour matcher avec d'autres joueurs !
                  </p>
                  <Link href="/games" className="btn-cta-primary inline-flex text-lg px-8 py-4">
                    🎮 Voir les jeux
                  </Link>
                </div>
              )}
            </div>

            {/* Info - Plus d'espace */}
            <div className="card-90s blue p-5 mt-8">
              <div className="flex items-start gap-4">
                <span className="text-3xl">💡</span>
                <div>
                  <p className="font-bold text-[#00FFFF] text-lg mb-1" style={{ textShadow: '0 0 10px #00FFFF' }}>
                    Mode asynchrone
                  </p>
                  <p className="text-sm text-white/70">
                    Les messages sont envoyés même si l'autre n'est pas connecté. Pas de pression !
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Zone de messages */}
            <div className="space-y-4 mb-4" style={{ minHeight: '300px' }}>
              {/* Badge du match */}
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#330066] border-2 border-[#FF00FF]"
                  style={{ boxShadow: '0 0 10px #FF00FF40' }}
                >
                  <span className="text-lg">🎮</span>
                  <span className="text-sm text-[#FF00FF] font-bold">
                    Match via {activeChat?.matchedGame}
                  </span>
                </div>
              </div>

              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 ${
                      msg.from === 'me'
                        ? 'bg-[#FF00FF] text-white'
                        : 'bg-[#330066] border-2 border-[#00FFFF] text-white'
                    }`}
                    style={{
                      boxShadow: msg.from === 'me' ? '0 0 10px #FF00FF40' : '0 0 10px #00FFFF20',
                    }}
                  >
                    <p className="font-bold text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-white/70' : 'text-white/50'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de saisie */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="input-90s flex-1"
                placeholder="Ton message..."
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="btn-90s px-6"
              >
                ➤
              </button>
            </div>

            {/* Emojis rapides */}
            <div className="flex justify-center gap-3 mt-4">
              {['😂', '❤️', '🔥', '👏', '🎮', '✨'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setNewMessage(prev => prev + emoji)}
                  className="text-2xl hover:scale-125 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
