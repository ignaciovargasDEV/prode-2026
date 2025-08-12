'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Redirigir al login si se requiere autenticación y no está autenticado
        router.push('/auth/login')
      } else if (!requireAuth && isAuthenticated) {
        // Redirigir al dashboard si no se requiere auth (páginas de login/register) pero está autenticado
        router.push('/')
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Si se requiere auth y no está autenticado, no mostrar nada (se redirige)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Si no se requiere auth (páginas login/register) y está autenticado, no mostrar nada (se redirige)
  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
