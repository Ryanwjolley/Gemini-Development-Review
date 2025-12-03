// ES6 version
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/

const toDate = dateVal => {
  if (!dateVal) return dateVal

  if (dateVal.toDate) {
    return dateVal.toDate()
  }

  if (dateVal.seconds) {
    return new Date(
      dateVal.seconds * 1000 + (dateVal.nanoseconds || 0) / 1000000
    )
  }

  if (dateVal._seconds) {
    // in the case of stringified firestore dates
    // sent back from api.  yuck-ish, but hey, will have to deal with it
    return new Date(
      dateVal._seconds * 1000 + (dateVal._nanoseconds || 0) / 1000000
    )
  }

  if (isoDateRegex.test(String(dateVal))) {
    return new Date(dateVal)
  }

  return dateVal
}

export default toDate

