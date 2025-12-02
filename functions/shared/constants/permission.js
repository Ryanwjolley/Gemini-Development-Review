const _ = require('lodash')

const permissions = {
  /*
    NOTE: 
    - gotta make sure numbers are unique when adding new ones
    - max number of permissions probably not more than ~200 since custom claims size is 1000 bytes, so don't grow this list too big
  */
  admin: 0,
  // editProjectMgmtPlan: 1,
}

const permissionGroups = (() => {
  const admin = [permissions.admin]

  return {
    admin,
  }
})()

module.exports = {
  permissions,
  permissionGroups,
  permissionGroupNames: _.mapValues(permissionGroups, (g, k) => k),
}
