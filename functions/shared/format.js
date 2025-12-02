const _ = require('lodash')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const toDate = require('./toDate')
const { numberFormats } = require('./constants/main')
const switchy = require('./switchy')

dayjs.extend(customParseFormat)

const prettyDate = dateObject => {
  const d = dayjs(toDate(dateObject))
  if (!d.isValid()) return ''
  return d.format('MM/DD/YYYY')
}
const prettyDateTime = dateObject => {
  const d = dayjs(toDate(dateObject))
  if (!d.isValid()) return ''
  return d.format('MM/DD/YYYY h:mmA')
}

const numberWithCommas = x => {
  // thanks https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  const parts = _.toString(x).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const money = (
  num,
  { decimals = 2, dollarSign = true, emptyValue = '' } = {}
) => {
  if (!_.isFinite(num)) return emptyValue

  const formatted = `${dollarSign ? '$' : ''}${numberWithCommas(
    _.round(Math.abs(num), decimals).toFixed(decimals)
  )}`
  return num < 0 ? `(${formatted})` : formatted
}

const decimalToPercent = (num, { decimals = 0, emptyValue = '' } = {}) =>
  !_.isFinite(num) ? emptyValue : `${(num * 100).toFixed(decimals)}%`
const moneyFromCents = num => money(num / 100)
const rounded = (num, { precision = 1, emptyValue = '' } = {}) =>
  _.round(num, precision) || emptyValue

const value = (
  val,
  numberFormat,
  { decimals = 2, percentIsDecimal = false } = {}
) =>
  switchy(numberFormat, {
    [numberFormats.number]: () =>
      !_.isFinite(val)
        ? '--'
        : numberWithCommas(_.round(val, decimals).toFixed(decimals)),
    [numberFormats.currency]: () => money(val, { decimals }),
    [numberFormats.percent]: () =>
      decimalToPercent(percentIsDecimal ? val : val / 100, { decimals }),
    [numberFormats.unformatted]: () => val,
    default: () => val,
  })

const abbrev = (num, numberFormat, { percentIsDecimal = false } = {}) => {
  // turns 3500 into '3.5k'
  // thanks https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
  let abbrevStr = `${_.round(
    numberFormat === numberFormats.percent && percentIsDecimal
      ? num * 100
      : num,
    2
  )}`
  const tier = (Math.log10(Math.abs(num)) / 3) | 0
  if (tier > 0) {
    const symbols = ['', 'k', 'M', 'G', 'T', 'P', 'E']
    const suffix = symbols[tier]
    const scale = Math.pow(10, tier * 3)
    const scaled = num / scale
    abbrevStr = _.round(scaled, 2).toString() + suffix
  }

  return switchy(numberFormat, {
    [numberFormats.number]: () => abbrevStr,
    [numberFormats.currency]: () => `$${abbrevStr}`,
    [numberFormats.percent]: () => `${abbrevStr}%`,
    default: () => abbrevStr,
  })
}

module.exports = {
  prettyDate,
  prettyDateTime,
  numberWithCommas,
  money,
  moneyFromCents,
  decimalToPercent,
  rounded,
  value,
  abbrev,
}
