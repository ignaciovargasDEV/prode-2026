"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Flag, Clock, Save, Edit3, Lock, Calendar, Trophy } from 'lucide-react'
import { mockMatches } from '@/lib/mock-data'

export default function Pronosticos() {
  const [predictions, setPredictions] = useState<Record<string, { local: string, visitante: string }>>({})

  const handlePredictionChange = (matchId: string, team: 'local' | 'visitante', value: string) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value
      }
    }))
  }

  const savePrediction = (matchId: string) => {
    console.log('Guardando predicción para partido:', matchId, predictions[matchId])
  }

  const getMatchStatus = (match: any) => {
    const now = new Date()
    const matchDate = new Date(match.fecha)
    const oneHourBefore = new Date(matchDate.getTime() - 60 * 60 * 1000)

    if (match.estado === 'finalizado') return 'finalizado'
    if (now > oneHourBefore) return 'cerrado'
    return 'abierto'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'abierto':
        return <Badge variant="default" className="bg-green-500 text-xs">Abierto</Badge>
      case 'cerrado':
        return <Badge variant="secondary" className="text-xs">Cerrado</Badge>
      case 'finalizado':
        return <Badge variant="destructive" className="text-xs">Finalizado</Badge>
      default:
        return <Badge variant="outline" className="text-xs">Pendiente</Badge>
    }
  }

  const groupMatchesByPhase = (matches: any[]) => {
    return matches.reduce((acc, match) => {
      if (!acc[match.fase]) {
        acc[match.fase] = []
      }
      acc[match.fase].push(match)
      return acc
    }, {} as Record<string, any[]>)
  }

  const groupedMatches = groupMatchesByPhase(mockMatches)

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
                            <span className="font-semibold text-sm">{match.equipoLocal}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm">{match.equipoVisitante}</span>
                            <Flag className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          {match.estado === 'finalizado' ? (
                            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <span className="text-lg font-bold">{match.golesLocal}</span>
                              <span className="text-gray-500">-</span>
                              <span className="text-lg font-bold">{match.golesVisitante}</span>
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
                            <span className="font-semibold text-lg">{match.equipoLocal}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mx-8">
                          {match.estado === 'finalizado' ? (
                            <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                              <span className="text-xl font-bold">{match.golesLocal}</span>
                              <span className="text-gray-500">-</span>
                              <span className="text-xl font-bold">{match.golesVisitante}</span>
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
                            <span className="font-semibold text-lg">{match.equipoVisitante}</span>
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
                          >
                            <Save className="w-4 h-4" />
                            <span>Guardar</span>
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
                          <Clock className="w-3 md:w-4 h-3 md:h-4" />
                          <span>Cierra 1 hora antes</span>
                        </div>
                        {match.estado === 'finalizado' && (
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
