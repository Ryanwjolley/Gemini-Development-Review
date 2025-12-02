const _ = require('lodash')

const isEqualIgnoreFalsy = (a, b) =>
  _.isEqualWith(a, b, (val, other) => {
    // firestore may have null but UI may have NaN, so consider em equal
    if (!val && !other) return true
    return undefined
    // don't return anything so it keeps doing deep comparison. note lodash docs: If customizer returns undefined, comparisons are handled by the method instead
  })

module.exports = isEqualIgnoreFalsy
