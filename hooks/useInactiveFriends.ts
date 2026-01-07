/**
 * Hook pour récupérer les amis inactifs
 * "L'amitié, ça s'entretient" - Déli Délo
 */

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient, demoMode } from '@/lib/supabase'

export interface InactiveFriend {
  id: string
  name: string
  avatar: string
  lastInteraction: string      // Format lisible: "1 mois", "3 semaines"
  daysInactive: number
  lastGame: string | null
  lastGameName: string | null
}

// Données de démo quand Supabase n'est pas configuré
const mockInactiveFriends: InactiveFriend[] = [
  {
    id: '1',
    name: 'Marie',
    avatar: '👩‍🦰',
    lastInteraction: '1 mois',
    daysInactive: 32,
    lastGame: 'manege',
    lastGameName: 'Le Manège',
  },
  {
    id: '2',
    name: 'Lucas',
    avatar: '🧔',
    lastInteraction: '3 semaines',
    daysInactive: 21,
    lastGame: 'jeu-oie',
    lastGameName: 'Jeu de l\'Oie',
  },
]

// Seuils pour les messages
const THRESHOLDS = {
  MILD: 14,      // 2 semaines
  MODERATE: 30,  // 1 mois
  CRITICAL: 60,  // 2 mois
}

/**
 * Formate un nombre de jours en texte lisible
 */
function formatDaysAgo(days: number): string {
  if (days < 7) {
    return `${days} jour${days > 1 ? 's' : ''}`
  } else if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} semaine${weeks > 1 ? 's' : ''}`
  } else {
    const months = Math.floor(days / 30)
    return `${months} mois`
  }
}

/**
 * Retourne un message personnalisé selon le délai
 */
export function getInactivityMessage(friend: InactiveFriend): string {
  const { daysInactive, name, lastGameName } = friend

  if (daysInactive >= THRESHOLDS.CRITICAL) {
    return `Tu te souviens de ${name} ? Ça fait ${friend.lastInteraction}...`
  } else if (daysInactive >= THRESHOLDS.MODERATE) {
    return `Déjà ${friend.lastInteraction} que tu n'as pas joué avec ${name}`
  } else {
    return `Ça fait un moment que tu n'as pas vu ${name} !`
  }
}

/**
 * Hook principal pour récupérer les amis inactifs
 */
export function useInactiveFriends(userId?: string, daysThreshold: number = 14) {
  const [friends, setFriends] = useState<InactiveFriend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInactiveFriends = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Mode démo si Supabase n'est pas configuré ou pas d'userId
      if (demoMode || !userId) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500))
        setFriends(mockInactiveFriends)
        return
      }

      const supabase = getSupabaseClient()
      if (!supabase) {
        setFriends(mockInactiveFriends)
        return
      }

      // Appeler la fonction Supabase
      const { data, error: rpcError } = await supabase.rpc('get_inactive_friends', {
        p_user_id: userId,
        p_days_threshold: daysThreshold,
      })

      if (rpcError) {
        console.error('Erreur get_inactive_friends:', rpcError)
        setError(rpcError.message)
        // Fallback sur les données mock en cas d'erreur
        setFriends(mockInactiveFriends)
        return
      }

      // Transformer les données
      const transformedFriends: InactiveFriend[] = (data || []).map((f: {
        friend_id: string
        friend_name: string
        friend_avatar: string
        last_interaction_at: string
        days_since_interaction: number
        last_game_slug: string | null
        total_games_played: number
      }) => ({
        id: f.friend_id,
        name: f.friend_name || 'Ami',
        avatar: f.friend_avatar || '👤',
        lastInteraction: formatDaysAgo(f.days_since_interaction),
        daysInactive: f.days_since_interaction,
        lastGame: f.last_game_slug,
        lastGameName: f.last_game_slug ? getGameName(f.last_game_slug) : null,
      }))

      setFriends(transformedFriends)
    } catch (err) {
      console.error('Erreur useInactiveFriends:', err)
      setError('Erreur lors du chargement')
      setFriends(mockInactiveFriends)
    } finally {
      setLoading(false)
    }
  }, [userId, daysThreshold])

  useEffect(() => {
    fetchInactiveFriends()
  }, [fetchInactiveFriends])

  return {
    friends,
    loading,
    error,
    refresh: fetchInactiveFriends,
  }
}

/**
 * Enregistre une interaction avec un ami
 */
export async function recordInteraction(
  userId: string,
  friendId: string,
  type: 'game_invite' | 'game_played' | 'message' | 'gift_bonbon' | 'gift_postcard' | 'gift_gif' | 'poke',
  gameSlug?: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  if (demoMode) {
    console.log('Mode démo: interaction enregistrée', { userId, friendId, type, gameSlug })
    return { success: true }
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    return { success: false, error: 'Supabase non configuré' }
  }

  try {
    const { error } = await supabase.rpc('record_interaction', {
      p_user_id: userId,
      p_friend_id: friendId,
      p_type: type,
      p_game_slug: gameSlug || null,
      p_metadata: metadata || {},
    })

    if (error) {
      console.error('Erreur record_interaction:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Erreur recordInteraction:', err)
    return { success: false, error: 'Erreur inattendue' }
  }
}

/**
 * Récupère le score de santé d'une amitié
 */
export async function getFriendshipHealth(
  userId: string,
  friendId: string
): Promise<{
  score: number
  status: 'excellent' | 'good' | 'needs_attention' | 'critical'
  daysSince: number
  suggestion: string
} | null> {
  if (demoMode) {
    return {
      score: 45,
      status: 'needs_attention',
      daysSince: 25,
      suggestion: 'Envoie-lui un petit coucou !',
    }
  }

  const supabase = getSupabaseClient()
  if (!supabase) return null

  try {
    const { data, error } = await supabase.rpc('get_friendship_health', {
      p_user_id: userId,
      p_friend_id: friendId,
    })

    if (error || !data || data.length === 0) return null

    const result = data[0]
    return {
      score: result.health_score,
      status: result.health_status as 'excellent' | 'good' | 'needs_attention' | 'critical',
      daysSince: result.days_since_last,
      suggestion: result.suggestion,
    }
  } catch {
    return null
  }
}

/**
 * Helper pour obtenir le nom d'un jeu à partir de son slug
 */
function getGameName(slug: string): string {
  const gameNames: Record<string, string> = {
    'manege': 'Le Manège',
    'jeu-oie': 'Jeu de l\'Oie',
    'la-tarte': 'La Tarte',
    'refais-la-france': 'Refais la France',
    'action-verite': 'Action ou Vérité',
    'bonbon': 'C\'est quoi ce bonbon',
    'goonies': 'Les Goonies',
    'dirty-dancing': 'Dirty Dancing',
    'temple-maudit': 'Le Temple Maudit',
    'poesie': 'La Poésie',
    'la-lettre': 'La Lettre',
  }
  return gameNames[slug] || slug
}

export default useInactiveFriends
