"use client"

import { useState, useEffect } from 'react'
import { Bell, User, Trophy, Target, Menu, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [isMobile, setIsMobile] = useState(false)
  const { user: authUser, logout } = useAuth()
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

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Usar datos del contexto de auth como fallback
  const currentUser = user || authUser
  
  // Datos para mostrar (con fallbacks mientras carga)
  const displayName = loading ? 'Cargando...' : 
    currentUser ? `${currentUser.nombre || ''} ${currentUser.apellido || ''}`.trim() : 'Usuario'
  const displayPoints = loading ? '...' : stats?.totalPoints?.toLocaleString() || '0'
  const displayPosition = loading ? '...' : ranking?.posicion ? `#${ranking.posicion}` : 'N/A'
  const userInitials = getInitials(currentUser?.nombre, currentUser?.apellido)
  
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">{userInitials}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium text-sm">{displayName}</div>
                  <div className="text-xs text-muted-foreground">{currentUser?.email}</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <p className="text-sm text-gray-500">{currentUser?.area || 'Empresa'}</p>
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{userInitials}</span>
                </div>
                <div className="text-sm text-left">
                  <p className="font-medium text-gray-900">{displayName}</p>
                  <p className="text-gray-500">Puesto {displayPosition}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="font-medium">{displayName}</div>
                <div className="text-sm text-muted-foreground">{currentUser?.email}</div>
                <div className="text-sm text-muted-foreground">{currentUser?.area}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
