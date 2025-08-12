import { Router } from 'express'
import { 
  getGlobalRanking, 
  getAreaRanking, 
  getUserRanking,
  getUserHistory
} from '../controllers/rankingController'

const router = Router()

// GET /api/ranking/global - Obtener ranking global
router.get('/global', getGlobalRanking)

// GET /api/ranking/areas - Obtener ranking por áreas
router.get('/areas', getAreaRanking)

// GET /api/ranking/user/:userId - Obtener posición específica de un usuario
router.get('/user/:userId', getUserRanking)

// GET /api/ranking/user/:userId/history - Obtener historial de un usuario
router.get('/user/:userId/history', getUserHistory)

export default router
