const { permissions } = require('@shared/shared')
const {
  handleError,
  requireAdmin,
  updateUserClaims,
  requirePermissions,
} = require('../utils')
const { auth } = require('../fire')

module.exports = app => {
  app.post('/admin/user/update-claims', requireAdmin, async (req, res) => {
    // app.post('/admin/user/update-claims', async (req, res) => {
    // mostly just for dev/api access to update claims, not really used from UI anywhere
    const { userId, claims } = req.body

    try {
      await updateUserClaims(userId, claims)
      res.send()
    } catch (e) {
      handleError(req, res, e, { message: e })
    }
  })

  app.post(
    '/admin/user/impersonate',
    requirePermissions([permissions.admin]),
    async (req, res) => {
      try {
        const { userId } = req.body
        const token = await auth.createCustomToken(userId)
        res.send(token)
      } catch (e) {
        handleError(req, res, e, { message: e })
      }
    }
  )
}
