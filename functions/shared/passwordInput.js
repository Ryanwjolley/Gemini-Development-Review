const _ = require('lodash')
// at least 6 characters with at least
// one upper case,
// one lower case,
// number, and special character or
// something like that?
const validate = str => {
  const hasEnoughChars = str.length >= 6
  const hasLower = Boolean(str.match(/[a-z]/))
  const hasUpper = Boolean(str.match(/[A-Z]/))
  const hasNumber = Boolean(str.match(/[0-9]/))
  const hasSpecial = Boolean(str.match(/[^a-zA-Z0-9]/))
  const isStrong = _.every([
    hasEnoughChars,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
  ])

  return {
    isStrong,
    hasEnoughChars,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
  }
}

const isStrong = str => validate(str).isStrong

module.exports = {
  validate,
  isStrong,
}
