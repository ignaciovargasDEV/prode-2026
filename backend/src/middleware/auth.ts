import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface AuthRequest extends Request {
  userId?: string
  user?: any
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'No se proporcionó token de acceso'
      })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está configurado')
    }

    // Verificar el token JWT
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; sessionId: string }
    
    // Verificar que la sesión existe y no ha expirado
    const session = await prisma.userSession.findUnique({
      where: {
        id: decoded.sessionId,
        token: token,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            area: true,
            isActive: true
          }
        }
      }
    })

    if (!session) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        message: 'Token inválido o expirado'
      })
    }

    if (!session.user.isActive) {
      return res.status(401).json({
        error: 'Account deactivated',
        message: 'Cuenta desactivada'
      })
    }

    // Agregar información del usuario a la request
    req.userId = session.user.id
    req.user = session.user

    next()
  } catch (error) {
    console.error('Error en authenticateToken:', error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token inválido'
      })
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Error interno del servidor'
    })
  }
}

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return next() // Continuar sin autenticación
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return next()
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string; sessionId: string }
    
    const session = await prisma.userSession.findUnique({
      where: {
        id: decoded.sessionId,
        token: token,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            area: true,
            isActive: true
          }
        }
      }
    })

    if (session && session.user.isActive) {
      req.userId = session.user.id
      req.user = session.user
    }

    next()
  } catch (error) {
    // En caso de error, continuar sin autenticación
    next()
  }
}
