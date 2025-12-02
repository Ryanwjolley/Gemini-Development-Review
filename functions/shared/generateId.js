const { customAlphabet } = require('nanoid')
const generateId = customAlphabet(
  'abcdedfghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  24
)

module.exports = generateId
