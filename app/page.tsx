"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, Target, TrendingUp, Calendar, Clock, Flag, ArrowRight, Star, Award } from 'lucide-react'
import { apiService, Match, RankingUser, UserStats, User } from '@/lib/api'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

export default function Dashboard() {
  const { user, stats, ranking, loading, error } = useCurrentUser()
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [recentResults, setRecentResults] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingResponse, recentResponse, userHistoryResponse] = await Promise.all([
          apiService.getUpcomingMatches(),
          apiService.getRecentResults(),
          user ? apiService.getUserHistory(user.id) : Promise.resolve({ data: [] })
        ])

        setUpcomingMatches(upcomingResponse.data)
        
        // Convert recent matches to the format expected by the UI
        const recentWithPredictions = recentResponse.data.map(match => ({
          id: match.id,
          equipoLocal: match.homeTeam.name,
          equipoVisitante: match.awayTeam.name,
          golesLocal: match.homeGoals,
          golesVisitante: match.awayGoals,
          puntos: 0, // We'll update this with actual user predictions
          pronosticoLocal: 0,
          pronosticoVisitante: 0
        }))

        // If we have user history, match it with recent results
        if (userHistoryResponse.data.length > 0) {
          const historyMap = new Map(
            userHistoryResponse.data.map(h => [h.id, h])
          )
          
          recentWithPredictions.forEach(result => {
            const history = historyMap.get(result.id)
            if (history) {
              result.puntos = history.puntos
              result.pronosticoLocal = history.pronosticoLocal
              result.pronosticoVisitante = history.pronosticoVisitante
            }
          })
        }

        setRecentResults(recentWithPredictions)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoadingData(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  if (loading || loadingData) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-6 text-white">
          <div className="animate-pulse">
            <div className="h-6 bg-blue-500 rounded mb-2 w-1/3"></div>
            <div className="h-4 bg-blue-400 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
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
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error de conexión</h3>
              <p className="text-gray-600 mb-4">No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose en el puerto 3001.</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || !stats || !ranking) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No se encontraron datos</h3>
              <p className="text-gray-600">No se pudieron cargar los datos del usuario.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl md:text-2xl font-bold mb-2">¡Bienvenido, {user.nombre}!</h2>
            <p className="text-blue-100 text-sm md:text-base">
              Estás en el puesto #{ranking.posicion} con {ranking.puntos} puntos
            </p>
          </div>
          <div className="text-center md:text-right">
            <div className="text-2xl md:text-3xl font-bold">{ranking.puntos}</div>
            <div className="text-blue-200 text-sm">puntos totales</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Posición</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">#{ranking.posicion}</div>
            <p className="text-xs text-muted-foreground">
              {ranking.cambio} vs anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Pronósticos</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats.totalPredictions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.accuracy}% aciertos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Racha</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              consecutivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Próximos</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{upcomingMatches.length}</div>
            <p className="text-xs text-muted-foreground">
              por pronosticar
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Upcoming Matches */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Clock className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
                Próximos Partidos
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs md:text-sm">
                <a href="/pronosticos">
                  Ver todos <ArrowRight className="w-3 md:w-4 h-3 md:h-4 ml-1" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {upcomingMatches.slice(0, 3).map((match) => (
              <div key={match.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
                    <Flag className="w-3 md:w-4 h-3 md:h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-xs md:text-sm truncate">{match.homeTeam.name}</span>
                  </div>
                  <span className="text-gray-500 text-xs md:text-sm">vs</span>
                  <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
                    <Flag className="w-3 md:w-4 h-3 md:h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-xs md:text-sm truncate">{match.awayTeam.name}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-xs md:text-sm font-medium">{new Date(match.fecha).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{new Date(match.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Award className="w-4 md:w-5 h-4 md:h-5 text-green-600" />
              Resultados Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {recentResults.slice(0, 3).map((result) => (
              <div key={result.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Flag className="w-3 md:w-4 h-3 md:h-4 text-gray-400" />
                    <span className="font-medium text-xs md:text-sm">{result.equipoLocal}</span>
                    <span className="text-xs md:text-sm">{result.golesLocal}</span>
                  </div>
                  <span className="text-gray-500 text-xs md:text-sm">-</span>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <span className="text-xs md:text-sm">{result.golesVisitante}</span>
                    <span className="font-medium text-xs md:text-sm">{result.equipoVisitante}</span>
                    <Flag className="w-3 md:w-4 h-3 md:h-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge variant={result.puntos === 3 ? "default" : result.puntos === 1 ? "secondary" : "destructive"} className="text-xs">
                    {result.puntos} pts
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Star className="w-4 md:w-5 h-4 md:h-5 text-yellow-600" />
            Tu Progreso en el Torneo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso del Mundial</span>
                <span>{stats.totalPredictions} de {stats.totalMatches} partidos</span>
              </div>
              <Progress value={(stats.totalPredictions / stats.totalMatches) * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6">
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-blue-600">{stats.accuracy}%</div>
                <div className="text-xs md:text-sm text-gray-600">Precisión</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-green-600">{stats.exactMatches}</div>
                <div className="text-xs md:text-sm text-gray-600">Resultados exactos</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-yellow-600">{stats.partialMatches}</div>
                <div className="text-xs md:text-sm text-gray-600">Resultados parciales</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
