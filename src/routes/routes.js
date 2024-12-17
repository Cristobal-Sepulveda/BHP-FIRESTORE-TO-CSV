import { Router } from 'express'
import generateAndSendCsv from '../controllers/controller.js'

export const generateAndSendCsvRouter = Router()

generateAndSendCsvRouter.get('/generateAndSendCsv', generateAndSendCsv)
