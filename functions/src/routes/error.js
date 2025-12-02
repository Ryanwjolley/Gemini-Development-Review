const _ = require('lodash')
const { db, auth } = require('../fire')
const { handleError } = require('../utils')
const { errorTypes } = require('@shared/shared')

module.exports = app => {
  app.post('/error/send', async (req, res) => {
    const {
      info,
      stack,
      userId,
      location = null,
      errorType = errorTypes.ui,
    } = req.body
    const user = !userId ? { uid: 'not-logged-in' } : await auth.getUser(userId)

    try {
      await db.collection('errors').add({
        dateCreated: new Date(),
        errorType,
        info,
        stack,
        location,
        user: _.pick(user, ['email', 'uid', 'customClaims']),
      })

      res.send()
      console.warn(`UI error for user ${user.uid}`)
    } catch (e) {
      handleError(req, res, e)
    }
  })
}
