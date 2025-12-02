const _ = require('lodash')
const { permissions } = require('@shared/shared')

module.exports = requiredList => async (req, res, next) => {
  try {
    const hasPermission =
      _.includes(req.user.permissions, permissions.admin) ||
      _.some(requiredList, permission =>
        _.includes(req.user.permissions, permission)
      )

    if (!hasPermission) {
      throw new Error('No permission, sorry.')
    }
    next()
    return
  } catch (e) {
    console.error('requirePermissions error. ', e, {
      userId: req.user.uid,
      required: requiredList,
      actualPermissions: req.user.permissions,
    })
    res.status(403).send('Insufficient permissions')
  }
}
