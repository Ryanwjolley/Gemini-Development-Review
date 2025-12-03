#!/usr/bin/env node

/**
 * Seed script for eReviewHub emulators
 * Run with: node scripts/seedEReviewHub.js
 */

const admin = require('firebase-admin')
const { applicationStatus, applicationType, userRoles } = require('../functions/shared/schema')

// Initialize Firebase Admin with emulator settings
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8410'
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9410'

admin.initializeApp({ projectId: 'repo-template-demo' })
const db = admin.firestore()

const mockUsers = [
  {
    id: 'user-public',
    name: 'John Q. Public',
    email: 'john.public@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    role: userRoles.public,
    enabled: true,
    permissions: [],
  },
  {
    id: 'user-city-springfield',
    name: 'Jane Springfield',
    email: 'jane.springfield@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    role: userRoles.cityUser,
    city: 'Springfield',
    enabled: true,
    permissions: [],
  },
  {
    id: 'user-city-shelbyville',
    name: 'Tom Shelbyville',
    email: 'tom.shelbyville@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
    role: userRoles.cityUser,
    city: 'Shelbyville',
    enabled: true,
    permissions: [],
  },
  {
    id: 'user-reviewer-1',
    name: 'Alice Reviewer',
    email: 'alice.reviewer@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    role: userRoles.reviewer,
    enabled: true,
    permissions: [],
  },
  {
    id: 'user-reviewer-2',
    name: 'Bob Reviewer',
    email: 'bob.reviewer@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    role: userRoles.reviewer,
    enabled: true,
    permissions: [],
  },
]

const mockApplications = [
  {
    id: 'APP-001',
    type: applicationType.buildingPermit,
    applicantName: 'Alice Johnson',
    applicantId: 'user-public',
    submissionDate: new Date('2023-10-26'),
    status: applicationStatus.approved,
    version: 2,
    city: 'Springfield',
    assignedReviewers: ['user-reviewer-1'],
    formId: 'form-001',
    formData: {},
    documents: [],
  },
  {
    id: 'APP-002',
    type: applicationType.developmentPermit,
    applicantName: 'Bob Williams',
    applicantId: 'user-public',
    submissionDate: new Date('2023-10-25'),
    status: applicationStatus.inReview,
    version: 1,
    city: 'Shelbyville',
    assignedReviewers: ['user-reviewer-1', 'user-reviewer-2'],
    formId: 'form-004',
    formData: {},
    documents: [],
  },
  {
    id: 'APP-003',
    type: applicationType.businessLicense,
    applicantName: 'Charlie Brown',
    applicantId: 'user-public',
    submissionDate: new Date('2023-10-24'),
    status: applicationStatus.pending,
    version: 1,
    city: 'Springfield',
    assignedReviewers: [],
    formId: 'form-002',
    formData: {},
    documents: [],
  },
  {
    id: 'APP-004',
    type: applicationType.buildingPermit,
    applicantName: 'Diana Prince',
    applicantId: 'user-public',
    submissionDate: new Date('2023-10-22'),
    status: applicationStatus.needsInfo,
    version: 3,
    city: 'Springfield',
    assignedReviewers: ['user-reviewer-2'],
    formId: 'form-001',
    formData: {},
    documents: [],
  },
  {
    id: 'APP-005',
    type: applicationType.signagePermit,
    applicantName: 'Eve Adams',
    applicantId: 'user-public',
    submissionDate: new Date('2023-10-20'),
    status: applicationStatus.rejected,
    version: 1,
    city: 'Shelbyville',
    assignedReviewers: [],
    formId: 'form-003',
    formData: {},
    documents: [],
  },
]

const mockForms = [
  {
    id: 'form-001',
    name: 'Building Permit Application',
    version: 2,
    city: 'Springfield',
    isActive: true,
    fields: [
      { id: '1', type: 'text', label: 'Applicant Full Name', placeholder: 'e.g., Jane Doe', helpText: 'Please enter your full legal name.', required: true },
      { id: '2', type: 'text', label: 'Project Address', placeholder: 'e.g., 123 Main St', required: true },
      { id: '3', type: 'dropdown', label: 'Permit Type', options: ['New Construction', 'Remodel', 'Demolition'], required: true },
      { id: '4', type: 'checkboxes', label: 'Terms and Conditions', options: ['I agree to the terms and conditions'], required: true },
    ],
  },
  {
    id: 'form-002',
    name: 'Business License Application',
    version: 1,
    city: 'Springfield',
    isActive: true,
    fields: [
      { id: '1', type: 'text', label: 'Business Name', required: true },
      { id: '2', type: 'text', label: 'Business DBA', required: false },
      { id: '3', type: 'email', label: 'Contact Email', required: true },
    ],
  },
  {
    id: 'form-003',
    name: 'Signage Permit Application',
    version: 1,
    city: 'Shelbyville',
    isActive: true,
    fields: [
      { id: '1', type: 'text', label: 'Signage Text', required: true },
      { id: '2', type: 'file', label: 'Signage Mockup', required: true },
    ],
  },
  {
    id: 'form-004',
    name: 'Development Permit Application',
    version: 3,
    city: 'Shelbyville',
    isActive: true,
    fields: [
      { id: '1', type: 'textarea', label: 'Description of Development', required: true },
      { id: '2', type: 'date', label: 'Projected Start Date', required: true },
      { id: '3', type: 'file', label: 'Environmental Study', required: false },
    ],
  },
]

const mockReviews = [
  {
    id: 'review-001',
    applicationId: 'APP-001',
    reviewerId: 'user-reviewer-1',
    reviewerName: 'Alice Reviewer',
    reviewerRole: 'Reviewer',
    comment: 'Initial review complete. Site plan requires minor adjustments regarding setback distances. Please revise and resubmit.',
    attachments: [],
  },
  {
    id: 'review-002',
    applicationId: 'APP-002',
    reviewerId: 'user-reviewer-1',
    reviewerName: 'Alice Reviewer',
    reviewerRole: 'Reviewer',
    comment: 'Structural calculations are sound. Awaiting revised site plan before final approval.',
    attachments: [],
  },
]

async function seedData() {
  console.log('🌱 Seeding eReviewHub data...')

  try {
    // Seed users
    console.log('Creating users...')
    for (const user of mockUsers) {
      await db.collection('users').doc(user.id).set({
        ...user,
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        dateModified: admin.firestore.FieldValue.serverTimestamp(),
      })
    }
    console.log(`✅ Created ${mockUsers.length} users`)

    // Seed applications
    console.log('Creating applications...')
    for (const app of mockApplications) {
      await db.collection('applications').doc(app.id).set({
        ...app,
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        dateModified: admin.firestore.FieldValue.serverTimestamp(),
      })
    }
    console.log(`✅ Created ${mockApplications.length} applications`)

    // Seed forms
    console.log('Creating forms...')
    for (const form of mockForms) {
      await db.collection('forms').doc(form.id).set({
        ...form,
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        dateModified: admin.firestore.FieldValue.serverTimestamp(),
      })
    }
    console.log(`✅ Created ${mockForms.length} forms`)

    // Seed reviews
    console.log('Creating reviews...')
    for (const review of mockReviews) {
      await db.collection('reviews').doc(review.id).set({
        ...review,
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        dateModified: admin.firestore.FieldValue.serverTimestamp(),
      })
    }
    console.log(`✅ Created ${mockReviews.length} reviews`)

    console.log('✨ Seeding complete!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedData()

