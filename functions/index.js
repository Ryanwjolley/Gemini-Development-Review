// note that not all these should necessary be deployed to dev. Some may only need to be production only
const { onRequest } = require('firebase-functions/v2/https')
// const { onSchedule } = require('firebase-functions/v2/scheduler')
// const { onDocumentWritten } = require('firebase-functions/v2/firestore')

exports.api = onRequest({ timeoutSeconds: 540, memory: '1GiB' }, (...args) => {
  // yeah, looks weird to require() here, but is recommended: https://medium.com/@duhroach/improving-cloud-function-cold-start-time-2eb6f5700f6
  const api = require('./src/api')
  api(...args)
})

// exports.someScheduledFunction = onSchedule(
//   {
//     // do something 8:00am on 5th-7th and 20th-22nd of the month
//     schedule: '0 8 5-7,20-22 * *',
//     timeoutSeconds: 540,
//     timeZone: 'America/Denver',
//     memory: '1GiB',
//   },
//   async () => {}
// )

// exports.someDatabaseTriggerFunction = onDocumentWritten(
//   { document: 'jobQueues/{docId}', timeoutSeconds: 120 },
//   async event => {
//     try {
//       const snap = event.data
//       const newData = snap.after.data()
//       if (!newData) {
//         console.log('job queue doc deleted', event.id)
//         return
//       }
//     } catch (e) {
//       console.error(e)
//     }
//   }
// )
