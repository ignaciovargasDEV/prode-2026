'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService, User, UserStats, RankingUser } from '@/lib/api'

export function useCurrentUser() {
  const { user: authUser, isAuthenticated } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [ranking, setRanking] = useState<RankingUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !authUser) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Usar el usuario del contexto de autenticación y convertirlo al tipo de API
        const apiUser: User = {
          ...authUser,
          createdAt: new Date().toISOString() // Fallback temporal
        }
        setUser(apiUser)

        // Fetch stats and ranking for the authenticated user
        const [statsResponse, rankingResponse] = await Promise.all([
          apiService.getUserStats(authUser.id),
          apiService.getUserRanking(authUser.id)
        ])

        setStats(statsResponse.data)
        setRanking(rankingResponse.data)
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError(err.message || 'Error loading user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [authUser, isAuthenticated])

  const refreshUserData = async () => {
    if (!authUser) return
    
    try {
      const [statsResponse, rankingResponse] = await Promise.all([
        apiService.getUserStats(authUser.id),
        apiService.getUserRanking(authUser.id)
      ])

      setStats(statsResponse.data)
      setRanking(rankingResponse.data)
    } catch (err: any) {
      console.error('Error refreshing user data:', err)
    }
  }

  return {
    user,
    stats,
    ranking,
    loading,
    error,
    refreshUserData,
    userId: authUser?.id || null
  }
}
