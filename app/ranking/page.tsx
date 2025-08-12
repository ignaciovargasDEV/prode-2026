"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Medal, Award, TrendingUp, TrendingDown, User, Building2, Crown, Star } from 'lucide-react'
import { apiService, RankingUser } from '@/lib/api'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

export default function Ranking() {
  const { userId } = useCurrentUser()
  const [selectedArea, setSelectedArea] = useState<string>('todas')
  const [globalRanking, setGlobalRanking] = useState<RankingUser[]>([])
  const [areaRanking, setAreaRanking] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [globalResponse, areaResponse] = await Promise.all([
          apiService.getGlobalRanking(),
          apiService.getAreaRanking()
        ])

        setGlobalRanking(globalResponse.data)
        setAreaRanking(areaResponse.data)
      } catch (err: any) {
        console.error('Error fetching ranking data:', err)
        setError(err.message || 'Error loading ranking data')
      } finally {
        setLoading(false)
      }
    }

    fetchRankingData()
  }, [])

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ranking</h1>
            <p className="text-gray-600">Cargando tabla de posiciones...</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
              <p className="text-gray-600 mb-4">No se pudo cargar el ranking. Asegúrate de que el backend esté ejecutándose.</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
          <span className="text-sm font-medium">Actualizado recientemente</span>
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
              {globalRanking.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay datos de ranking disponibles</p>
                </div>
              ) : (
                        <div className="space-y-3">
                  {globalRanking.map((user, index) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        user.id === userId ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {getRankIcon(user.posicion)}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {`${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}`.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{user.nombre} {user.apellido}</span>
                              {user.id === userId && (
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
                          {getTrendIcon(user.tendencia || 'stable')}
                          <span className="text-sm text-gray-500">{user.cambio || '0'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {areaRanking.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay datos de ranking por departamento disponibles</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {areaRanking.map((area, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{area.area}</h3>
                        <Badge variant="outline">{area.participantes} participantes</Badge>
                      </div>
                      <div className="space-y-2">
                        {area.topUsers?.map((user: any, userIndex: number) => (
                          <div key={user.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center space-x-3">
                              {getRankIcon(userIndex + 1)}
                              <span className="font-medium">{user.nombre} {user.apellido}</span>
                            </div>
                            <span className="font-bold">{user.puntos} pts</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
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
              {globalRanking.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay datos de ranking semanal disponibles</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {globalRanking.slice(0, 10).map((user, index) => (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
