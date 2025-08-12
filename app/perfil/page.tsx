"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Building2, Trophy, Star, Settings, Bell, Shield, Edit3, Save } from 'lucide-react'
import { apiService, User as ApiUser } from '@/lib/api'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

interface UserAchievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
}

interface UserStats {
  totalPoints: number
  accuracy: number
  currentStreak: number
  position?: number
}

export default function Perfil() {
  const { userId } = useCurrentUser()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<ApiUser | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return
      
      try {
        setLoading(true)
        setError(null)
        
        const [userResponse, statsResponse] = await Promise.all([
          apiService.getUserById(userId),
          apiService.getUserStats(userId)
        ])
        
        setUserData(userResponse.data)
        setUserStats(statsResponse.data)
        
        // Los achievements por ahora los simulamos porque no están implementados en el backend
        setAchievements([
          {
            id: '1',
            name: 'Primer Pronóstico',
            description: 'Hiciste tu primer pronóstico',
            icon: 'trophy',
            unlockedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Participante Activo',
            description: 'Has hecho más de 5 pronósticos',
            icon: 'star',
            unlockedAt: new Date().toISOString()
          }
        ])
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError(err.message || 'Error loading user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleSave = async () => {
    if (!userData || !userId) return
    
    try {
      await apiService.updateUser(userId, {
        nombre: userData.nombre,
        apellido: userData.apellido,
        area: userData.area
      })
      setIsEditing(false)
      alert('Perfil actualizado exitosamente')
    } catch (err: any) {
      console.error('Error updating user:', err)
      if (err.response?.status === 400) {
        alert('Error: ' + (err.response.data.error || 'Datos inválidos'))
      } else if (err.response?.status === 404) {
        alert('Usuario no encontrado')
      } else {
        alert('Error al actualizar el perfil. Intenta nuevamente.')
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error de conexión</h3>
              <p className="text-gray-600 mb-4">No se pudo cargar la información del perfil. Asegúrate de que el backend esté ejecutándose.</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No se encontró información del usuario.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y configuración</p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? 'Guardar' : 'Editar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
              <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Datos Personales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={userData.nombre}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, nombre: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        value={userData.apellido}
                        disabled={!isEditing}
                        onChange={(e) => setUserData({...userData, apellido: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      disabled={!isEditing}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Departamento</Label>
                    <Input
                      id="area"
                      value={userData.area}
                      disabled={!isEditing}
                      onChange={(e) => setUserData({...userData, area: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="estadisticas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Resumen de Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userStats ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</div>
                        <div className="text-sm text-gray-600">Puntos Totales</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">#{userStats.position || '-'}</div>
                        <div className="text-sm text-gray-600">Posición</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{userStats.accuracy}%</div>
                        <div className="text-sm text-gray-600">Precisión</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{userStats.currentStreak}</div>
                        <div className="text-sm text-gray-600">Racha Actual</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No hay estadísticas disponibles</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuracion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    Configuración de la Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Notificaciones por Email</div>
                        <div className="text-sm text-gray-500">Recibir recordatorios de partidos</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">Privacidad</div>
                        <div className="text-sm text-gray-500">Controlar visibilidad del perfil</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar con logros */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Logros Obtenidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No hay logros desbloqueados aún</p>
                </div>
              ) : (
                achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{achievement.name}</div>
                      <div className="text-xs text-gray-500">{achievement.description}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{userData.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{userData.area}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
