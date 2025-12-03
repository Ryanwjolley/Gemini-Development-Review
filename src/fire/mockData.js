/**
 * Mock Data Service for Netlify Deployment
 * In-memory data store with full CRUD operations
 * Data resets on page refresh
 */

import _ from 'lodash'

// Import user roles from shared schema
const userRoles = {
  public: 'Public',
  cityUser: 'City User',
  reviewer: 'Reviewer',
  admin: 'Admin',
}

const applicationStatus = {
  pending: 'Pending',
  inReview: 'In Review',
  approved: 'Approved',
  rejected: 'Rejected',
  needsInfo: 'Needs Information',
}

const applicationType = {
  buildingPermit: 'Building Permit',
  developmentPermit: 'Development Permit',
  businessLicense: 'Business License',
  signagePermit: 'Signage Permit',
}

// In-memory data stores
let dataStore = {
  users: [],
  applications: [],
  forms: [],
  reviews: [],
}

// Initialize with seed data
const initializeMockData = () => {
  dataStore.users = [
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

  dataStore.applications = [
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

  dataStore.forms = [
    {
      id: 'form-001',
      name: 'Building Permit Application',
      version: 2,
      city: 'Springfield',
      isActive: true,
      dateModified: new Date('2023-12-03'),
      fields: [],
    },
    {
      id: 'form-002',
      name: 'Business License Application',
      version: 1,
      city: 'Springfield',
      isActive: true,
      dateModified: new Date('2023-12-03'),
      fields: [],
    },
    {
      id: 'form-003',
      name: 'Signage Permit Application',
      version: 1,
      city: 'Shelbyville',
      isActive: true,
      dateModified: new Date('2023-12-03'),
      fields: [],
    },
    {
      id: 'form-004',
      name: 'Development Permit Application',
      version: 3,
      city: 'Shelbyville',
      isActive: true,
      dateModified: new Date('2023-12-03'),
      fields: [],
    },
  ]

  dataStore.reviews = [
    {
      id: 'review-001',
      applicationId: 'APP-001',
      reviewerId: 'user-reviewer-1',
      reviewerName: 'Alice Reviewer',
      reviewerRole: 'Reviewer',
      comment: 'Initial review complete. All requirements met.',
      dateCreated: new Date('2023-10-27'),
      attachments: [],
    },
    {
      id: 'review-002',
      applicationId: 'APP-002',
      reviewerId: 'user-reviewer-1',
      reviewerName: 'Alice Reviewer',
      reviewerRole: 'Reviewer',
      comment: 'Pending additional environmental assessment.',
      dateCreated: new Date('2023-10-26'),
      attachments: [],
    },
  ]
}

// Initialize on module load
initializeMockData()

// Helper to simulate async behavior
const asyncWait = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms))

// Mock ID generator
const generateId = (prefix = 'ID') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// ==================== APPLICATIONS ====================

export const mockGetApplications = async (filters = {}) => {
  await asyncWait()
  let results = [...dataStore.applications]

  if (filters.city) {
    results = results.filter(app => app.city === filters.city)
  }
  if (filters.applicantId) {
    results = results.filter(app => app.applicantId === filters.applicantId)
  }
  if (filters.assignedReviewerId) {
    results = results.filter(app => 
      app.assignedReviewers?.includes(filters.assignedReviewerId)
    )
  }

  return _.orderBy(results, ['submissionDate'], ['desc'])
}

export const mockGetApplicationById = async (id) => {
  await asyncWait()
  return dataStore.applications.find(app => app.id === id) || null
}

export const mockCreateApplication = async (applicationData) => {
  await asyncWait()
  const newApp = {
    ...applicationData,
    dateCreated: new Date(),
    dateModified: new Date(),
  }
  dataStore.applications.push(newApp)
  return newApp.id
}

export const mockUpdateApplication = async (id, updates) => {
  await asyncWait()
  const index = dataStore.applications.findIndex(app => app.id === id)
  if (index !== -1) {
    dataStore.applications[index] = {
      ...dataStore.applications[index],
      ...updates,
      dateModified: new Date(),
    }
  }
}

export const mockAssignReviewers = async (id, reviewerIds) => {
  await asyncWait()
  const app = dataStore.applications.find(app => app.id === id)
  if (app) {
    app.assignedReviewers = [...new Set([...(app.assignedReviewers || []), ...reviewerIds])]
  }
}

// ==================== FORMS ====================

export const mockGetForms = async (filters = {}) => {
  await asyncWait()
  let results = [...dataStore.forms]

  if (filters.city) {
    results = results.filter(form => form.city === filters.city)
  }

  return _.orderBy(results, ['dateModified'], ['desc'])
}

export const mockGetFormById = async (id) => {
  await asyncWait()
  return dataStore.forms.find(form => form.id === id) || null
}

export const mockCreateForm = async (formData) => {
  await asyncWait()
  const newForm = {
    id: generateId('form'),
    ...formData,
    dateCreated: new Date(),
    dateModified: new Date(),
  }
  dataStore.forms.push(newForm)
  return newForm.id
}

export const mockUpdateForm = async (id, updates) => {
  await asyncWait()
  const index = dataStore.forms.findIndex(form => form.id === id)
  if (index !== -1) {
    dataStore.forms[index] = {
      ...dataStore.forms[index],
      ...updates,
      dateModified: new Date(),
    }
  }
}

export const mockDeleteForm = async (id) => {
  await asyncWait()
  dataStore.forms = dataStore.forms.filter(form => form.id !== id)
}

// ==================== USERS ====================

export const mockGetUsers = async (filters = {}) => {
  await asyncWait()
  let results = [...dataStore.users]

  if (filters.city) {
    results = results.filter(user => user.city === filters.city)
  }
  if (filters.enabled !== undefined) {
    results = results.filter(user => user.enabled === filters.enabled)
  }

  return results
}

export const mockGetUsersByRole = async (role) => {
  await asyncWait()
  return dataStore.users.filter(user => user.role === role)
}

export const mockGetUserById = async (id) => {
  await asyncWait()
  return dataStore.users.find(user => user.id === id) || null
}

// ==================== REVIEWS ====================

export const mockGetReviewsByApplicationId = async (applicationId) => {
  await asyncWait()
  return dataStore.reviews.filter(review => review.applicationId === applicationId)
}

export const mockAddReview = async (reviewData) => {
  await asyncWait()
  const newReview = {
    id: generateId('review'),
    ...reviewData,
    dateCreated: new Date(),
  }
  dataStore.reviews.push(newReview)
  return newReview.id
}

// ==================== UTILITY ====================

export const resetMockData = () => {
  initializeMockData()
}

export const getMockDataStore = () => dataStore

