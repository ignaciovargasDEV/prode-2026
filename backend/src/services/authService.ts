import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface RegisterData {
  email: string
  password: string
  nombre: string
  apellido: string
  area: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    nombre: string
    apellido: string
    area: string
  }
  token: string
  expiresAt: Date
}

class AuthService {
  private readonly JWT_SECRET: string
  private readonly JWT_EXPIRES_IN: string
  private readonly SALT_ROUNDS = 12

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Verificar si el email ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      })

      if (existingUser) {
        throw new Error('El email ya está registrado')
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS)

      // Crear el usuario
      const user = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          password: hashedPassword,
          nombre: data.nombre,
          apellido: data.apellido,
          area: data.area
        },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          area: true
        }
      })

      // Crear sesión y token
      const { token, expiresAt } = await this.createSession(user.id)

      return {
        user,
        token,
        expiresAt
      }
    } catch (error) {
      console.error('Error en register:', error)
      throw error
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      // Buscar el usuario
      const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      })

      if (!user) {
        throw new Error('Credenciales inválidas')
      }

      if (!user.isActive) {
        throw new Error('Cuenta desactivada')
      }

      // Verificar la contraseña
      const isValidPassword = await bcrypt.compare(data.password, user.password)
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas')
      }

      // Actualizar último login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      })

      // Crear sesión y token
      const { token, expiresAt } = await this.createSession(user.id)

      return {
        user: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          area: user.area
        },
        token,
        expiresAt
      }
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  async logout(token: string): Promise<void> {
    try {
      // Eliminar la sesión
      await prisma.userSession.delete({
        where: { token }
      })
    } catch (error) {
      console.error('Error en logout:', error)
      // No lanzar error si la sesión no existe
    }
  }

  async validateSession(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; sessionId: string }
      
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

      if (!session || !session.user.isActive) {
        throw new Error('Sesión inválida')
      }

      return session.user
    } catch (error) {
      throw new Error('Sesión inválida')
    }
  }

  async refreshToken(oldToken: string): Promise<AuthResponse> {
    try {
      const user = await this.validateSession(oldToken)
      
      // Eliminar la sesión anterior
      await this.logout(oldToken)
      
      // Crear nueva sesión
      const { token, expiresAt } = await this.createSession(user.id)

      return {
        user,
        token,
        expiresAt
      }
    } catch (error) {
      throw new Error('No se pudo renovar el token')
    }
  }

  private async createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
    // Calcular fecha de expiración
    const expiresAt = new Date()
    const daysToExpire = parseInt(this.JWT_EXPIRES_IN.replace('d', '')) || 7
    expiresAt.setDate(expiresAt.getDate() + daysToExpire)

    // Crear sesión en la base de datos
    const session = await prisma.userSession.create({
      data: {
        userId,
        token: '', // Se actualizará después
        expiresAt
      }
    })

    // Crear token JWT
    const token = jwt.sign(
      { 
        userId, 
        sessionId: session.id 
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
    )

    // Actualizar la sesión con el token
    await prisma.userSession.update({
      where: { id: session.id },
      data: { token }
    })

    return { token, expiresAt }
  }

  async cleanExpiredSessions(): Promise<void> {
    try {
      await prisma.userSession.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })
    } catch (error) {
      console.error('Error limpiando sesiones expiradas:', error)
    }
  }
}

export default new AuthService()
