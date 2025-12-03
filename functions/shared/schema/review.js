// Review schema for eReviewHub

const review = {
  collectionName: 'reviews',
  fields: {
    id: {
      type: 'string',
      label: 'Review ID',
    },
    applicationId: {
      type: 'string',
      label: 'Application ID',
    },
    reviewerId: {
      type: 'string',
      label: 'Reviewer User ID',
    },
    reviewerName: {
      type: 'string',
      label: 'Reviewer Name',
    },
    reviewerRole: {
      type: 'string',
      label: 'Reviewer Role',
    },
    comment: {
      type: 'string',
      label: 'Review Comment',
    },
    attachments: {
      type: 'array',
      items: { type: 'object' },
      label: 'Attachments',
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

module.exports = { review }

