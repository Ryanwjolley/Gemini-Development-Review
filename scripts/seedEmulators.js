/**
 * Seed Firebase Emulators with Initial Test Data
 *
 * This script seeds the Firebase emulators with hard-coded test data.
 * Run this once to create initial seed data, then use --import/--export-on-exit
 * to persist the data across emulator sessions.
 *
 * Usage:
 *   1. Start emulators: npm run start:functions:emulators
 *   2. Run this script: npm run seed:emulators:init
 *   3. Stop emulators (data will be exported to /emulator-data)
 *   4. Next time, emulators will auto-load this data
 *
 * To add more collections:
 *   - Add seed data arrays below (e.g., SEED_PROJECTS, SEED_CLIENTS)
 *   - Add corresponding seed functions (e.g., seedProjects, seedClients)
 *   - Call them in the main() function
 */

const { permissionGroupNames } = require('@shared/shared')

// Initialize Firebase Admin SDK for emulators
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8410'
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9410'

// Require firebase-admin from functions node_modules using require.resolve
const adminPath = require.resolve('firebase-admin/app', {
  paths: [require('path').join(__dirname, '../functions')],
})
const authPath = require.resolve('firebase-admin/auth', {
  paths: [require('path').join(__dirname, '../functions')],
})
const firestorePath = require.resolve('firebase-admin/firestore', {
  paths: [require('path').join(__dirname, '../functions')],
})

const { initializeApp } = require(adminPath)
const { getAuth } = require(authPath)
const { getFirestore } = require(firestorePath)

const app = initializeApp({ projectId: 'repo-template-demo' })
const auth = getAuth(app)
const db = getFirestore(app)

// ============================================================================
// SEED DATA - Customize as needed
// ============================================================================

const SEED_USERS = [
  {
    id: 'user1',
    name: 'Admin User',
    email: 'admin@test.com',
    enabled: true,
    permissions: [0], // admin permission
  },
  {
    id: 'user2',
    name: 'John Smith',
    email: 'john@test.com',
    enabled: true,
    permissions: [],
  },
  {
    id: 'user3',
    name: 'Jane Doe',
    email: 'jane@test.com',
    enabled: true,
    permissions: [],
  },
  {
    id: 'user4',
    name: 'Bob Johnson',
    email: 'bob@test.com',
    enabled: true,
    permissions: [],
  },
  {
    id: 'user5',
    name: 'Alice Williams',
    email: 'alice@test.com',
    enabled: true,
    permissions: [permissionGroupNames.admin], // admin permission
  },
]

const DEFAULT_PASSWORD = 'password123'

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

/**
 * Seed Firebase Auth with test users
 */
async function seedAuth() {
  console.log('\n🔐 Seeding Firebase Auth...')

  for (const user of SEED_USERS) {
    try {
      await auth.createUser({
        uid: user.id,
        email: user.email,
        password: DEFAULT_PASSWORD,
        displayName: user.name,
        disabled: !user.enabled,
      })
      console.log(`  ✓ Created auth user: ${user.email}`)
    } catch (error) {
      if (error.code === 'auth/uid-already-exists') {
        console.log(`  - Auth user already exists: ${user.email}`)
      } else {
        console.error(
          `  ✗ Error creating auth user ${user.email}:`,
          error.message
        )
      }
    }
  }
}

/**
 * Seed Firestore with test user documents
 */
async function seedFirestore() {
  console.log('\n📝 Seeding Firestore users collection...')

  const now = new Date().toISOString()

  for (const user of SEED_USERS) {
    try {
      const userDoc = {
        id: user.id,
        name: user.name,
        email: user.email,
        enabled: user.enabled,
        permissions: user.permissions,
        dateCreated: now,
        createdBy: 'system',
        dateModified: now,
        lastModifiedBy: 'system',
      }

      await db.collection('users').doc(user.id).set(userDoc)
      console.log(`  ✓ Created firestore user: ${user.email}`)
    } catch (error) {
      console.error(
        `  ✗ Error creating firestore user ${user.email}:`,
        error.message
      )
    }
  }
}

// ============================================================================
// ADD MORE SEED FUNCTIONS HERE
// ============================================================================

// Example template for adding more collections:
//
// async function seedProjects() {
//   console.log('\n📁 Seeding Firestore projects collection...')
//   // ... your seeding logic
// }
//
// async function seedClients() {
//   console.log('\n👥 Seeding Firestore clients collection...')
//   // ... your seeding logic
// }

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  try {
    console.log('🌱 Starting emulator seed process...')
    console.log(`   Default password for all users: ${DEFAULT_PASSWORD}`)

    // let users = await db
    //   .collection('users')
    //   .get()
    //   .then(s => s.docs.map(d => d.data()))
    // console.log(users)
    await seedAuth()
    await seedFirestore()

    // Add more seed functions here as you create them:
    // await seedProjects()
    // await seedClients()

    console.log('\n✅ Emulator seeding completed successfully!')
    console.log('\n📌 Next steps:')
    console.log('   1. Stop the emulators (data will export to /emulator-data)')
    console.log('   2. Restart emulators - they will auto-load this seed data')
    console.log('   3. Login with any user using password: ' + DEFAULT_PASSWORD)
  } catch (error) {
    console.error('\n❌ Error seeding emulators:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
