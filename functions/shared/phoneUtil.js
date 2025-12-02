const _ = require('lodash')
const prettyFormatStr = '(###) ###-####'
const clean = ph => (!ph ? '' : ph.replace(/\D/g, ''))
const prettyFormat = str => {
  if (!str) return ''
  let prettyStr = ''
  let index = 0
  _.forEach(prettyFormatStr, char => {
    if (char === '#') {
      prettyStr += str[index] || ''
      index++
    } else {
      prettyStr += char
    }
  })
  return prettyStr
}
const isValid = val => val.length === 10

module.exports = { clean, isValid, prettyFormatStr, prettyFormat }
