import { Router } from 'express'
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  getUserStats 
} from '../controllers/userController'

const router = Router()

// GET /api/users - Obtener todos los usuarios
router.get('/', getUsers)

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', getUserById)

// POST /api/users - Crear nuevo usuario
router.post('/', createUser)

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', updateUser)

// GET /api/users/:id/stats - Obtener estadísticas del usuario
router.get('/:id/stats', getUserStats)

export default router
