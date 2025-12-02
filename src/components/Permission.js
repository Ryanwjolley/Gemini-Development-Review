import _ from 'lodash'
import { getState } from '../globalState'
import { permissions, permissionGroups } from '@shared/shared'

// Note it displays if ANY permission is in list unless 'every' = true
export const hasPermissionUser = (user, perm, { every = false } = {}) => {
  const permissionList = _.isArray(perm) ? perm : [perm]

  if (_.isEmpty(permissionList)) {
    return false
  }
  // this could be optimized if it becomes performance problem
  const allPerms = _(user.permissions)
    .map(groupKey => permissionGroups[groupKey])
    .flatten()
    .value()

  return (
    _.includes(allPerms, permissions.admin) ||
    (every
      ? _.every(permissionList, p => _.includes(allPerms, p))
      : _.some(permissionList, p => _.includes(allPerms, p)))
  )
}

export const hasPermission = perm => hasPermissionUser(getState().user, perm)

export const hasPermissionForOwn = (perm, createdBy) => {
  const { user } = getState()

  return (
    hasPermission(permissions.admin) ||
    (user.id === createdBy && hasPermission(perm))
  )
}

const Permission = ({ allowed, children }) => {
  if (hasPermission(allowed)) {
    return null
  }

  return children
}

export default Permission
