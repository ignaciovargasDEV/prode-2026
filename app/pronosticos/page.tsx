"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Flag, Clock, Save, Edit3, Lock, Calendar, Trophy } from 'lucide-react'
import { apiService, Match, Prediction } from '@/lib/api'
import { useCurrentUser } from '@/lib/hooks/useCurrentUser'

export default function Pronosticos() {
  const { userId } = useCurrentUser()
  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<Record<string, { local: string, visitante: string }>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingPrediction, setSavingPrediction] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [matchesResponse] = await Promise.all([
          apiService.getUpcomingMatches(userId || undefined)
        ])

        console.log('🏈 Matches response:', matchesResponse.data)
        
        setMatches(matchesResponse.data)
        
        // Convert existing predictions to local state format
        const predictionMap: Record<string, { local: string, visitante: string }> = {}
        matchesResponse.data.forEach((match: Match) => {
          if (match.predictions && match.predictions.length > 0) {
            const pred = match.predictions[0] // Solo debería haber una predicción por usuario
            predictionMap[match.id] = {
              local: pred.homeGoalsPredicted?.toString() || '',
              visitante: pred.awayGoalsPredicted?.toString() || ''
            }
          }
        })
        setPredictions(predictionMap)
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const handlePredictionChange = (matchId: string, team: 'local' | 'visitante', value: string) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value
      }
    }))
  }

  const savePrediction = async (matchId: string) => {
    const prediction = predictions[matchId]
    if (!prediction || !userId) return

    const homeGoals = parseInt(prediction.local)
    const awayGoals = parseInt(prediction.visitante)

    if (isNaN(homeGoals) || isNaN(awayGoals) || homeGoals < 0 || awayGoals < 0) {
      alert('Por favor ingresa valores válidos para los goles (números enteros positivos)')
      return
    }

    try {
      setSavingPrediction(matchId)
      
      // Verificar si ya existe una predicción para este partido
      const existingPredictions = await apiService.getUserPredictions(userId)
      const existingPrediction = existingPredictions.data.find(p => p.matchId === matchId)
      
      if (existingPrediction) {
        // Actualizar predicción existente
        await apiService.updatePrediction(existingPrediction.id, {
          homeGoalsPredicted: homeGoals,
          awayGoalsPredicted: awayGoals
        })
        console.log('Predicción actualizada exitosamente')
      } else {
        // Crear nueva predicción
        await apiService.createPrediction({
          userId,
          matchId,
          homeGoalsPredicted: homeGoals,
          awayGoalsPredicted: awayGoals
        })
        console.log('Predicción creada exitosamente')
      }
      
      alert('Predicción guardada exitosamente')
      
      // Recargar los datos para mostrar la predicción actualizada
      const updatedMatches = await apiService.getUpcomingMatches(userId || undefined)
      setMatches(updatedMatches.data)
      
    } catch (err: any) {
      console.error('Error saving prediction:', err)
      
      if (err.response?.status === 400) {
        if (err.response.data.error.includes('already exists')) {
          alert('Ya existe una predicción para este partido. Intenta actualizarla.')
        } else if (err.response.data.error.includes('already started')) {
          alert('No se puede pronosticar en un partido que ya comenzó.')
        } else {
          alert('Error: ' + err.response.data.error)
        }
      } else if (err.response?.status === 404) {
        alert('Partido no encontrado.')
      } else {
        alert('Error al guardar la predicción. Intenta nuevamente.')
      }
    } finally {
      setSavingPrediction(null)
    }
  }

  const getMatchStatus = (match: Match) => {
    const now = new Date()
    const matchDate = new Date(match.fecha)
    const oneHourBefore = new Date(matchDate.getTime() - 60 * 60 * 1000)

    if (match.status === 'FINALIZADO') return 'finalizado'
    if (now > oneHourBefore) return 'cerrado'
    return 'abierto'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'abierto':
        return <Badge className="bg-green-500 text-xs text-white">Abierto</Badge>
      case 'cerrado':
        return <Badge className="bg-gray-500 text-xs text-white">Cerrado</Badge>
      case 'finalizado':
        return <Badge className="bg-red-500 text-xs text-white">Finalizado</Badge>
      default:
        return <Badge className="bg-gray-200 text-xs">Pendiente</Badge>
    }
  }

  const groupMatchesByPhase = (matches: Match[]) => {
    return matches.reduce((acc, match) => {
      // Mapear las fases del backend a las fases del frontend
      let phase = match.fase || 'GRUPOS'
      switch (phase.toUpperCase()) {
        case 'GRUPOS':
          phase = 'grupos'
          break
        case 'OCTAVOS':
          phase = 'octavos'
          break
        case 'CUARTOS':
          phase = 'cuartos'
          break
        case 'SEMIFINAL':
        case 'FINAL':
        case 'TERCER_PUESTO':
          phase = 'finales'
          break
        default:
          phase = 'grupos'
      }
      
      if (!acc[phase]) {
        acc[phase] = []
      }
      acc[phase].push(match)
      return acc
    }, {} as Record<string, Match[]>)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pronósticos</h1>
            <p className="text-gray-600 text-sm md:text-base">Cargando partidos...</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
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

  const groupedMatches = groupMatchesByPhase(matches)
  console.log('📋 Grouped matches:', groupedMatches)
  console.log('🔢 Total matches:', matches.length)

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pronósticos</h1>
          <p className="text-gray-600 text-sm md:text-base">Realiza tus predicciones para el Mundial 2026</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 md:px-4 py-2 rounded-lg">
          <Trophy className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
          <span className="text-xs md:text-sm font-medium text-blue-900">
            {Object.keys(predictions).length} pronósticos pendientes
          </span>
        </div>
      </div>

      <Tabs defaultValue="grupos" className="w-full">
        <TabsList className="grid w-full grid-cols-4 text-xs md:text-sm">
          <TabsTrigger value="grupos">Grupos</TabsTrigger>
          <TabsTrigger value="octavos">Octavos</TabsTrigger>
          <TabsTrigger value="cuartos">Cuartos</TabsTrigger>
          <TabsTrigger value="finales">Finales</TabsTrigger>
        </TabsList>

        {Object.entries(groupedMatches).map(([phase, matches]) => (
          <TabsContent key={phase} value={phase} className="space-y-3 md:space-y-4">
            <div className="grid gap-3 md:gap-4">
              {matches.map((match) => {
                const status = getMatchStatus(match)
                const isEditable = status === 'abierto'
                const currentPrediction = predictions[match.id]

                return (
                  <Card key={match.id} className="overflow-hidden">
                    <CardHeader className="pb-2 md:pb-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 md:w-4 h-3 md:h-4 text-gray-500" />
                          <span className="text-xs md:text-sm text-gray-600">
                            {new Date(match.fecha).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {getStatusBadge(status)}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Flag className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-sm">{match.homeTeam.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm">{match.awayTeam.name}</span>
                            <Flag className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          {status === 'finalizado' ? (
                            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <span className="text-lg font-bold">{match.homeGoals}</span>
                              <span className="text-gray-500">-</span>
                              <span className="text-lg font-bold">{match.awayGoals}</span>
                            </div>
                          ) : isEditable ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                max="20"
                                className="w-12 text-center text-sm"
                                placeholder="0"
                                value={currentPrediction?.local || ''}
                                onChange={(e) => handlePredictionChange(match.id, 'local', e.target.value)}
                              />
                              <span className="text-gray-500">-</span>
                              <Input
                                type="number"
                                min="0"
                                max="20"
                                className="w-12 text-center text-sm"
                                placeholder="0"
                                value={currentPrediction?.visitante || ''}
                                onChange={(e) => handlePredictionChange(match.id, 'visitante', e.target.value)}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <Lock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500 text-sm">Cerrado</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex items-center space-x-2">
                            <Flag className="w-6 h-6 text-gray-400" />
                            <span className="font-semibold text-lg">{match.homeTeam.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mx-8">
                          {status === 'finalizado' ? (
                            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <span className="text-xl font-bold">{match.homeGoals}</span>
                              <span className="text-gray-500">-</span>
                              <span className="text-xl font-bold">{match.awayGoals}</span>
                            </div>
                          ) : isEditable ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                min="0"
                                max="20"
                                className="w-16 text-center"
                                placeholder="0"
                                value={currentPrediction?.local || ''}
                                onChange={(e) => handlePredictionChange(match.id, 'local', e.target.value)}
                              />
                              <span className="text-gray-500">-</span>
                              <Input
                                type="number"
                                min="0"
                                max="20"
                                className="w-16 text-center"
                                placeholder="0"
                                value={currentPrediction?.visitante || ''}
                                onChange={(e) => handlePredictionChange(match.id, 'visitante', e.target.value)}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <Lock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500">Cerrado</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 flex-1 justify-end">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-lg">{match.awayTeam.name}</span>
                            <Flag className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {isEditable && currentPrediction && (
                        <div className="flex justify-center mt-4">
                          <Button 
                            onClick={() => savePrediction(match.id)}
                            className="flex items-center space-x-2 text-sm"
                            size="sm"
                            disabled={savingPrediction === match.id}
                          >
                            {savingPrediction === match.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Guardando...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                <span>Guardar</span>
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
                          <Clock className="w-3 md:w-4 h-3 md:h-4" />
                          <span>Cierra 1 hora antes</span>
                        </div>
                        {status === 'finalizado' && (
                          <Badge variant="outline" className="text-xs">
                            3 puntos ganados
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
