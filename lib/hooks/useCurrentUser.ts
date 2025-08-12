'use client'

import { useState, useEffect } from 'react'
import { apiService, User, UserStats, RankingUser } from '@/lib/api'

export function useCurrentUser() {
  // Por ahora usaremos un usuario hardcodeado hasta implementar auth
  // En una implementación real, esto vendría del sistema de autenticación
  const CURRENT_USER_ID = '1' // Usamos un ID simple que coincida con el seed

  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [ranking, setRanking] = useState<RankingUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Primero intentamos obtener todos los usuarios para conseguir un ID válido
        const usersResponse = await apiService.getUsers()
        if (usersResponse.data.length === 0) {
          throw new Error('No users found in database')
        }
        
        // Usar el primer usuario disponible
        const firstUser = usersResponse.data[0]
        const actualUserId = firstUser.id

        // Fetch user data, stats, and ranking in parallel
        const [userResponse, statsResponse, rankingResponse] = await Promise.all([
          apiService.getUserById(actualUserId),
          apiService.getUserStats(actualUserId),
          apiService.getUserRanking(actualUserId)
        ])

        setUser(userResponse.data)
        setStats(statsResponse.data)
        setRanking(rankingResponse.data)
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError(err.message || 'Error loading user data')
        
        // Si no tenemos usuarios, crear uno por defecto
        if (err.message === 'No users found in database') {
          try {
            const newUser = await apiService.createUser({
              email: 'usuario@empresa.com',
              nombre: 'Usuario',
              apellido: 'Demo', 
              area: 'Tecnología'
            })
            setUser(newUser.data)
            setError(null)
          } catch (createErr: any) {
            console.error('Error creating default user:', createErr)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const refreshUserData = async () => {
    if (!user) return
    
    try {
      const [statsResponse, rankingResponse] = await Promise.all([
        apiService.getUserStats(user.id),
        apiService.getUserRanking(user.id)
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
    userId: user?.id || null
  }
}
