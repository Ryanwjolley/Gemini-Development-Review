const _ = require('lodash')

const csvify = arrayOfArrays =>
  _.map(arrayOfArrays, arr =>
    _.map(arr, cell => {
      const cellStr = _.toString(cell)
      return cellStr.match(/[\s,"]/)
        ? `"${cellStr.replace(/"/g, '""')}"` // escape double quotes, as well as put quotes around stuff with commas and spaces
        : cellStr
    }).join(',')
  ).join('\n')

module.exports = csvify
