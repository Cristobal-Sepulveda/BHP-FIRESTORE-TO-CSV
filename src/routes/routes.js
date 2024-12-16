import { Router } from 'express'
import generateAndSendCsv from '../controllers/controller.js'

const router = Router()

router.get('/generateAndSendCsv', generateAndSendCsv)

export default router
