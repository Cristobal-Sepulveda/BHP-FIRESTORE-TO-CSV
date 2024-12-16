import firebaseAdmin from 'firebase-admin'
import serviceAccountJson from './serviceaccount/worktracker-4a471-e5be62df1754.json' with { type: "json"}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountJson)
})

export default firebaseAdmin