/**
 * @fileoverview User schema definition for users
 * Defines field mappings, types, and other custom properties
 *
 * Field definitions mix standard JSON Schema properties (type, enum, format, etc.)
 * with custom integration properties (bigQuery, vantagepoint, bamboohr).
 *
 * @module schema/user
 * @requires lodash
 * @requires ../format
 * @requires ../toDate
 */

/**
 * @typedef {Object} FieldConfig
 * @property {string} [label] - Human-readable label for the field
 */

/**
 * @typedef {Object} UserSchema
 * @property {string} collectionName - Firestore collection name
 * @property {Object.<string, FieldConfig>} fields - Field configuration mappings
 */

/**
 * User schema configuration defining all fields, types, and integration mappings
 * for the user management.
 *
 * @type {UserSchema}
 */
const userRoles = {
  public: 'Public',
  cityUser: 'City User',
  reviewer: 'Reviewer',
  admin: 'Admin',
}

const user = {
  collectionName: 'users',
  fields: {
    id: {
      type: 'string',
      label: 'User ID',
    },
    name: {
      type: 'string',
      label: 'Full Name',
    },
    enabled: {
      type: 'boolean',
      label: 'Enabled',
    },
    email: {
      type: 'string',
      format: 'email',
      label: 'Email Address',
    },
    avatar: {
      type: 'string',
      label: 'Avatar URL',
    },
    role: {
      type: 'string',
      label: 'User Role',
      enum: Object.values(userRoles),
    },
    city: {
      type: 'string',
      label: 'City',
    },
    permissions: {
      type: 'array',
      items: { type: 'string' },
      label: 'Permissions',
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

module.exports = { user, userRoles }
