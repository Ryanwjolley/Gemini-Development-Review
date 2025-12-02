const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JDE_JWT_SECRET

const sign = (payload, options = { expiresIn: '7d' }) =>
  jwt.sign(payload, jwtSecret, options)

const verify = token => jwt.verify(token, jwtSecret)

module.exports = { sign, verify }
