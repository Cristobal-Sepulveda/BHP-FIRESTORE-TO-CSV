import express from 'express'
// import dotenv from 'dotenv'
import routes from './src/routes/routes.js'

const app = express()

const PORT = process.env.PORT || 8000

app
  .disable('x-powered-by')
  .use(express.json())
  .use('/', routes)
  .listen(PORT, () => { console.log(`Servidor escuchando en el puerto ${PORT}`) })
