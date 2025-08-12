import { Router } from 'express'
import { 
  getMatches, 
  getMatchById, 
  createMatch, 
  updateMatch,
  getUpcomingMatches,
  getRecentResults
} from '../controllers/matchController'

const router = Router()

// GET /api/matches - Obtener todos los partidos
router.get('/', getMatches)

// GET /api/matches/upcoming - Obtener próximos partidos
router.get('/upcoming', getUpcomingMatches)

// GET /api/matches/recent - Obtener resultados recientes
router.get('/recent', getRecentResults)

// GET /api/matches/:id - Obtener partido por ID
router.get('/:id', getMatchById)

// POST /api/matches - Crear nuevo partido
router.post('/', createMatch)

// PUT /api/matches/:id - Actualizar partido
router.put('/:id', updateMatch)

export default router
