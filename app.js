import express from 'express'
import dotenv from 'dotenv'
import { generateAndSendCsvRouter } from './src/routes/routes.js'
dotenv.config({ path: '.env' })

const app = express()
const PORT = process.env.PORT || 8000

app
  .disable('x-powered-by')
  .use(express.json())
  .use('/', generateAndSendCsvRouter)
  .listen(PORT, () => { console.log(`Servidor escuchando en el puerto ${PORT}`) })
