// Application schema for eReviewHub

const applicationStatus = {
  pending: 'Pending',
  inReview: 'In Review',
  needsInfo: 'Needs Information',
  approved: 'Approved',
  rejected: 'Rejected',
  draft: 'Draft',
}

const applicationType = {
  buildingPermit: 'Building Permit',
  developmentPermit: 'Development Permit',
  businessLicense: 'Business License',
  signagePermit: 'Signage Permit',
  vendorPermit: 'Vendor Permit',
}

const application = {
  collectionName: 'applications',
  fields: {
    id: {
      type: 'string',
      label: 'Application ID',
    },
    type: {
      type: 'string',
      label: 'Application Type',
      enum: Object.values(applicationType),
    },
    applicantName: {
      type: 'string',
      label: 'Applicant Name',
    },
    applicantId: {
      type: 'string',
      label: 'Applicant User ID',
    },
    submissionDate: {
      type: 'string',
      format: 'date-time',
      label: 'Submission Date',
    },
    status: {
      type: 'string',
      label: 'Status',
      enum: Object.values(applicationStatus),
    },
    version: {
      type: 'number',
      label: 'Version',
    },
    city: {
      type: 'string',
      label: 'City',
    },
    assignedReviewers: {
      type: 'array',
      items: { type: 'string' },
      label: 'Assigned Reviewers',
    },
    formId: {
      type: 'string',
      label: 'Form ID',
    },
    formData: {
      type: 'object',
      label: 'Form Data',
    },
    documents: {
      type: 'array',
      items: { type: 'object' },
      label: 'Documents',
    },
    dateCreated: {
      type: 'string',
      format: 'date-time',
    },
    createdBy: {
      type: 'string',
    },
    dateModified: {
      type: 'string',
      format: 'date-time',
    },
    lastModifiedBy: {
      type: 'string',
    },
  },
}

module.exports = { application, applicationStatus, applicationType }

