const _ = require('lodash')
const { permissionGroups } = require('@shared/shared')

module.exports = ({ permissions }) =>
  _(permissions)
    .map(groupKey => permissionGroups[groupKey])
    .flatten()
    .uniq()
    .value()
