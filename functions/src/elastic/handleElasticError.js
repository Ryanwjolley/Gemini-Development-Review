const _ = require('lodash')
const handleElasticError = err => {
  // just catch to log elastic specific error and re-throw it
  const errResponse = _.get(err, 'meta.body.error')
  if (errResponse) {
    console.error(errResponse)
  }
  throw err
}

module.exports = handleElasticError
