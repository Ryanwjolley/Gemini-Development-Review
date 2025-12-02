const _ = require('lodash')

const setObjVal = (obj, path, value) => _.setWith(obj, path, value, Object) // cuz of phases being numeric keys. see: https://stackoverflow.com/questions/43044579/lodash-set-object-not-able-to-create-child-object-with-an-integer-as-key

module.exports = setObjVal
