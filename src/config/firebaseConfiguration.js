const firebaseAdmin = require("firebase-admin");
const serviceAccountJson = require("./serviceaccount/worktracker-4a471-e5be62df1754.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountJson),
});

module.exports = firebaseAdmin;