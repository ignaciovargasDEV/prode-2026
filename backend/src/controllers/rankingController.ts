import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getGlobalRanking = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        predictions: {
          where: {
            points: {
              not: null
            }
          }
        }
      }
    })
    
    // Calcular puntos totales para cada usuario
    const usersWithPoints = users.map(user => {
      const totalPoints = user.predictions.reduce((sum, prediction) => sum + (prediction.points || 0), 0)
      return {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        area: user.area,
        puntos: totalPoints,
        totalPredictions: user.predictions.length
      }
    })
    
    // Ordenar por puntos y asignar posiciones
    const ranking = usersWithPoints
      .sort((a, b) => b.puntos - a.puntos)
      .map((user, index) => ({
        ...user,
        posicion: index + 1,
        tendencia: 'up', // TODO: Calcular tendencia real
        cambio: '+0' // TODO: Calcular cambio real
      }))
    
    res.json(ranking)
  } catch (error) {
    console.error('Error getting global ranking:', error)
    res.status(500).json({ error: 'Failed to get global ranking' })
  }
}

export const getAreaRanking = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        predictions: {
          where: {
            points: {
              not: null
            }
          }
        }
      }
    })
    
    // Agrupar usuarios por área
    const usersByArea = users.reduce((acc: any, user) => {
      if (!acc[user.area]) {
        acc[user.area] = []
      }
      
      const totalPoints = user.predictions.reduce((sum, prediction) => sum + (prediction.points || 0), 0)
      acc[user.area].push({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        puntos: totalPoints
      })
      
      return acc
    }, {})
    
    // Crear ranking por área
    const areaRanking = Object.keys(usersByArea).map(area => {
      const areaUsers = usersByArea[area]
        .sort((a: any, b: any) => b.puntos - a.puntos)
        .slice(0, 3) // Top 3 por área
      
      return {
        area,
        participantes: usersByArea[area].length,
        topUsers: areaUsers
      }
    })
    
    res.json(areaRanking)
  } catch (error) {
    console.error('Error getting area ranking:', error)
    res.status(500).json({ error: 'Failed to get area ranking' })
  }
}

export const getUserRanking = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    
    // Obtener todos los usuarios con sus puntos
    const users = await prisma.user.findMany({
      include: {
        predictions: {
          where: {
            points: {
              not: null
            }
          }
        }
      }
    })
    
    // Calcular puntos y crear ranking
    const usersWithPoints = users.map(user => {
      const totalPoints = user.predictions.reduce((sum, prediction) => sum + (prediction.points || 0), 0)
      return {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        area: user.area,
        puntos: totalPoints
      }
    })
    
    const sortedUsers = usersWithPoints.sort((a, b) => b.puntos - a.puntos)
    const userPosition = sortedUsers.findIndex(user => user.id === userId) + 1
    
    if (userPosition === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    const userRanking = {
      ...sortedUsers[userPosition - 1],
      posicion: userPosition,
      totalParticipants: sortedUsers.length
    }
    
    res.json(userRanking)
  } catch (error) {
    console.error('Error getting user ranking:', error)
    res.status(500).json({ error: 'Failed to get user ranking' })
  }
}

export const getUserHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    
    const predictions = await prisma.prediction.findMany({
      where: { 
        userId,
        match: {
          status: 'FINALIZADO'
        }
      },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true
          }
        }
      },
      orderBy: {
        match: {
          fecha: 'desc'
        }
      }
    })
    
    const history = predictions.map(prediction => ({
      id: prediction.id,
      fecha: prediction.match.fecha,
      equipoLocal: prediction.match.homeTeam.name,
      equipoVisitante: prediction.match.awayTeam.name,
      golesLocal: prediction.match.homeGoals,
      golesVisitante: prediction.match.awayGoals,
      pronosticoLocal: prediction.homeGoalsPredicted,
      pronosticoVisitante: prediction.awayGoalsPredicted,
      puntos: prediction.points || 0,
      comentario: prediction.comentario
    }))
    
    res.json(history)
  } catch (error) {
    console.error('Error getting user history:', error)
    res.status(500).json({ error: 'Failed to get user history' })
  }
}
