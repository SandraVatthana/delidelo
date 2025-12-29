'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
}

interface UserContextType {
  user: UserData
  currentMode: ModeConfig
  setMode: (mode: UserMode) => void
  setUser: (data: Partial<UserData>) => void
  isLoading: boolean
}

const defaultUser: UserData = {
  pseudo: 'Visiteur',
  age: '',
  city: '',
  mode: 'love',
  onboardingComplete: false,
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(defaultUser)
  const [isLoading, setIsLoading] = useState(true)

  // Charger depuis localStorage au montage
  useEffect(() => {
    const loadUser = () => {
      try {
        const mode = localStorage.getItem('userMode') as UserMode | null
        const pseudo = localStorage.getItem('userPseudo')
        const age = localStorage.getItem('userAge')
        const city = localStorage.getItem('userCity')
        const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true'

        setUserState({
          pseudo: pseudo || 'Visiteur',
          age: age || '',
          city: city || '',
          mode: mode || 'love',
          onboardingComplete,
        })
      } catch (e) {
        console.error('Error loading user data:', e)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

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

      return newUser
    })
  }

  const currentMode = modesConfig[user.mode]

  return (
    <UserContext.Provider value={{ user, currentMode, setMode, setUser, isLoading }}>
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
