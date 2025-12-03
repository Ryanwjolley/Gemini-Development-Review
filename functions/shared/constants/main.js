const _ = require('lodash')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(utc)
dayjs.extend(customParseFormat)

const dateStrFormat = 'YYYY-MM-DD'

const numberFormats = {
  number: 'number',
  currency: 'currency',
  percent: 'percent',
  unformatted: 'unformatted',
}

const exportFileTypes = {
  pdf: 'pdf',
  png: 'png',
}

const resultsPageSize = 20

module.exports = {
  dateStrFormat,
  numberFormats,
  exportFileTypes,
  resultsPageSize,
}
