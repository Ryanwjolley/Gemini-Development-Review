// ES6 version
const executeIfFunction = f => (typeof f === 'function' ? f() : f)
const switchcase = cases => defaultCase => key =>
  Object.prototype.hasOwnProperty.call(cases, key) ? cases[key] : defaultCase
const switchy = (key, cases) =>
  executeIfFunction(switchcase(cases)(cases.default)(key))

export default switchy

