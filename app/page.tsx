"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, Target, TrendingUp, Calendar, Clock, Flag, ArrowRight, Star, Award } from 'lucide-react'
import { mockUser, mockUpcomingMatches, mockRecentResults, mockStats } from '@/lib/mock-data'

export default function Dashboard() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 md:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl md:text-2xl font-bold mb-2">¡Bienvenido, {mockUser.nombre}!</h2>
            <p className="text-blue-100 text-sm md:text-base">
              Estás en el puesto #{mockUser.posicionRanking} con {mockUser.puntosTotal} puntos
            </p>
          </div>
          <div className="text-center md:text-right">
            <div className="text-2xl md:text-3xl font-bold">{mockUser.puntosTotal}</div>
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
            <div className="text-xl md:text-2xl font-bold">#{mockUser.posicionRanking}</div>
            <p className="text-xs text-muted-foreground">
              +2 vs semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Pronósticos</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{mockStats.totalPredictions}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.accuracy}% aciertos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Racha</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{mockStats.currentStreak}</div>
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
            <div className="text-xl md:text-2xl font-bold">{mockUpcomingMatches.length}</div>
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
            {mockUpcomingMatches.slice(0, 3).map((match) => (
              <div key={match.id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                  <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
                    <Flag className="w-3 md:w-4 h-3 md:h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-xs md:text-sm truncate">{match.equipoLocal}</span>
                  </div>
                  <span className="text-gray-500 text-xs md:text-sm">vs</span>
                  <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
                    <Flag className="w-3 md:w-4 h-3 md:h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-xs md:text-sm truncate">{match.equipoVisitante}</span>
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
            {mockRecentResults.slice(0, 3).map((result) => (
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
                <span>32 de 104 partidos</span>
              </div>
              <Progress value={31} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6">
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-blue-600">{mockStats.accuracy}%</div>
                <div className="text-xs md:text-sm text-gray-600">Precisión</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-green-600">{mockStats.exactMatches}</div>
                <div className="text-xs md:text-sm text-gray-600">Resultados exactos</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-yellow-600">{mockStats.partialMatches}</div>
                <div className="text-xs md:text-sm text-gray-600">Resultados parciales</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
