"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Building2, Trophy, Star, Settings, Bell, Shield, Edit3, Save } from 'lucide-react'
import { mockUser, mockUserAchievements } from '@/lib/mock-data'

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(mockUser)

  const handleSave = () => {
    setIsEditing(false)
    // Aquí se guardarían los cambios
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{userData.puntosTotal}</div>
                      <div className="text-sm text-gray-600">Puntos Totales</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">#{userData.posicionRanking}</div>
                      <div className="text-sm text-gray-600">Posición</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">67%</div>
                      <div className="text-sm text-gray-600">Precisión</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">5</div>
                      <div className="text-sm text-gray-600">Racha Actual</div>
                    </div>
                  </div>
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
              {mockUserAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{achievement.nombre}</div>
                    <div className="text-xs text-gray-500">{achievement.descripcion}</div>
                  </div>
                </div>
              ))}
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
