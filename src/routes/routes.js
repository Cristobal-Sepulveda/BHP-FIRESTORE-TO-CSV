import { Router } from 'express'
import { Controller } from '../controllers/controller.js'

export const generateAndSendCsvRouter = Router()

generateAndSendCsvRouter.get('/generateAndSendCsv', Controller.generateAndSendCsv)
