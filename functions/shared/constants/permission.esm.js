// ES6 version
export const permissions = {
  admin: 0,
}

export const permissionGroups = (() => {
  const admin = [permissions.admin]

  return {
    admin,
  }
})()

const mapValues = (obj, fn) => {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = fn(value, key)
  }
  return result
}

export const permissionGroupNames = mapValues(permissionGroups, (g, k) => k)

