import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'
import requestRoutes from './routes/requests.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://seerr-flblm1q5a-adrians-projects-38e5ae39.vercel.app',
    /\.vercel\.app$/
  ]
}))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' })
})

app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})