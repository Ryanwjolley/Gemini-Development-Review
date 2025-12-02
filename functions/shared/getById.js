const _ = require('lodash')

const getById = (array, idOrObject, key) => {
  const criteria = _.isObject(idOrObject) ? idOrObject : { id: idOrObject }
  const obj = _.find(array, criteria) || {}

  return !key ? obj : obj[key]
}

module.exports = getById
