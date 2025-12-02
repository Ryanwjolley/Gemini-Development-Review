module.exports = (req, res, error, { message = '' } = {}) => {
  if (error.isCustomError) {
    // later for API send error code and the message instead of just the message.
    // will need to update UI to expect uniform response for errors
    // res.status(400).send({ code: error.code, message: error.message })
    res.status(400).send(error.message)
    return
  }
  console.error(`${req.url} error: `, error)
  res.status(500).send(`${message}`)
}
