'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient, demoMode } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'bonbon' | 'gif' | 'postcard' | 'system'
  metadata: Record<string, unknown>
  created_at: string
  is_mine: boolean
}

export interface Conversation {
  id: string
  other_user_id: string
  other_user_name: string
  other_user_avatar: string
  matched_game: string | null
  last_message: string | null
  last_message_at: string
  unread_count: number
  is_online: boolean
}

interface UseMessagesOptions {
  userId?: string
}

// Mock data pour le mode démo
const mockConversations: Conversation[] = [
  {
    id: '1',
    other_user_id: 'user1',
    other_user_name: 'Alex',
    other_user_avatar: '👩‍🦰',
    matched_game: 'Manège',
    last_message: 'Haha trop bien le jeu !',
    last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unread_count: 2,
    is_online: true,
  },
  {
    id: '2',
    other_user_id: 'user2',
    other_user_name: 'Sam',
    other_user_avatar: '👨‍🦱',
    matched_game: "Jeu de l'Oie",
    last_message: 'On refait une partie ?',
    last_message_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    is_online: false,
  },
  {
    id: '3',
    other_user_id: 'user3',
    other_user_name: 'Jordan',
    other_user_avatar: '🧑',
    matched_game: 'Action ou Vérité',
    last_message: "C'était vraiment fun !",
    last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    is_online: true,
  },
]

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', conversation_id: '1', sender_id: 'user1', content: 'Hey ! On a matché sur le Manège !', message_type: 'text', metadata: {}, created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), is_mine: false },
    { id: '2', conversation_id: '1', sender_id: 'me', content: "Ouiii trop bien ! Tes réponses m'ont fait rire", message_type: 'text', metadata: {}, created_at: new Date(Date.now() - 28 * 60 * 1000).toISOString(), is_mine: true },
    { id: '3', conversation_id: '1', sender_id: 'user1', content: 'La question sur le red flag était trop drôle', message_type: 'text', metadata: {}, created_at: new Date(Date.now() - 27 * 60 * 1000).toISOString(), is_mine: false },
    { id: '4', conversation_id: '1', sender_id: 'user1', content: 'Haha trop bien le jeu !', message_type: 'text', metadata: {}, created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), is_mine: false },
  ],
  '2': [
    { id: '5', conversation_id: '2', sender_id: 'user2', content: "Belle partie au Jeu de l'Oie !", message_type: 'text', metadata: {}, created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), is_mine: false },
    { id: '6', conversation_id: '2', sender_id: 'me', content: "Oui c'était cool !", message_type: 'text', metadata: {}, created_at: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(), is_mine: true },
    { id: '7', conversation_id: '2', sender_id: 'user2', content: 'On refait une partie ?', message_type: 'text', metadata: {}, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), is_mine: false },
  ],
  '3': [
    { id: '8', conversation_id: '3', sender_id: 'user3', content: "C'était vraiment fun !", message_type: 'text', metadata: {}, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), is_mine: false },
  ],
}

export function useMessages(options: UseMessagesOptions = {}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseClient()
  const userId = options.userId

  // Charger les conversations
  const loadConversations = useCallback(async () => {
    if (demoMode || !supabase || !userId) {
      setConversations(mockConversations)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.rpc('get_conversations_with_unread', {
        p_user_id: userId
      })

      if (error) throw error

      setConversations(data?.map((c: Record<string, unknown>) => ({
        id: c.conversation_id,
        other_user_id: c.other_user_id,
        other_user_name: c.other_user_name,
        other_user_avatar: c.other_user_avatar,
        matched_game: c.matched_game,
        last_message: c.last_message,
        last_message_at: c.last_message_at,
        unread_count: Number(c.unread_count),
        is_online: Boolean(c.is_online),
      })) || [])
    } catch (err) {
      console.error('Erreur chargement conversations:', err)
      setError('Erreur de chargement')
      // Fallback vers mock data
      setConversations(mockConversations)
    } finally {
      setLoading(false)
    }
  }, [supabase, userId])

  // Charger les messages d'une conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (demoMode || !supabase || !userId) {
      setMessages(mockMessages[conversationId] || [])
      return
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data?.map((m: Message & { sender_id: string }) => ({
        ...m,
        is_mine: m.sender_id === userId
      })) || [])

      // Marquer comme lu
      await supabase.rpc('mark_conversation_read', {
        p_conversation_id: conversationId,
        p_user_id: userId
      })

      // Mettre à jour le compteur local
      setConversations(prev =>
        prev.map(c => c.id === conversationId ? { ...c, unread_count: 0 } : c)
      )
    } catch (err) {
      console.error('Erreur chargement messages:', err)
      // Fallback vers mock data
      setMessages(mockMessages[conversationId] || [])
    }
  }, [supabase, userId])

  // Envoyer un message
  const sendMessage = useCallback(async (
    content: string,
    messageType: 'text' | 'bonbon' | 'gif' | 'postcard' = 'text',
    metadata: Record<string, unknown> = {}
  ) => {
    if (!activeConversationId) return null

    if (demoMode || !supabase || !userId) {
      // Mode démo : ajouter le message localement
      const newMessage: Message = {
        id: `demo-${Date.now()}`,
        conversation_id: activeConversationId,
        sender_id: 'me',
        content,
        message_type: messageType,
        metadata,
        created_at: new Date().toISOString(),
        is_mine: true,
      }
      setMessages(prev => [...prev, newMessage])

      // Mettre à jour la conversation
      setConversations(prev =>
        prev.map(c => c.id === activeConversationId
          ? { ...c, last_message: content, last_message_at: new Date().toISOString() }
          : c
        )
      )
      return newMessage.id
    }

    try {
      const { data, error } = await supabase.rpc('send_message', {
        p_conversation_id: activeConversationId,
        p_sender_id: userId,
        p_content: content,
        p_message_type: messageType,
        p_metadata: metadata
      })

      if (error) throw error
      return data
    } catch (err) {
      console.error('Erreur envoi message:', err)
      setError('Erreur d\'envoi')
      return null
    }
  }, [activeConversationId, supabase, userId])

  // Sélectionner une conversation
  const selectConversation = useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId)
    if (conversationId) {
      loadMessages(conversationId)
    } else {
      setMessages([])
    }
  }, [loadMessages])

  // Compter les messages non-lus total
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0)

  // Setup Realtime subscription
  useEffect(() => {
    if (demoMode || !supabase || !userId) return

    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      channel = supabase
        .channel('messages-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          (payload: { new: Record<string, unknown> }) => {
            const newMessage = payload.new as unknown as Message & { sender_id: string }

            // Si c'est un message dans la conversation active
            if (newMessage.conversation_id === activeConversationId) {
              setMessages(prev => [
                ...prev,
                { ...newMessage, is_mine: newMessage.sender_id === userId }
              ])
            }

            // Mettre à jour la liste des conversations
            setConversations(prev =>
              prev.map(c => {
                if (c.id === newMessage.conversation_id) {
                  return {
                    ...c,
                    last_message: newMessage.content,
                    last_message_at: newMessage.created_at,
                    unread_count: newMessage.sender_id !== userId && c.id !== activeConversationId
                      ? c.unread_count + 1
                      : c.unread_count
                  }
                }
                return c
              })
            )
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
  }, [supabase, userId, activeConversationId])

  // Charger les conversations au mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return {
    conversations,
    messages,
    activeConversationId,
    activeConversation: conversations.find(c => c.id === activeConversationId) || null,
    loading,
    error,
    totalUnread,
    selectConversation,
    sendMessage,
    refreshConversations: loadConversations,
  }
}
