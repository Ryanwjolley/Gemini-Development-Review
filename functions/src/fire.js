const { getAuth } = require('firebase-admin/auth')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')
const { initializeApp, cert } = require('firebase-admin/app')
const env = process.env.JDE_ENV

let app
if (env === 'live') {
  app = initializeApp({
    credential: cert(require('../config/service-account-key.json')),
    storageBucket: 'gs://repo-template-demo.appspot.com',
  })
} else if (env === 'dev') {
  app = initializeApp({
    credential: cert(require('../config/service-account-key-dev.json')),
    storageBucket: 'gs://repo-template-demo-dev.appspot.com',
  })
} else {
  throw new Error('Invalid env variable')
}
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const storageBucket = storage.bucket()

module.exports = { auth, db, storageBucket }
