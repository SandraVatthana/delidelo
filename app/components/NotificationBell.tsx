'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'message' | 'bonbon' | 'match' | 'game_invite' | 'system'
  title: string
  message: string
  emoji: string
  time: string
  read: boolean
  link?: string
  fromUser?: {
    name: string
    avatar: string
  }
}

interface NotificationBellProps {
  notifications?: Notification[]
  onNotificationRead?: (id: string) => void
  onAllRead?: () => void
}

export default function NotificationBell({
  notifications: externalNotifications,
  onNotificationRead,
  onAllRead
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Utiliser les notifications externes ou les données mock
  useEffect(() => {
    if (externalNotifications) {
      setNotifications(externalNotifications)
    } else {
      // Mock notifications pour demo
      setNotifications([
        {
          id: '1',
          type: 'message',
          title: 'Nouveau message',
          message: 'Alex t\'a envoyé un message',
          emoji: '💬',
          time: 'il y a 5 min',
          read: false,
          link: '/messages',
          fromUser: { name: 'Alex', avatar: '👩‍🦰' }
        },
        {
          id: '2',
          type: 'bonbon',
          title: 'Bonbon reçu !',
          message: 'Sam t\'a envoyé un Malabar 🍬',
          emoji: '🍬',
          time: 'il y a 1h',
          read: false,
          link: '/messages',
          fromUser: { name: 'Sam', avatar: '👨‍🦱' }
        },
        {
          id: '3',
          type: 'match',
          title: 'Nouveau match !',
          message: 'Tu as matché avec Jordan au Manège',
          emoji: '💕',
          time: 'il y a 2h',
          read: true,
          link: '/messages',
          fromUser: { name: 'Jordan', avatar: '🧑' }
        },
        {
          id: '4',
          type: 'game_invite',
          title: 'Invitation à jouer',
          message: 'Marie t\'invite au Jeu de l\'Oie',
          emoji: '🎲',
          time: 'hier',
          read: true,
          link: '/games/jeu-oie',
          fromUser: { name: 'Marie', avatar: '👩' }
        },
      ])
    }
  }, [externalNotifications])

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    onNotificationRead?.(id)
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    onAllRead?.()
  }

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return { borderColor: '#FF00FF', bgColor: 'rgba(255, 0, 255, 0.1)' }
      case 'bonbon':
        return { borderColor: '#FF6B9D', bgColor: 'rgba(255, 107, 157, 0.1)' }
      case 'match':
        return { borderColor: '#FF00FF', bgColor: 'rgba(255, 0, 255, 0.15)' }
      case 'game_invite':
        return { borderColor: '#00FFFF', bgColor: 'rgba(0, 255, 255, 0.1)' }
      case 'system':
      default:
        return { borderColor: '#39FF14', bgColor: 'rgba(57, 255, 20, 0.1)' }
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg transition hover:bg-white/10"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
      >
        <span className="text-2xl" style={{ filter: unreadCount > 0 ? 'drop-shadow(0 0 8px #FF00FF)' : 'none' }}>
          🔔
        </span>

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-bold text-white rounded-full animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #FF00FF, #FF6B9D)',
              boxShadow: '0 0 10px #FF00FF',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-hidden rounded-xl z-50"
          style={{
            background: '#1A0033',
            border: '2px solid #FF00FF',
            boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)',
          }}
        >
          {/* Header */}
          <div
            className="p-3 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.1))' }}
          >
            <h3 className="font-bold text-white flex items-center gap-2">
              🔔 Notifications
              {unreadCount > 0 && (
                <span
                  className="px-2 py-0.5 text-xs rounded-full"
                  style={{ background: '#FF00FF', color: 'white' }}
                >
                  {unreadCount} nouvelles
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#00FFFF] hover:text-white transition"
              >
                Tout lire
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[50vh] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notif => {
                const style = getNotificationStyle(notif.type)
                const content = (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className="p-3 border-b border-white/10 cursor-pointer transition hover:bg-white/5"
                    style={{
                      background: notif.read ? 'transparent' : style.bgColor,
                      borderLeft: notif.read ? '3px solid transparent' : `3px solid ${style.borderColor}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar ou Emoji */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: `2px solid ${style.borderColor}`,
                        }}
                      >
                        {notif.fromUser?.avatar || notif.emoji}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{notif.title}</span>
                          {!notif.read && (
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: '#FF00FF', boxShadow: '0 0 8px #FF00FF' }}
                            />
                          )}
                        </div>
                        <p className="text-white/70 text-sm truncate">{notif.message}</p>
                        <p className="text-white/40 text-xs mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                )

                return notif.link ? (
                  <Link key={notif.id} href={notif.link} onClick={() => setIsOpen(false)}>
                    {content}
                  </Link>
                ) : (
                  content
                )
              })
            ) : (
              <div className="p-8 text-center">
                <span className="text-4xl">🔕</span>
                <p className="text-white/50 mt-2">Aucune notification</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-white/10">
            <Link
              href="/messages"
              onClick={() => setIsOpen(false)}
              className="block w-full py-2 text-center text-sm text-[#00FFFF] hover:text-white transition rounded-lg hover:bg-white/5"
            >
              Voir tous les messages →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
