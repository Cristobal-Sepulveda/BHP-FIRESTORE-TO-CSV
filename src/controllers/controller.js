import { createTransport } from 'nodemailer'
// import { writeFileSync } from 'node:fs'
// import { join, dirname } from 'path'
// import { fileURLToPath } from 'url'
import { validateQuerySchema } from './schemas.js'

async function generateAndSendCsv (req, res) {
  try {
    const { email, date } = req.query
    const queryValidation = validateQuerySchema(req.query)
    if (!queryValidation.success) return res.status(400).send(queryValidation.error)
    const csv = await getCsv(date)
    // await saveCSVInResources(csv)
    await sendEmail(email, csv)
    res.status(200).send('Su reporte ha sido generado y enviado al email ingresado, porfavor, espere.')
  } catch (error) {
    console.log(`Server error: ${error}`)
    res.status(500).send('ServerError')
  }
}

async function getCsv (date) {
  const csvRows = []
  const snapshot = await firestoreGCP.collection(collectionName).get()

  for (const doc of snapshot.docs) {
    const subcollections = await doc.ref.listCollections()
    if (subcollections.length === 0) continue

    const userLocationRegistry = subcollections[0]
    const userLocationData = await userLocationRegistry.get()

    for (const subDoc of userLocationData.docs) {
      const [, month, year] = subDoc.id.split('-')
      const subDocDate = `${month}/${year}`
      const formattedDate = date.replace('-', '/')
      if (subDocDate !== formattedDate) continue

      const subDocData = subDoc.data()
      const { hoursOfRegistry, internetStatusOnline, geoPoints } = subDocData

      for (let i = 0; i < hoursOfRegistry.length; i++) {
        const row = [
          subDoc.id,
          subDocData.leader?.name,
          subDocData.team?.team,
          geoPoints[i]._latitude,
          geoPoints[i]._longitude,
          hoursOfRegistry[i],
          internetStatusOnline[i] ? 'Online' : 'Offline'
        ]
        csvRows.push(row)
      }
    }
  }

  const header = ['fecha', 'leader', 'team', 'latitude', 'longitude', 'hourOfRegistry', 'internetStatusOnline']
  const rows = [header, ...csvRows]
  return rows.map((row) => row.map((value) => `"${value}"`).join(';')).join('\n')
}

async function sendEmail (emailToReceiveTheReport, fileContent) {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'sepulveda.cristobal.ignacio@gmail.com',
      pass: 'mpvy bbzi woaz ykhp'
    }
  })

  const mailOptions = {
    from: 'sepulveda.cristobal.ignacio@gmail.com',
    to: emailToReceiveTheReport,
    subject: 'CSV de registro de ubicación de usuario',
    text: 'Adjunto el archivo CSV con los registros de ubicación de los usuarios.',
    attachments: [
      {
        filename: 'user_location_registry.csv',
        content: fileContent,
        encoding: 'utf-8'
      }
    ]
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error)
        reject(error)
      } else {
        console.log('Correo enviado:', info.response)
        resolve(info)
      }
    })
  })
}

// async function saveCSVInResources (csvContent) {
//   const __filename = fileURLToPath(import.meta.url)
//   const __dirname = dirname(__filename)
//   const filePath = join(__dirname, 'reporte.csv')
//   writeFileSync(filePath, csvContent, 'utf8')
// }

export default generateAndSendCsv
