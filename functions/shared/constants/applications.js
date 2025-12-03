// Application constants for eReviewHub

const appCollections = {
  applications: 'applications',
  forms: 'forms',
  reviews: 'reviews',
}

const tabs = {
  details: 'details',
  documents: 'documents',
  reviews: 'reviews',
}

const applicationRoutes = {
  dashboard: '/dashboard',
  applications: '/dashboard/applications',
  applicationDetail: (id) => `/dashboard/applications/${id}`,
  newApplication: '/dashboard/applications/new',
  forms: '/dashboard/forms',
  formDetail: (id) => `/dashboard/forms/${id}`,
  formBuilder: (id) => `/dashboard/form-builder/${id}`,
  newForm: '/dashboard/form-builder/new',
  settings: '/dashboard/settings',
}

module.exports = {
  appCollections,
  tabs,
  applicationRoutes,
}

