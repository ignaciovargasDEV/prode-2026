import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        area: true,
        createdAt: true
      }
    })
    
    res.json(users)
  } catch (error) {
    console.error('Error getting users:', error)
    res.status(500).json({ error: 'Failed to get users' })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        predictions: {
          include: {
            match: {
              include: {
                homeTeam: true,
                awayTeam: true
              }
            }
          }
        }
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error getting user:', error)
    res.status(500).json({ error: 'Failed to get user' })
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, nombre, apellido, area, password } = req.body
    
    if (!email || !nombre || !apellido || !area || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, nombre, apellido, area, password' 
      })
    }
    
    // Hash de la contraseña
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await prisma.user.create({
      data: {
        email,
        nombre,
        apellido,
        area,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        area: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    res.status(201).json(user)
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    // Error de email duplicado
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' })
    }
    
    res.status(500).json({ error: 'Failed to create user' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { nombre, apellido, area } = req.body
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(apellido && { apellido }),
        ...(area && { area })
      }
    })
    
    res.json(user)
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.status(500).json({ error: 'Failed to update user' })
  }
}

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Obtener estadísticas del usuario
    const predictions = await prisma.prediction.findMany({
      where: { userId: id },
      include: {
        match: true
      }
    })
    
    const totalPredictions = predictions.length
    const completedMatches = predictions.filter(p => p.match.status === 'FINALIZADO')
    const totalMatches = await prisma.match.count()
    
    let exactMatches = 0
    let partialMatches = 0
    let totalPoints = 0
    
    completedMatches.forEach(prediction => {
      const { match } = prediction
      if (match.homeGoals !== null && match.awayGoals !== null) {
        const points = prediction.points || 0
        totalPoints += points
        
        if (prediction.homeGoalsPredicted === match.homeGoals && 
            prediction.awayGoalsPredicted === match.awayGoals) {
          exactMatches++
        } else if (points > 0) {
          partialMatches++
        }
      }
    })
    
    const accuracy = completedMatches.length > 0 
      ? Math.round((exactMatches + partialMatches) / completedMatches.length * 100)
      : 0
    
    res.json({
      totalPredictions,
      totalMatches,
      accuracy,
      exactMatches,
      partialMatches,
      totalPoints,
      currentStreak: 0 // TODO: Implementar cálculo de racha
    })
  } catch (error) {
    console.error('Error getting user stats:', error)
    res.status(500).json({ error: 'Failed to get user stats' })
  }
}
