/* eslint-disable no-prototype-builtins */
// yay to https://hackernoon.com/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d
const executeIfFunction = f => (typeof f === 'function' ? f() : f)
const switchcase = cases => defaultCase => key =>
  cases.hasOwnProperty(key) ? cases[key] : defaultCase
const switchy = (key, cases) =>
  executeIfFunction(switchcase(cases)(cases.default)(key))

module.exports = switchy
