const { db } = require('../functions/src/fire')
// const fs = require('fs')
const { mapDocsArray } = require('@shared/shared')
const Promise = require('../functions/node_modules/bluebird')

const remap = async () => {
  try {
    const usersRef = db.collection('users')
    const users = await usersRef.get().then(mapDocsArray)
    // fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
    console.log('users to update count: ', users.length)

    await Promise.map(
      users,
      async user => {
        const { id: userId } = user
        // const userRef = usersRef.doc(userId)
        const updates = {}

        console.log(
          'updating user',
          JSON.stringify({ userId, ...updates }, null, 2)
        )
        // await userRef.set(updates, { merge: true })
      },
      { concurrency: 35 }
    )
    console.log('done')
  } catch (err) {
    console.error('error', err)
  }

  process.exit()
}

remap()
