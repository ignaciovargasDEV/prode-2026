import { Router } from 'express'
import { 
  getUserPredictions, 
  createPrediction, 
  updatePrediction, 
  deletePrediction,
  getMatchPredictions
} from '../controllers/predictionController'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// GET /api/predictions/user/:userId - Obtener predicciones de un usuario (requiere auth)
router.get('/user/:userId', authenticateToken, getUserPredictions)

// GET /api/predictions/match/:matchId - Obtener predicciones de un partido (requiere auth)
router.get('/match/:matchId', authenticateToken, getMatchPredictions)

// POST /api/predictions - Crear nueva predicción (requiere auth)
router.post('/', authenticateToken, createPrediction)

// PUT /api/predictions/:id - Actualizar predicción (requiere auth)
router.put('/:id', authenticateToken, updatePrediction)

// DELETE /api/predictions/:id - Eliminar predicción (requiere auth)
router.delete('/:id', authenticateToken, deletePrediction)

export default router
