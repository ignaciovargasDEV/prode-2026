"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, Target, Award, Calendar, Flag, Download, Eye } from 'lucide-react'
import { apiService, Prediction } from '@/lib/api'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

interface UserStats {
  totalPredictions: number
  totalMatches: number
  accuracy: number
  exactMatches: number
  partialMatches: number
  currentStreak: number
  totalPoints: number
}

export default function Historial() {
  const { userId } = useCurrentUser()
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return
      
      try {
        setLoading(true)
        setError(null)
        
        const [predictionsResponse, statsResponse] = await Promise.all([
          apiService.getUserPredictions(userId),
          apiService.getUserStats(userId)
        ])
        
        setPredictions(predictionsResponse.data)
        setStats(statsResponse.data)
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError(err.message || 'Error loading user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const getResultBadge = (points: number) => {
    switch (points) {
      case 3:
        return <Badge className="bg-green-500">Exacto (3 pts)</Badge>
      case 1:
        return <Badge variant="secondary">Parcial (1 pt)</Badge>
      case 0:
        return <Badge variant="destructive">Incorrecto (0 pts)</Badge>
      default:
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Historial</h1>
            <p className="text-gray-600">Cargando estadísticas...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
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
              <p className="text-gray-600 mb-4">No se pudieron cargar las estadísticas. Asegúrate de que el backend esté ejecutándose.</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No hay estadísticas disponibles.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Historial</h1>
          <p className="text-gray-600">Estadísticas detalladas de tus pronósticos</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pronósticos</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPredictions}</div>
            <p className="text-xs text-muted-foreground">
              de {stats.totalMatches} partidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisión</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <Progress value={stats.accuracy} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados Exactos</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exactMatches}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPredictions > 0 ? Math.round((stats.exactMatches / stats.totalPredictions) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              puntos acumulados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="historial" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="historial">Historial Completo</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas Avanzadas</TabsTrigger>
          <TabsTrigger value="comparativa">Comparativa</TabsTrigger>
        </TabsList>

        <TabsContent value="historial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Historial de Pronósticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {predictions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No has hecho pronósticos aún</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((prediction) => (
                    <div key={prediction.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Flag className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{prediction.match?.homeTeam?.name || 'Team A'}</span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {prediction.homeGoalsPredicted}
                            </span>
                          </div>
                          <span className="text-gray-500">vs</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {prediction.awayGoalsPredicted}
                            </span>
                            <span className="font-medium">{prediction.match?.awayTeam?.name || 'Team B'}</span>
                            <Flag className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        {getResultBadge(prediction.points || 0)}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>{new Date(prediction.match?.fecha || '').toLocaleDateString()}</span>
                          {prediction.match && prediction.match.homeGoals !== null && prediction.match.awayGoals !== null && (
                            <span>Resultado real: {prediction.match.homeGoals} - {prediction.match.awayGoals}</span>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver detalles
                        </Button>
                      </div>
                      {prediction.comentario && (
                        <div className="mt-2 text-sm text-gray-600 italic">
                          "{prediction.comentario}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Fase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Fase de Grupos</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={stats.accuracy} className="w-20" />
                      <span className="text-sm font-medium">{stats.accuracy}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fases Eliminatorias</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={Math.max(0, stats.accuracy - 10)} className="w-20" />
                      <span className="text-sm font-medium">{Math.max(0, stats.accuracy - 10)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Puntos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Resultados Exactos (3 pts)</span>
                    <span className="font-medium">{stats.exactMatches}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Resultados Parciales (1 pt)</span>
                    <span className="font-medium">{stats.partialMatches}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Incorrectos (0 pts)</span>
                    <span className="font-medium">{stats.totalPredictions - stats.exactMatches - stats.partialMatches}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparativa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativa con el Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.accuracy}%</div>
                  <div className="text-sm text-gray-600 mb-2">Tu precisión</div>
                  <div className="text-xs text-gray-500">Promedio: 58%</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.totalPoints}</div>
                  <div className="text-sm text-gray-600 mb-2">Tus puntos</div>
                  <div className="text-xs text-gray-500">Promedio: 892</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">-</div>
                  <div className="text-sm text-gray-600 mb-2">Tu posición</div>
                  <div className="text-xs text-gray-500">Calculando...</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
