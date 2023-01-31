import cors, { CorsOptions } from 'cors'
import 'dotenv/config'
import express from 'express'
import { handleErrorsMiddleware } from './middleware/handleErrors'
import mascotaRoutes from './routes/mascota'
import veterinarioRoutes from './routes/veterinario'

const app = express()

const allowedOrigins = ['postman-client', 'http://localhost:3000', process.env.FRONTEND_URL!]

const corsOptions: CorsOptions = {
  origin: allowedOrigins
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())

app.use('/api/v2/veterinarios', veterinarioRoutes)
app.use('/api/v2/mascotas', mascotaRoutes)
app.use(handleErrorsMiddleware)

const PORT = Number(process.env.PORT) || 4000
app.listen(PORT, () => console.log(`Server Running on port: ${ PORT } 🚀🚀`))