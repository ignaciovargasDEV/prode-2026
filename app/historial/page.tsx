"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, Target, Award, Calendar, Flag, Download, Eye } from 'lucide-react'
import { mockUserHistory, mockStats } from '@/lib/mock-data'

export default function Historial() {
  const [selectedPeriod, setSelectedPeriod] = useState('all')

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
            <div className="text-2xl font-bold">{mockStats.totalPredictions}</div>
            <p className="text-xs text-muted-foreground">
              de {mockStats.totalMatches} partidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisión</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.accuracy}%</div>
            <Progress value={mockStats.accuracy} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados Exactos</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.exactMatches}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockStats.exactMatches / mockStats.totalPredictions) * 100)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              aciertos consecutivos
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
              <div className="space-y-4">
                {mockUserHistory.map((match) => (
                  <div key={match.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Flag className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{match.equipoLocal}</span>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {match.pronosticoLocal}
                          </span>
                        </div>
                        <span className="text-gray-500">vs</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {match.pronosticoVisitante}
                          </span>
                          <span className="font-medium">{match.equipoVisitante}</span>
                          <Flag className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      {getResultBadge(match.puntos)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{new Date(match.fecha).toLocaleDateString()}</span>
                        <span>Resultado real: {match.golesLocal} - {match.golesVisitante}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
                      <Progress value={75} className="w-20" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Octavos de Final</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={60} className="w-20" />
                      <span className="text-sm font-medium">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cuartos de Final</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={50} className="w-20" />
                      <span className="text-sm font-medium">50%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mejores Equipos Pronosticados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Flag className="w-4 h-4" />
                      <span>Argentina</span>
                    </div>
                    <span className="font-medium">85% aciertos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Flag className="w-4 h-4" />
                      <span>Brasil</span>
                    </div>
                    <span className="font-medium">80% aciertos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Flag className="w-4 h-4" />
                      <span>España</span>
                    </div>
                    <span className="font-medium">75% aciertos</span>
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
                  <div className="text-2xl font-bold text-blue-600">{mockStats.accuracy}%</div>
                  <div className="text-sm text-gray-600 mb-2">Tu precisión</div>
                  <div className="text-xs text-gray-500">Promedio: 58%</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-gray-600 mb-2">Tus puntos</div>
                  <div className="text-xs text-gray-500">Promedio: 892</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">#23</div>
                  <div className="text-sm text-gray-600 mb-2">Tu posición</div>
                  <div className="text-xs text-gray-500">de 1,456 participantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
