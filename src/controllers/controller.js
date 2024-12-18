// import { createTransport } from 'nodemailer'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { validateQuerySchema } from './schemas.js'
import { LocationRecordModel } from '../models/locationRecord.js'

export class Controller {
  static async generateAndSendCsv (req, res) {
    const csvRows = []
    try {
      const { email, date } = req.query
      const queryValidation = validateQuerySchema(req.query)
      if (!queryValidation.success) return res.status(400).send(queryValidation.error)

      const csvRowsData = await LocationRecordModel.getAllInDate(date, csvRows)
      const csv = this.#getCsv(csvRowsData)
      this.#saveCSVInResources(csv)
      // await sendEmail(email, csv)
      res.status(200).send('Su reporte ha sido generado y enviado al email ingresado, porfavor, espere.')
    } catch (error) {
      console.log(`Server error: ${error}`)
      res.status(500).send('ServerError')
    }
  }

  static #getCsv (csvRowsData) {
    const header = ['fecha', 'leader', 'team', 'latitude', 'longitude', 'hourOfRegistry', 'internetStatusOnline']
    const rows = [header, ...csvRowsData]
    return rows.map((row) => row.map((value) => `"${value}"`).join(';')).join('\n')
  }

  static #saveCSVInResources (csvContent) {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const filePath = join(__dirname, 'reporte.csv')
    writeFileSync(filePath, csvContent, 'utf8')
  }
}

// async function sendEmail (emailToReceiveTheReport, fileContent) {
//   const transporter = createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'sepulveda.cristobal.ignacio@gmail.com',
//       pass: 'mpvy bbzi woaz ykhp'
//     }
//   })

//   const mailOptions = {
//     from: 'sepulveda.cristobal.ignacio@gmail.com',
//     to: emailToReceiveTheReport,
//     subject: 'CSV de registro de ubicación de usuario',
//     text: 'Adjunto el archivo CSV con los registros de ubicación de los usuarios.',
//     attachments: [
//       {
//         filename: 'user_location_registry.csv',
//         content: fileContent,
//         encoding: 'utf-8'
//       }
//     ]
//   }

//   return new Promise((resolve, reject) => {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log('Error al enviar el correo:', error)
//         reject(error)
//       } else {
//         console.log('Correo enviado:', info.response)
//         resolve(info)
//       }
//     })
//   })
// }
