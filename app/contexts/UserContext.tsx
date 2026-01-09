'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { getSupabaseClient, demoMode } from '@/lib/supabase'

// Types
export type UserMode = 'love' | 'friends' | 'crew'

export interface ModeConfig {
  id: UserMode
  icon: string
  title: string
  color: string
  gradient: string
}

export const modesConfig: Record<UserMode, ModeConfig> = {
  love: {
    id: 'love',
    icon: '💕',
    title: 'Love',
    color: '#FF00FF',
    gradient: 'linear-gradient(135deg, #FF00FF 0%, #FF6B9D 100%)',
  },
  friends: {
    id: 'friends',
    icon: '🤝',
    title: 'Friends',
    color: '#00FFFF',
    gradient: 'linear-gradient(135deg, #00FFFF 0%, #00B4D8 100%)',
  },
  crew: {
    id: 'crew',
    icon: '🎉',
    title: 'Crew',
    color: '#FF6600',
    gradient: 'linear-gradient(135deg, #FF6600 0%, #FFB347 100%)',
  },
}

interface UserData {
  pseudo: string
  age: string
  city: string
  mode: UserMode
  onboardingComplete: boolean
  billes: number
  bonbons: number
  // Premium
  isPremium: boolean
  premiumUntil: string | null
  // Profil
  bio: string
  avatar: string
}

interface UserContextType {
  user: UserData
  currentMode: ModeConfig
  setMode: (mode: UserMode) => void
  setUser: (data: Partial<UserData>) => void
  isLoading: boolean
  refreshPremiumStatus: () => Promise<void>
}

const defaultUser: UserData = {
  pseudo: 'Visiteur',
  age: '',
  city: '',
  mode: 'love',
  onboardingComplete: false,
  billes: 10,
  bonbons: 10,
  isPremium: false,
  premiumUntil: null,
  bio: '',
  avatar: '👤',
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(defaultUser)
  const [isLoading, setIsLoading] = useState(true)

  // Fonction pour vérifier le statut premium depuis Supabase
  const checkPremiumFromSupabase = useCallback(async (): Promise<{ isPremium: boolean; premiumUntil: string | null }> => {
    if (demoMode) {
      // Mode démo: utiliser localStorage
      const isPremium = localStorage.getItem('userIsPremium') === 'true'
      const premiumUntil = localStorage.getItem('userPremiumUntil')
      return { isPremium, premiumUntil }
    }

    const supabase = getSupabaseClient()
    if (!supabase) {
      return { isPremium: false, premiumUntil: null }
    }

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        return { isPremium: false, premiumUntil: null }
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_premium, premium_until')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        // Vérifier si premium est toujours valide
        const isPremiumValid = profile.is_premium &&
          (!profile.premium_until || new Date(profile.premium_until) > new Date())

        return {
          isPremium: isPremiumValid,
          premiumUntil: profile.premium_until
        }
      }
    } catch (e) {
      console.error('Error checking premium status:', e)
    }

    return { isPremium: false, premiumUntil: null }
  }, [])

  // Charger depuis localStorage au montage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const mode = localStorage.getItem('userMode') as UserMode | null
        const pseudo = localStorage.getItem('userPseudo')
        const age = localStorage.getItem('userAge')
        const city = localStorage.getItem('userCity')
        const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true'
        const billes = parseInt(localStorage.getItem('userBilles') || '10', 10)
        const bonbons = parseInt(localStorage.getItem('userBonbons') || '10', 10)
        const bio = localStorage.getItem('userBio') || ''
        const avatar = localStorage.getItem('userAvatar') || '👤'

        // Vérifier statut premium
        const { isPremium, premiumUntil } = await checkPremiumFromSupabase()

        setUserState({
          pseudo: pseudo || 'Visiteur',
          age: age || '',
          city: city || '',
          mode: mode || 'love',
          onboardingComplete,
          billes,
          bonbons,
          isPremium,
          premiumUntil,
          bio,
          avatar,
        })
      } catch (e) {
        console.error('Error loading user data:', e)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [checkPremiumFromSupabase])

  const setMode = (mode: UserMode) => {
    setUserState(prev => ({ ...prev, mode }))
    localStorage.setItem('userMode', mode)
  }

  const setUser = (data: Partial<UserData>) => {
    setUserState(prev => {
      const newUser = { ...prev, ...data }

      // Sauvegarder dans localStorage
      if (data.pseudo) localStorage.setItem('userPseudo', data.pseudo)
      if (data.age) localStorage.setItem('userAge', data.age)
      if (data.city) localStorage.setItem('userCity', data.city)
      if (data.mode) localStorage.setItem('userMode', data.mode)
      if (data.onboardingComplete !== undefined) {
        localStorage.setItem('onboardingComplete', data.onboardingComplete.toString())
      }
      if (data.billes !== undefined) localStorage.setItem('userBilles', data.billes.toString())
      if (data.bonbons !== undefined) localStorage.setItem('userBonbons', data.bonbons.toString())
      if (data.isPremium !== undefined) localStorage.setItem('userIsPremium', data.isPremium.toString())
      if (data.premiumUntil !== undefined) localStorage.setItem('userPremiumUntil', data.premiumUntil || '')
      if (data.bio !== undefined) localStorage.setItem('userBio', data.bio)
      if (data.avatar !== undefined) localStorage.setItem('userAvatar', data.avatar)

      return newUser
    })
  }

  // Fonction pour rafraîchir le statut premium (appelée après paiement Stripe par ex.)
  const refreshPremiumStatus = useCallback(async () => {
    const { isPremium, premiumUntil } = await checkPremiumFromSupabase()
    setUserState(prev => ({ ...prev, isPremium, premiumUntil }))
  }, [checkPremiumFromSupabase])

  const currentMode = modesConfig[user.mode]

  return (
    <UserContext.Provider value={{ user, currentMode, setMode, setUser, isLoading, refreshPremiumStatus }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
