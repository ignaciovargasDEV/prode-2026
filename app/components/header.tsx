"use client"

import { useState, useEffect } from 'react'
import { Bell, User, Trophy, Target, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

export function Header() {
  const [isMobile, setIsMobile] = useState(false)
  const { user, stats, ranking, loading } = useCurrentUser()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Función para obtener las iniciales del nombre
  const getInitials = (nombre?: string, apellido?: string) => {
    if (!nombre || !apellido) return 'U'
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  // Datos para mostrar (con fallbacks mientras carga)
  const displayName = loading ? 'Cargando...' : `${user?.nombre || ''} ${user?.apellido || ''}`.trim() || 'Usuario'
  const displayPoints = loading ? '...' : stats?.totalPoints?.toLocaleString() || '0'
  const displayPosition = loading ? '...' : ranking?.posicion ? `#${ranking.posicion}` : 'N/A'
  const userInitials = getInitials(user?.nombre, user?.apellido)
  
  // Por ahora las notificaciones están hardcodeadas - en el futuro se pueden conectar a un endpoint
  const notificationCount = 0 // Cambiar cuando se implemente sistema de notificaciones

  if (isMobile) {
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 company-gradient rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Prode 2026</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
              <Target className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">{displayPoints}</span>
            </div>
            
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {notificationCount}
                </Badge>
              )}
            </Button>
            
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">{userInitials}</span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 company-gradient rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Prode Mundial 2026</h1>
              <p className="text-sm text-gray-500">{user?.area || 'Empresa'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">{displayPoints} puntos</span>
          </div>
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{userInitials}</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{displayName}</p>
              <p className="text-gray-500">Puesto {displayPosition}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
