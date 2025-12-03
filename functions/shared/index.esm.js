// ES6 version of the shared module for Vite/frontend use
// Pure ES6 - no CommonJS

// Import constants
import { dateStrFormat, numberFormats, exportFileTypes, resultsPageSize } from './constants/main.esm.js'
import { permissions, permissionGroups, permissionGroupNames } from './constants/permission.esm.js'
import { tabs, applicationRoutes, appCollections } from './constants/applications.esm.js'

// Import validators
import { validateEmail, validatePhone, validateZip } from './inputValidators.esm.js'

// Import schema
import { user, userRoles } from './schema/user.esm.js'
import { application } from './schema/application.esm.js'
import { form } from './schema/form.esm.js'
import { review } from './schema/review.esm.js'

// Import utilities
import toDate from './toDate.esm.js'
import format from './format.esm.js'
import csvify from './csvify.esm.js'
import getById from './getById.esm.js'
import switchy from './switchy.esm.js'

// Stub exports for modules we don't need in frontend
const passwordInput = null
const setObjVal = null
const omitUndefined = null
const storagePath = null
const getFileExt = null
const isEqualIgnoreFalsy = null
const mapDocsArray = null
const generateId = null
const phoneUtil = null

// Export everything
export {
  // Constants
  dateStrFormat,
  numberFormats,
  exportFileTypes,
  resultsPageSize,
  permissions,
  permissionGroups,
  permissionGroupNames,
  tabs,
  applicationRoutes,
  appCollections,
  
  // Validators
  validateEmail,
  validatePhone,
  validateZip,
  
  // Schema
  user,
  userRoles,
  application,
  form,
  review,
  
  // Utilities
  passwordInput,
  toDate,
  format,
  csvify,
  switchy,
  getById,
  setObjVal,
  omitUndefined,
  storagePath,
  getFileExt,
  isEqualIgnoreFalsy,
  mapDocsArray,
  generateId,
  phoneUtil,
}

