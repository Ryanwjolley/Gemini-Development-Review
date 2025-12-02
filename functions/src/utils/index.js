const _ = require('lodash')
const { permissions } = require('@shared/shared')
const sharedUtils = require('@shared/shared')
const handleError = require('./handleError')
const requireAdmin = require('./requireAdmin')
const requirePermissions = require('./requirePermissions')
const updateUserClaims = require('./updateUserClaims')
const jwt = require('./jwt')
const mapDocsArray = require('./mapDocsArray')
const getPermissionList = require('./getPermissionList')

const hasPermission = (userPermissions, requiredList, { every = false } = {}) =>
  _.includes(userPermissions, permissions.admin) ||
  (every
    ? _.every(requiredList, p => _.includes(userPermissions, p))
    : _.some(requiredList, p => _.includes(userPermissions, p)))

module.exports = {
  ...sharedUtils,
  handleError,
  requireAdmin,
  requirePermissions,
  updateUserClaims,
  jwt,
  mapDocsArray,
  getPermissionList,
  hasPermission,
}
