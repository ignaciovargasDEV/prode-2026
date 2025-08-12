import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getUserPredictions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    
    const predictions = await prisma.prediction.findMany({
      where: { userId },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    res.json(predictions)
  } catch (error) {
    console.error('Error getting user predictions:', error)
    res.status(500).json({ error: 'Failed to get user predictions' })
  }
}

export const createPrediction = async (req: Request, res: Response) => {
  try {
    const { userId, matchId, homeGoalsPredicted, awayGoalsPredicted, comentario } = req.body
    
    if (!userId || !matchId || homeGoalsPredicted === undefined || awayGoalsPredicted === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, matchId, homeGoalsPredicted, awayGoalsPredicted' 
      })
    }
    
    // Verificar que el partido no haya comenzado
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    })
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' })
    }
    
    if (match.status !== 'PENDIENTE') {
      return res.status(400).json({ error: 'Cannot predict on a match that has already started or finished' })
    }
    
    if (new Date() >= match.fecha) {
      return res.status(400).json({ error: 'Cannot predict on a match that has already started' })
    }
    
    const prediction = await prisma.prediction.create({
      data: {
        userId,
        matchId,
        homeGoalsPredicted,
        awayGoalsPredicted,
        comentario
      },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true
          }
        },
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        }
      }
    })
    
    res.status(201).json(prediction)
  } catch (error: any) {
    console.error('Error creating prediction:', error)
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Prediction already exists for this match' })
    }
    
    res.status(500).json({ error: 'Failed to create prediction' })
  }
}

export const updatePrediction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { homeGoalsPredicted, awayGoalsPredicted, comentario } = req.body
    
    // Verificar que la predicción existe y obtener el partido
    const existingPrediction = await prisma.prediction.findUnique({
      where: { id },
      include: {
        match: true
      }
    })
    
    if (!existingPrediction) {
      return res.status(404).json({ error: 'Prediction not found' })
    }
    
    // Verificar que el partido no haya comenzado
    if (existingPrediction.match.status !== 'PENDIENTE') {
      return res.status(400).json({ error: 'Cannot update prediction on a match that has already started or finished' })
    }
    
    if (new Date() >= existingPrediction.match.fecha) {
      return res.status(400).json({ error: 'Cannot update prediction on a match that has already started' })
    }
    
    const prediction = await prisma.prediction.update({
      where: { id },
      data: {
        ...(homeGoalsPredicted !== undefined && { homeGoalsPredicted }),
        ...(awayGoalsPredicted !== undefined && { awayGoalsPredicted }),
        ...(comentario !== undefined && { comentario })
      },
      include: {
        match: {
          include: {
            homeTeam: true,
            awayTeam: true
          }
        },
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        }
      }
    })
    
    res.json(prediction)
  } catch (error) {
    console.error('Error updating prediction:', error)
    res.status(500).json({ error: 'Failed to update prediction' })
  }
}

export const deletePrediction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Verificar que la predicción existe y obtener el partido
    const existingPrediction = await prisma.prediction.findUnique({
      where: { id },
      include: {
        match: true
      }
    })
    
    if (!existingPrediction) {
      return res.status(404).json({ error: 'Prediction not found' })
    }
    
    // Verificar que el partido no haya comenzado
    if (existingPrediction.match.status !== 'PENDIENTE') {
      return res.status(400).json({ error: 'Cannot delete prediction on a match that has already started or finished' })
    }
    
    if (new Date() >= existingPrediction.match.fecha) {
      return res.status(400).json({ error: 'Cannot delete prediction on a match that has already started' })
    }
    
    await prisma.prediction.delete({
      where: { id }
    })
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting prediction:', error)
    res.status(500).json({ error: 'Failed to delete prediction' })
  }
}

export const getMatchPredictions = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params
    
    const predictions = await prisma.prediction.findMany({
      where: { matchId },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            area: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    res.json(predictions)
  } catch (error) {
    console.error('Error getting match predictions:', error)
    res.status(500).json({ error: 'Failed to get match predictions' })
  }
}
