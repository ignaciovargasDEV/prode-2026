import { Router } from 'express'
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  getUserStats 
} from '../controllers/userController'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// GET /api/users - Obtener todos los usuarios (requiere auth)
router.get('/', authenticateToken, getUsers)

// GET /api/users/:id - Obtener usuario por ID (requiere auth)
router.get('/:id', authenticateToken, getUserById)

// POST /api/users - Crear nuevo usuario (endpoint legacy, usar /auth/register)
router.post('/', createUser)

// PUT /api/users/:id - Actualizar usuario (requiere auth)
router.put('/:id', authenticateToken, updateUser)

// GET /api/users/:id/stats - Obtener estadísticas del usuario (requiere auth)
router.get('/:id/stats', authenticateToken, getUserStats)

export default router
