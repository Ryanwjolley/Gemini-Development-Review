const express = require('express')
const cors = require('cors')
const compression = require('compression')
const _ = require('lodash')
const { version: appVersion } = require('../package.json')
const app = express()
const { auth } = require('./fire')
const routes = require('./routes')
const corsWhiteList = [
  'http://localhost',
  'https://localhost',
  // TEMPLATE_TODO add pretty domain here, update repo-template-demo
  'https://repo-template-demo.web.app',
  'https://repo-template-demo-dev.web.app',
]

// app.use(express.json())
app.use(compression())
app.use(
  cors({
    origin: (origin, callback) => {
      if (_.some(corsWhiteList, url => _.startsWith(origin, url) || !origin)) {
        return callback(null, true)
      } else {
        console.error('CORS blocked URL: ', origin)
        return callback(new Error('Not allowed'))
      }
    },
  })
)

const nonFirebaseAuthUrls = [
  '/app-version',
  '/error',
  '/user/verify-sign-in-token',
]

app.use((req, res, next) => {
  if (_.some(nonFirebaseAuthUrls, url => _.startsWith(req.url, url))) {
    return next()
  }

  // validateFirebaseToken - I got this middleware from got from here: https://github.com/firebase/functions-samples/blob/master/authorized-https-endpoint/functions/index.js
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    res.status(403).send('Unauthorized')
    return next()
  }

  const idToken = req.headers.authorization.split('Bearer ')[1]

  return auth
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      req.user = decodedIdToken
      return next()
    })
    .catch(error => {
      console.error('Error while verifying Firebase ID token:', error)
      res.status(403).send('Unauthorized')
    })
})

app.use((req, _res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null
  const userAgent = req.headers['user-agent'] || ''
  const { uid } = req.user || { uid: null }
  console.log(
    'audit log',
    JSON.stringify({ ip, userAgent, uid, method: req.method, url: req.url })
  )
  return next()
})

app.get('/app-version', (_req, res) => {
  res.send(appVersion)
})

routes(app)

app.use((err, req, res, next) => {
  console.error(
    `Error with request to URL: `,
    req.url,
    'Error stack',
    err.stack
  )

  if (res.headersSent) {
    return next()
  }

  res.status(500).send('Internal error')
  return next()
})

module.exports = app
