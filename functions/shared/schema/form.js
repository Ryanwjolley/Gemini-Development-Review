// Form schema for eReviewHub

const fieldTypes = {
  text: 'text',
  textarea: 'textarea',
  dropdown: 'dropdown',
  checkboxes: 'checkboxes',
  date: 'date',
  email: 'email',
  phone: 'phone',
  file: 'file',
}

const form = {
  collectionName: 'forms',
  fields: {
    id: {
      type: 'string',
      label: 'Form ID',
    },
    name: {
      type: 'string',
      label: 'Form Name',
    },
    version: {
      type: 'number',
      label: 'Version',
    },
    city: {
      type: 'string',
      label: 'City',
    },
    fields: {
      type: 'array',
      items: { type: 'object' },
      label: 'Form Fields',
    },
    isActive: {
      type: 'boolean',
      label: 'Is Active',
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

module.exports = { form, fieldTypes }

