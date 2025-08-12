import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interfaces para tipado
export interface User {
  id: string
  email: string
  nombre: string
  apellido: string
  area: string
  createdAt: string
}

export interface Team {
  id: string
  name: string
  country: string
  flag?: string
}

export interface Match {
  id: string
  fecha: string
  homeTeam: Team
  awayTeam: Team
  homeGoals: number | null
  awayGoals: number | null
  fase: string
  status: string
  predictions?: Prediction[]
}

export interface Prediction {
  id: string
  userId: string
  matchId: string
  homeGoalsPredicted: number
  awayGoalsPredicted: number
  points: number | null
  comentario?: string
  createdAt: string
  match?: Match
  user?: User
}

export interface RankingUser {
  id: string
  nombre: string
  apellido: string
  area: string
  puntos: number
  posicion: number
  tendencia: string
  cambio: string
  totalPredictions?: number
}

export interface UserStats {
  totalPredictions: number
  totalMatches: number
  accuracy: number
  exactMatches: number
  partialMatches: number
  totalPoints: number
  currentStreak: number
}

// API Functions
export const apiService = {
  // Health check
  health: () => api.get('/health'),

  // Users
  getUsers: (): Promise<{ data: User[] }> => api.get('/users'),
  getUserById: (id: string): Promise<{ data: User }> => api.get(`/users/${id}`),
  createUser: (userData: Omit<User, 'id' | 'createdAt'>): Promise<{ data: User }> => 
    api.post('/users', userData),
  updateUser: (id: string, userData: Partial<User>): Promise<{ data: User }> => 
    api.put(`/users/${id}`, userData),
  getUserStats: (id: string): Promise<{ data: UserStats }> => api.get(`/users/${id}/stats`),

  // Matches
  getMatches: (params?: { fase?: string; status?: string }): Promise<{ data: Match[] }> => 
    api.get('/matches', { params }),
  getMatchById: (id: string): Promise<{ data: Match }> => api.get(`/matches/${id}`),
  getUpcomingMatches: (userId?: string): Promise<{ data: Match[] }> => 
    api.get('/matches/upcoming', { params: userId ? { userId } : {} }),
  getRecentResults: (): Promise<{ data: Match[] }> => api.get('/matches/recent'),
  createMatch: (matchData: any): Promise<{ data: Match }> => api.post('/matches', matchData),
  updateMatch: (id: string, matchData: any): Promise<{ data: Match }> => 
    api.put(`/matches/${id}`, matchData),

  // Predictions
  getUserPredictions: (userId: string): Promise<{ data: Prediction[] }> => 
    api.get(`/predictions/user/${userId}`),
  getMatchPredictions: (matchId: string): Promise<{ data: Prediction[] }> => 
    api.get(`/predictions/match/${matchId}`),
  createPrediction: (predictionData: {
    userId: string
    matchId: string
    homeGoalsPredicted: number
    awayGoalsPredicted: number
    comentario?: string
  }): Promise<{ data: Prediction }> => api.post('/predictions', predictionData),
  updatePrediction: (id: string, predictionData: any): Promise<{ data: Prediction }> => 
    api.put(`/predictions/${id}`, predictionData),
  deletePrediction: (id: string): Promise<void> => api.delete(`/predictions/${id}`),

  // Ranking
  getGlobalRanking: (): Promise<{ data: RankingUser[] }> => api.get('/ranking/global'),
  getAreaRanking: (): Promise<{ data: any[] }> => api.get('/ranking/areas'),
  getUserRanking: (userId: string): Promise<{ data: RankingUser }> => 
    api.get(`/ranking/user/${userId}`),
  getUserHistory: (userId: string): Promise<{ data: any[] }> => 
    api.get(`/ranking/user/${userId}/history`),
}

export default apiService
