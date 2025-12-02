const { schema } = require('@shared/shared')
const _ = require('lodash')

const generateMappingsFromSchema = schemaFields => {
  const properties = {}
  _.forEach(schemaFields, (field, fieldName) => {
    // Add regular elastic fields
    if (field.elastic) {
      properties[fieldName] = field.elastic
    }
    // Add elasticCustom fields flattened to top level
    if (field.elasticCustom) {
      _.merge(properties, field.elasticCustom)
    }
  })
  return properties
}

const users = {
  mappings: {
    properties: generateMappingsFromSchema(schema.user.fields),
  },
}

module.exports = {
  users,
}
