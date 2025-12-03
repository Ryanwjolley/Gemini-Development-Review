// ES6 version
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import toDate from './toDate.esm.js'
import { numberFormats } from './constants/main.esm.js'
import switchy from './switchy.esm.js'

dayjs.extend(customParseFormat)

const isFinite = (value) => Number.isFinite(value)
const round = (number, precision = 0) => {
  const multiplier = Math.pow(10, precision)
  return Math.round(number * multiplier) / multiplier
}
const toString = (value) => String(value)

export const prettyDate = dateObject => {
  const d = dayjs(toDate(dateObject))
  if (!d.isValid()) return ''
  return d.format('MM/DD/YYYY')
}

export const prettyDateTime = dateObject => {
  const d = dayjs(toDate(dateObject))
  if (!d.isValid()) return ''
  return d.format('MM/DD/YYYY h:mmA')
}

export const numberWithCommas = x => {
  const parts = toString(x).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const money = (
  num,
  { decimals = 2, dollarSign = true, emptyValue = '' } = {}
) => {
  if (!isFinite(num)) return emptyValue

  const formatted = `${dollarSign ? '$' : ''}${numberWithCommas(
    round(Math.abs(num), decimals).toFixed(decimals)
  )}`
  return num < 0 ? `(${formatted})` : formatted
}

export const decimalToPercent = (num, { decimals = 0, emptyValue = '' } = {}) =>
  !isFinite(num) ? emptyValue : `${(num * 100).toFixed(decimals)}%`

export const moneyFromCents = num => money(num / 100)

export const rounded = (num, { precision = 1, emptyValue = '' } = {}) =>
  round(num, precision) || emptyValue

export const value = (
  val,
  numberFormat,
  { decimals = 2, percentIsDecimal = false } = {}
) =>
  switchy(numberFormat, {
    [numberFormats.number]: () =>
      !isFinite(val)
        ? '--'
        : numberWithCommas(round(val, decimals).toFixed(decimals)),
    [numberFormats.currency]: () => money(val, { decimals }),
    [numberFormats.percent]: () =>
      decimalToPercent(percentIsDecimal ? val : val / 100, { decimals }),
    [numberFormats.unformatted]: () => val,
    default: () => val,
  })

export const abbrev = (num, numberFormat, { percentIsDecimal = false } = {}) => {
  let abbrevStr = `${round(
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
    abbrevStr = round(scaled, 2).toString() + suffix
  }

  return switchy(numberFormat, {
    [numberFormats.number]: () => abbrevStr,
    [numberFormats.currency]: () => `$${abbrevStr}`,
    [numberFormats.percent]: () => `${abbrevStr}%`,
    default: () => abbrevStr,
  })
}

export default {
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

