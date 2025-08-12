"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Medal, Award, TrendingUp, TrendingDown, User, Building2, Crown, Star } from 'lucide-react'
import { mockRanking, mockAreaRanking } from '@/lib/mock-data'

export default function Ranking() {
  const [selectedArea, setSelectedArea] = useState<string>('todas')

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{position}</span>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ranking</h1>
          <p className="text-gray-600">Tabla de posiciones del Mundial 2026</p>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span className="text-sm font-medium">Actualizado hace 5 minutos</span>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Ranking General</TabsTrigger>
          <TabsTrigger value="areas">Por Área</TabsTrigger>
          <TabsTrigger value="semanal">Top Semanal</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                Ranking General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRanking.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.id === 'current-user' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {getRankIcon(user.posicion)}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{user.nombre} {user.apellido}</span>
                            {user.id === 'current-user' && (
                              <Badge variant="secondary" className="text-xs">Tú</Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{user.area}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">{user.puntos}</div>
                        <div className="text-sm text-gray-500">puntos</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(user.tendencia)}
                        <span className="text-sm text-gray-500">{user.cambio}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Ranking por Departamento
                </CardTitle>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los departamentos</SelectItem>
                    <SelectItem value="tecnologia">Tecnología</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="ventas">Ventas</SelectItem>
                    <SelectItem value="rrhh">Recursos Humanos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAreaRanking.map((area) => (
                  <Card key={area.area} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{area.area}</h3>
                      <Badge variant="outline">{area.participantes} participantes</Badge>
                    </div>
                    <div className="space-y-2">
                      {area.topUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            {getRankIcon(index + 1)}
                            <span className="font-medium">{user.nombre} {user.apellido}</span>
                          </div>
                          <span className="font-bold">{user.puntos} pts</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semanal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" />
                Top 10 Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRanking.slice(0, 10).map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getRankIcon(index + 1)}
                      <div>
                        <span className="font-semibold">{user.nombre} {user.apellido}</span>
                        <div className="text-sm text-gray-500">{user.area}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">+{Math.floor(Math.random() * 50) + 10}</div>
                      <div className="text-sm text-gray-500">pts esta semana</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
