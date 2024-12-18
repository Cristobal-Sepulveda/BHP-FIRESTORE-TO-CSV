import firebaseAdmin from '../config/firebaseConfiguration.js'
const firestoreGCP = firebaseAdmin.firestore()

export class LocationRecordModel {
  static async getAllInDate (date, csvRows) {
    const collectionName = 'Users'
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

    return csvRows
  }
}
