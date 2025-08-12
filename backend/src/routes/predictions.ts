import { Router } from 'express'
import { 
  getUserPredictions, 
  createPrediction, 
  updatePrediction, 
  deletePrediction,
  getMatchPredictions
} from '../controllers/predictionController'

const router = Router()

// GET /api/predictions/user/:userId - Obtener predicciones de un usuario
router.get('/user/:userId', getUserPredictions)

// GET /api/predictions/match/:matchId - Obtener predicciones de un partido
router.get('/match/:matchId', getMatchPredictions)

// POST /api/predictions - Crear nueva predicción
router.post('/', createPrediction)

// PUT /api/predictions/:id - Actualizar predicción
router.put('/:id', updatePrediction)

// DELETE /api/predictions/:id - Eliminar predicción
router.delete('/:id', deletePrediction)

export default router
