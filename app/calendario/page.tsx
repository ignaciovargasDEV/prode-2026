"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock, Flag, Filter } from 'lucide-react'
import { apiService, Match } from '@/lib/api'

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [filterPhase, setFilterPhase] = useState<string>('all')
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getMatches()
        setMatches(response.data)
      } catch (err: any) {
        console.error('Error fetching matches:', err)
        setError(err.message || 'Error loading matches')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const groupMatchesByDate = (matches: Match[]) => {
    return matches.reduce((acc, match) => {
      const date = new Date(match.fecha).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(match)
      return acc
    }, {} as Record<string, Match[]>)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINALIZADO':
        return 'bg-gray-500'
      case 'EN_PROGRESO':
        return 'bg-green-500'
      case 'PENDIENTE':
        return 'bg-blue-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'FINALIZADO':
        return 'Finalizado'
      case 'EN_PROGRESO':
        return 'En Progreso'
      case 'PENDIENTE':
        return 'Pendiente'
      case 'CANCELADO':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getPhaseText = (fase: string) => {
    switch (fase) {
      case 'GRUPOS':
        return 'Grupos'
      case 'OCTAVOS':
        return 'Octavos'
      case 'CUARTOS':
        return 'Cuartos'
      case 'SEMIFINAL':
        return 'Semifinal'
      case 'TERCER_PUESTO':
        return '3er Puesto'
      case 'FINAL':
        return 'Final'
      default:
        return fase
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendario de Partidos</h1>
            <p className="text-gray-600">Cargando partidos...</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
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
              <p className="text-gray-600 mb-4">No se pudieron cargar los partidos. Asegúrate de que el backend esté ejecutándose.</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const groupedMatches = groupMatchesByDate(matches)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Partidos</h1>
          <p className="text-gray-600">Todos los partidos del Mundial 2022</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar por fase
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedMatches).map(([date, dayMatches]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                {new Date(date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dayMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {new Date(match.fecha).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getPhaseText(match.fase)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <Flag className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{match.homeTeam?.name || 'Team A'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {match.status === 'FINALIZADO' ? (
                          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded border">
                            <span className="font-bold">{match.homeGoals}</span>
                            <span className="text-gray-500">-</span>
                            <span className="font-bold">{match.awayGoals}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-500">
                            <span>vs</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{match.awayTeam?.name || 'Team B'}</span>
                        <Flag className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(match.status)}`}></div>
                      <span className="text-sm">{getStatusText(match.status)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
