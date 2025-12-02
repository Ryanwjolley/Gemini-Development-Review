const _ = require('lodash')

const omitUndefined = obj => _.pickBy(obj, v => !_.isUndefined(v))

module.exports = omitUndefined
