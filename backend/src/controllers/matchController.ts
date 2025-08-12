import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getMatches = async (req: Request, res: Response) => {
  try {
    const { fase, status } = req.query
    
    const matches = await prisma.match.findMany({
      where: {
        ...(fase && { fase: fase as any }),
        ...(status && { status: status as any })
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        predictions: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                apellido: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha: 'asc'
      }
    })
    
    res.json(matches)
  } catch (error) {
    console.error('Error getting matches:', error)
    res.status(500).json({ error: 'Failed to get matches' })
  }
}

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        predictions: {
          include: {
            user: {
              select: {
                id: true,
                nombre: true,
                apellido: true
              }
            }
          }
        }
      }
    })
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }
    
    res.json(match)
  } catch (error) {
    console.error('Error getting match:', error)
    res.status(500).json({ error: 'Failed to get match' })
  }
}

export const createMatch = async (req: Request, res: Response) => {
  try {
    const { fecha, homeTeamId, awayTeamId, fase = 'GRUPOS' } = req.body
    
    if (!fecha || !homeTeamId || !awayTeamId) {
      return res.status(400).json({ 
        error: 'Missing required fields: fecha, homeTeamId, awayTeamId' 
      })
    }
    
    const match = await prisma.match.create({
      data: {
        fecha: new Date(fecha),
        homeTeamId,
        awayTeamId,
        fase
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })
    
    res.status(201).json(match)
  } catch (error) {
    console.error('Error creating match:', error)
    res.status(500).json({ error: 'Failed to create match' })
  }
}

export const updateMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { homeGoals, awayGoals, status } = req.body
    
    const match = await prisma.match.update({
      where: { id },
      data: {
        ...(homeGoals !== undefined && { homeGoals }),
        ...(awayGoals !== undefined && { awayGoals }),
        ...(status && { status })
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    })
    
    // Si el partido se finalizó, calcular puntos de las predicciones
    if (status === 'FINALIZADO' && homeGoals !== undefined && awayGoals !== undefined) {
      await calculatePredictionPoints(id, homeGoals, awayGoals)
    }
    
    res.json(match)
  } catch (error: any) {
    console.error('Error updating match:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Match not found' })
    }
    
    res.status(500).json({ error: 'Failed to update match' })
  }
}

export const getUpcomingMatches = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query
    
    const matches = await prisma.match.findMany({
      where: {
        status: 'PENDIENTE',
        fecha: {
          gte: new Date()
        }
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        predictions: userId ? {
          where: {
            userId: userId as string
          }
        } : false
      },
      orderBy: {
        fecha: 'asc'
      },
      take: 20
    })
    
    res.json(matches)
  } catch (error) {
    console.error('Error getting upcoming matches:', error)
    res.status(500).json({ error: 'Failed to get upcoming matches' })
  }
}

export const getRecentResults = async (req: Request, res: Response) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        status: 'FINALIZADO'
      },
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: {
        fecha: 'desc'
      },
      take: 10
    })
    
    res.json(matches)
  } catch (error) {
    console.error('Error getting recent results:', error)
    res.status(500).json({ error: 'Failed to get recent results' })
  }
}

// Función auxiliar para calcular puntos de predicciones
const calculatePredictionPoints = async (matchId: string, homeGoals: number, awayGoals: number) => {
  try {
    const predictions = await prisma.prediction.findMany({
      where: { matchId }
    })
    
    for (const prediction of predictions) {
      let points = 0
      
      // Resultado exacto: 3 puntos
      if (prediction.homeGoalsPredicted === homeGoals && 
          prediction.awayGoalsPredicted === awayGoals) {
        points = 3
      }
      // Ganador correcto: 1 punto
      else if (
        (prediction.homeGoalsPredicted > prediction.awayGoalsPredicted && homeGoals > awayGoals) ||
        (prediction.homeGoalsPredicted < prediction.awayGoalsPredicted && homeGoals < awayGoals) ||
        (prediction.homeGoalsPredicted === prediction.awayGoalsPredicted && homeGoals === awayGoals)
      ) {
        points = 1
      }
      
      await prisma.prediction.update({
        where: { id: prediction.id },
        data: { points }
      })
    }
  } catch (error) {
    console.error('Error calculating prediction points:', error)
  }
}
