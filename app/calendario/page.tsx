"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock, Flag, Filter } from 'lucide-react'
import { mockMatches } from '@/lib/mock-data'

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [filterPhase, setFilterPhase] = useState<string>('all')

  const groupMatchesByDate = (matches: any[]) => {
    return matches.reduce((acc, match) => {
      const date = new Date(match.fecha).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(match)
      return acc
    }, {} as Record<string, any[]>)
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'finalizado':
        return 'bg-gray-500'
      case 'activo':
        return 'bg-green-500'
      default:
        return 'bg-blue-500'
    }
  }

  const groupedMatches = groupMatchesByDate(mockMatches)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Partidos</h1>
          <p className="text-gray-600">Todos los partidos del Mundial 2026</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar por fase
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedMatches).map(([date, matches]) => (
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
                {matches.map((match) => (
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
                        {match.fase}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <Flag className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{match.equipoLocal}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {match.estado === 'finalizado' ? (
                          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded border">
                            <span className="font-bold">{match.golesLocal}</span>
                            <span className="text-gray-500">-</span>
                            <span className="font-bold">{match.golesVisitante}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-500">
                            <span>vs</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{match.equipoVisitante}</span>
                        <Flag className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(match.estado)}`}></div>
                      <span className="text-sm capitalize">{match.estado}</span>
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
