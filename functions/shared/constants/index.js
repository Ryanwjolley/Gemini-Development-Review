const main = require('./main')
const permission = require('./permission')
const applications = require('./applications')

module.exports = {
  ...main,
  ...permission,
  ...applications,
}
