import { initializeApp } from 'firebase/app'
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail as sendPassResetEmail,
  confirmPasswordReset,
  signInWithCustomToken as authSignInWithCustomToken,
} from 'firebase/auth'
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import _ from 'lodash'
import api, { setApiAuth } from '../api'
import toast from '../components/Toast'

const mapDocsArray = s => s.docs.map(doc => ({ id: doc.id, ...doc.data() }))

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
setApiAuth(auth)
const db = getFirestore(app)

// Connect to Firebase emulators when VITE_USE_EMULATORS is set
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9410')
  connectFirestoreEmulator(db, 'localhost', 8410)
}

const usersRef = collection(db, 'users')

window.api = api

let removeGlobalListeners = _.noop
export const setRemoveGlobalListeners = fn => {
  removeGlobalListeners = fn
}

export const signOut = async () => {
  removeGlobalListeners()
  await auth.signOut()
}

export const initApp = callback => {
  onAuthStateChanged(auth, async user => {
    if (user) {
      let token = await user.getIdTokenResult(true)
      if (_.isEmpty(token.claims.permissions)) {
        await new Promise(res => setTimeout(res, 1500))
        // hack to give some time for DB to be updated from functions.auth.user().onCreate trigger.
        // if don't do this the first time they sign in then the user config could be missed
        token = await user.getIdTokenResult(true)
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userConfig = { id: user.uid, ...userDoc.data() }
      callback({ user: userConfig })
    } else {
      removeGlobalListeners()
      callback({ user: null })
    }
  })
}

export const signIn = ({ email, password }) =>
  signInWithEmailAndPassword(auth, email, password)

export const signInWithCustomToken = token =>
  authSignInWithCustomToken(auth, token)

export const sendPasswordResetEmail = email => sendPassResetEmail(auth, email)

export const passwordResetFromEmailLink = ({ oobCode, newPassword }) =>
  confirmPasswordReset(auth, oobCode, newPassword)

const getModifiedFields = (timestamp = new Date()) => ({
  dateModified: timestamp,
  lastModifiedBy: auth.currentUser.uid,
})
const getCreatedFields = () => {
  const timestamp = new Date()

  return {
    ...getModifiedFields(timestamp),
    dateCreated: timestamp,
    createdBy: auth.currentUser.uid,
  }
}

/*

// how storage could be used - 

const storage = getStorage(app)

export const getStoragePublicUrl = filePath => {
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
  }/o/${encodeURIComponent(filePath)}?alt=media`
  return publicUrl
}

export const getUserPhotoUrl = userId =>
  getStoragePublicUrl(storagePath.userPhoto(userId))
*/

export const watchUsers = callback => {
  const removeListener = onSnapshot(
    usersRef,
    s => callback(_.sortBy(mapDocsArray(s), 'name')),
    e => toast.error(`An error occurred getting users: ${e}`)
  )

  return removeListener
}

export const watchErrors = callback => {
  const removeListener = onSnapshot(
    collection(db, 'errors'),
    s => callback(mapDocsArray(s)),
    e => toast.error(`An error occurred getting users: ${e}`)
  )

  return removeListener
}

export const deleteError = id => deleteDoc(doc(db, 'errors', id))
