const _ = require('lodash')
const { permissions } = require('@shared/shared')
const {
  handleError,
  requireAdmin,
  requirePermissions,
  updateUserClaims,
  getPermissionList,
} = require('../../utils')
const { db, auth } = require('../../fire')

module.exports = app => {
  // user creation happens in functions/index -> functions.auth.user().onCreate trigger
  app.post(
    '/user/update',
    requirePermissions([permissions.admin]),
    async (req, res) => {
      const timestamp = new Date()
      try {
        const { uid } = req.user
        const { userId, name, email, vpEmail, permissions, appRoles, enabled } =
          req.body

        await db.collection('users').doc(userId).update({
          name,
          email,
          vpEmail,
          permissions,
          appRoles,
          enabled,
          dateModified: timestamp,
          lastModifiedBy: uid,
        })

        await auth.updateUser(userId, { disabled: !enabled })
        await updateUserClaims(userId, {
          permissions: getPermissionList({ permissions }),
        })

        res.send()
      } catch (e) {
        handleError(req, res, e, { message: 'Error updating user' })
      }
    }
  )

  app.post('/user/delete', requireAdmin, async (req, res) => {
    try {
      const { email } = req.body
      if (_.some([email], _.isUndefined)) {
        throw new Error('Missing required params')
      }
      const { uid } = await auth.getUserByEmail(email)
      console.log(`deleting user with email ${email}`)

      await db.collection('users').doc(uid).delete()
      await auth.deleteUser(uid)
      res.send(`Deleted user ${uid}`)
    } catch (e) {
      handleError(req, res, e, { message: e })
    }
  })
}
