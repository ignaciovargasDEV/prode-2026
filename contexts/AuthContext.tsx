'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { apiService } from '@/lib/api'

interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  area: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  nombre: string
  apellido: string
  area: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'prode_token'
const TOKEN_EXPIRY_KEY = 'prode_token_expiry'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // Función para guardar token en cookies
  const saveToken = (token: string, expiresAt: string) => {
    const expiryDate = new Date(expiresAt)
    Cookies.set(TOKEN_KEY, token, { 
      expires: expiryDate,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    Cookies.set(TOKEN_EXPIRY_KEY, expiresAt, { 
      expires: expiryDate,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  }

  // Función para eliminar token
  const removeToken = () => {
    Cookies.remove(TOKEN_KEY)
    Cookies.remove(TOKEN_EXPIRY_KEY)
  }

  // Función para obtener token actual
  const getToken = () => {
    return Cookies.get(TOKEN_KEY)
  }

  // Función para verificar si el token ha expirado
  const isTokenExpired = () => {
    const expiry = Cookies.get(TOKEN_EXPIRY_KEY)
    if (!expiry) return true
    
    return new Date(expiry) <= new Date()
  }

  // Configurar interceptor de axios para incluir token
  useEffect(() => {
    const token = getToken()
    if (token && !isTokenExpired()) {
      apiService.setAuthToken(token)
    }
  }, [])

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error en el login')
      }

      const data = await response.json()
      
      // Guardar token y usuario
      saveToken(data.token, data.expiresAt)
      setUser(data.user)
      apiService.setAuthToken(data.token)

      // Redirigir al dashboard
      router.push('/')
    } catch (error: any) {
      console.error('Error en login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función de registro
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error en el registro')
      }

      const result = await response.json()
      
      // Guardar token y usuario
      saveToken(result.token, result.expiresAt)
      setUser(result.user)
      apiService.setAuthToken(result.token)

      // Redirigir al dashboard
      router.push('/')
    } catch (error: any) {
      console.error('Error en registro:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      const token = getToken()
      if (token) {
        // Intentar hacer logout en el servidor
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Error en logout del servidor:', error)
    } finally {
      // Limpiar estado local independientemente del resultado del servidor
      removeToken()
      setUser(null)
      apiService.clearAuthToken()
      router.push('/auth/login')
    }
  }

  // Función para refrescar token
  const refreshToken = async () => {
    try {
      const currentToken = getToken()
      if (!currentToken) {
        throw new Error('No hay token para refrescar')
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken }),
      })

      if (!response.ok) {
        throw new Error('No se pudo refrescar el token')
      }

      const data = await response.json()
      
      saveToken(data.token, data.expiresAt)
      setUser(data.user)
      apiService.setAuthToken(data.token)
    } catch (error) {
      console.error('Error refrescando token:', error)
      await logout()
    }
  }

  // Validar sesión al cargar la aplicación
  useEffect(() => {
    const validateSession = async () => {
      try {
        setIsLoading(true)
        const token = getToken()
        
        if (!token || isTokenExpired()) {
          removeToken()
          setIsLoading(false)
          return
        }

        // Validar token con el servidor
        const response = await fetch(`${API_BASE_URL}/auth/validate`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          removeToken()
          setIsLoading(false)
          return
        }

        const data = await response.json()
        
        if (data.valid) {
          setUser(data.user)
          apiService.setAuthToken(token)
        } else {
          removeToken()
        }
      } catch (error) {
        console.error('Error validando sesión:', error)
        removeToken()
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()
  }, [])

  // Auto-refresh del token antes de que expire
  useEffect(() => {
    if (!user) return

    const checkTokenExpiry = () => {
      const expiry = Cookies.get(TOKEN_EXPIRY_KEY)
      if (!expiry) return

      const expiryDate = new Date(expiry)
      const now = new Date()
      const timeUntilExpiry = expiryDate.getTime() - now.getTime()
      
      // Si el token expira en menos de 5 minutos, refrescarlo
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        refreshToken()
      }
    }

    // Verificar cada minuto
    const interval = setInterval(checkTokenExpiry, 60 * 1000)
    
    return () => clearInterval(interval)
  }, [user])

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
