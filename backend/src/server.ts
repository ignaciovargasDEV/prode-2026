import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'

// Importar rutas
import userRoutes from './routes/users'
import matchRoutes from './routes/matches'
import predictionRoutes from './routes/predictions'
import rankingRoutes from './routes/ranking'
import authRoutes from './routes/auth'

// Cargar variables de entorno
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}))
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Permitir cualquier origen en Railway
    : ['http://localhost:3000', 'http://localhost:3001']
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// En producción, servir archivos estáticos del frontend
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos de Next.js standalone
  app.use('/_next', express.static(path.join(__dirname, '../../.next/static')))
  app.use('/static', express.static(path.join(__dirname, '../../.next/static')))
  app.use(express.static(path.join(__dirname, '../../public')))
}

// Rutas de API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Prode API is running',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/users', userRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/predictions', predictionRoutes)
app.use('/api/ranking', rankingRoutes)
app.use('/api/auth', authRoutes)

// En producción, servir el archivo HTML del frontend para todas las rutas no-API
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    if (!req.url?.startsWith('/api/')) {
      // En Next.js standalone, simplemente envía un HTML básico que redirige
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Prode 2026</title>
            <meta http-equiv="refresh" content="0; url=/auth/login">
          </head>
          <body>
            <p>Redirecting to application...</p>
            <script>window.location.href = '/auth/login';</script>
          </body>
        </html>
      `)
    } else {
      res.status(404).json({
        error: 'API Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
      })
    }
  })
} else {
  // En desarrollo, solo manejar errores 404 para API
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Endpoint not found',
      message: `Cannot ${req.method} ${req.originalUrl}`
    })
  })
}

// Manejo global de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message)
  console.error('Stack:', err.stack)
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
