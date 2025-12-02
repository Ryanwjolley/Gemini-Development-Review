const { auth } = require('../fire')

module.exports = async (userId, update) => {
  /*
  {
    isAdmin: true,
    permissions: [0,2,10],
  }
  */
  const { customClaims } = await auth.getUser(userId)
  await auth.setCustomUserClaims(userId, { ...customClaims, ...update })
}
