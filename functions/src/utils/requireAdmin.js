module.exports = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error('Not an admin, sorry.')
    }
    next()
    return
  } catch (e) {
    console.error('requireAdmin error', e)
    res.status(403).send('Unauthorized')
  }
}
