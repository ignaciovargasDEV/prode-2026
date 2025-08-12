import express from 'express'
import rateLimit from 'express-rate-limit'
import authService from '../services/authService'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Rate limiting para auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    error: 'Too many authentication attempts',
    message: 'Demasiados intentos de autenticación. Intenta nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, nombre, apellido, area } = req.body

    // Validaciones básicas
    if (!email || !password || !nombre || !apellido || !area) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Todos los campos son obligatorios'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'La contraseña debe tener al menos 6 caracteres'
      })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Formato de email inválido'
      })
    }

    const result = await authService.register({
      email,
      password,
      nombre,
      apellido,
      area
    })

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: result.user,
      token: result.token,
      expiresAt: result.expiresAt
    })
  } catch (error: any) {
    console.error('Error en /auth/register:', error)
    
    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({
        error: 'Email already exists',
        message: error.message
      })
    }

    res.status(500).json({
      error: 'Registration failed',
      message: 'Error interno del servidor'
    })
  }
})

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email y contraseña son obligatorios'
      })
    }

    const result = await authService.login({ email, password })

    res.json({
      message: 'Login exitoso',
      user: result.user,
      token: result.token,
      expiresAt: result.expiresAt
    })
  } catch (error: any) {
    console.error('Error en /auth/login:', error)
    
    if (error.message === 'Credenciales inválidas' || error.message === 'Cuenta desactivada') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: error.message
      })
    }

    res.status(500).json({
      error: 'Login failed',
      message: 'Error interno del servidor'
    })
  }
})

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      await authService.logout(token)
    }

    res.json({
      message: 'Logout exitoso'
    })
  } catch (error) {
    console.error('Error en /auth/logout:', error)
    res.status(500).json({
      error: 'Logout failed',
      message: 'Error interno del servidor'
    })
  }
})

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    res.json({
      user: req.user
    })
  } catch (error) {
    console.error('Error en /auth/me:', error)
    res.status(500).json({
      error: 'Failed to get user info',
      message: 'Error interno del servidor'
    })
  }
})

// POST /api/auth/refresh - Renovar token
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        error: 'Token required',
        message: 'Token es obligatorio'
      })
    }

    const result = await authService.refreshToken(token)

    res.json({
      message: 'Token renovado exitosamente',
      user: result.user,
      token: result.token,
      expiresAt: result.expiresAt
    })
  } catch (error: any) {
    console.error('Error en /auth/refresh:', error)
    res.status(401).json({
      error: 'Token refresh failed',
      message: 'No se pudo renovar el token'
    })
  }
})

// GET /api/auth/validate - Validar token actual
router.get('/validate', async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        valid: false,
        message: 'No token provided'
      })
    }

    const user = await authService.validateSession(token)

    res.json({
      valid: true,
      user
    })
  } catch (error) {
    res.status(401).json({
      valid: false,
      message: 'Token inválido'
    })
  }
})

export default router
