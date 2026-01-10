'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient, demoMode } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Notification {
  id: string
  type: 'message' | 'bonbon' | 'match' | 'game_invite' | 'system'
  title: string
  message: string
  emoji: string
  link?: string
  from_user_id?: string
  from_user?: {
    name: string
    avatar: string
  }
  read: boolean
  created_at: string
}

interface UseNotificationsOptions {
  userId?: string
}

// Mock data pour le mode démo
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'Nouveau message',
    message: "Alex t'a envoyé un message",
    emoji: '💬',
    link: '/messages',
    from_user: { name: 'Alex', avatar: '👩‍🦰' },
    read: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'bonbon',
    title: 'Bonbon reçu !',
    message: "Sam t'a envoyé un Malabar 🍬",
    emoji: '🍬',
    link: '/messages',
    from_user: { name: 'Sam', avatar: '👨‍🦱' },
    read: false,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'match',
    title: 'Nouveau match !',
    message: 'Tu as matché avec Jordan au Manège',
    emoji: '💕',
    link: '/messages',
    from_user: { name: 'Jordan', avatar: '🧑' },
    read: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'game_invite',
    title: 'Invitation à jouer',
    message: "Marie t'invite au Jeu de l'Oie",
    emoji: '🎲',
    link: '/games/jeu-oie',
    from_user: { name: 'Marie', avatar: '👩' },
    read: true,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function useNotifications(options: UseNotificationsOptions = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseClient()
  const userId = options.userId

  // Formater le temps relatif
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

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    if (demoMode || !supabase || !userId) {
      setNotifications(mockNotifications.map(n => ({
        ...n,
        time: formatTimeAgo(n.created_at)
      })))
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          from_user:profiles!notifications_from_user_id_fkey(pseudo, avatar)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      interface RawNotification {
        id: string
        type: 'message' | 'bonbon' | 'match' | 'game_invite' | 'system'
        title: string
        message: string
        emoji?: string
        link?: string
        from_user_id?: string
        from_user?: { pseudo?: string; avatar?: string }
        read_at?: string
        created_at: string
      }
      setNotifications(data?.map((n: RawNotification) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        emoji: n.emoji || '🔔',
        link: n.link,
        from_user_id: n.from_user_id,
        from_user: n.from_user ? {
          name: n.from_user.pseudo || 'Utilisateur',
          avatar: n.from_user.avatar || '👤'
        } : undefined,
        read: !!n.read_at,
        created_at: n.created_at,
      })) || [])
    } catch (err) {
      console.error('Erreur chargement notifications:', err)
      setError('Erreur de chargement')
      // Fallback vers mock data
      setNotifications(mockNotifications)
    } finally {
      setLoading(false)
    }
  }, [supabase, userId])

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )

    if (demoMode || !supabase || !userId) return

    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', userId)
    } catch (err) {
      console.error('Erreur marquage notification:', err)
    }
  }, [supabase, userId])

  // Marquer toutes comme lues
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    if (demoMode || !supabase || !userId) return

    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('read_at', null)
    } catch (err) {
      console.error('Erreur marquage toutes notifications:', err)
    }
  }, [supabase, userId])

  // Compter les non-lues
  const unreadCount = notifications.filter(n => !n.read).length

  // Setup Realtime subscription
  useEffect(() => {
    if (demoMode || !supabase || !userId) return

    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      channel = supabase
        .channel('notifications-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          async (payload: { new: Record<string, unknown> }) => {
            const newNotif = payload.new as unknown as {
              id: string
              type: 'message' | 'bonbon' | 'match' | 'game_invite' | 'system'
              title: string
              message: string
              emoji?: string
              link?: string
              from_user_id?: string
              read_at?: string
              created_at: string
            }

            // Récupérer les infos de l'expéditeur si présent
            let fromUser = undefined
            if (newNotif.from_user_id) {
              const { data } = await supabase
                .from('profiles')
                .select('pseudo, avatar')
                .eq('id', newNotif.from_user_id)
                .single()

              if (data) {
                fromUser = { name: data.pseudo || 'Utilisateur', avatar: data.avatar || '👤' }
              }
            }

            setNotifications(prev => [{
              id: newNotif.id,
              type: newNotif.type,
              title: newNotif.title,
              message: newNotif.message,
              emoji: newNotif.emoji || '🔔',
              link: newNotif.link,
              from_user_id: newNotif.from_user_id,
              from_user: fromUser,
              read: !!newNotif.read_at,
              created_at: newNotif.created_at,
            }, ...prev])
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, userId])

  // Charger au mount
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications,
  }
}
