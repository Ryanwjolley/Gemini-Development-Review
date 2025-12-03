// ES6 wrapper for the CommonJS shared module
// This file is used by Vite to properly import named exports

// Import from individual CommonJS modules using * as syntax
import * as constantsModule from './constants/index.js'
import * as inputValidatorsModule from './inputValidators.js'
import * as schemaModule from './schema/index.js'
import * as passwordInputModule from './passwordInput.js'
import * as toDateModule from './toDate.js'
import * as formatModule from './format.js'
import * as csvifyModule from './csvify.js'
import * as getByIdModule from './getById.js'
import * as switchyModule from './switchy.js'
import * as setObjValModule from './setObjVal.js'
import * as omitUndefinedModule from './omitUndefined.js'
import * as storagePathModule from './storagePath.js'
import * as getFileExtModule from './getFileExt.js'
import * as isEqualIgnoreFalsyModule from './isEqualIgnoreFalsy.js'
import * as mapDocsArrayModule from './mapDocsArray.js'
import * as generateIdModule from './generateId.js'
import * as phoneUtilModule from './phoneUtil.js'

// Helper to get the actual export from a CommonJS module
const getExport = (mod) => mod.default || mod

// Export constants
export const dateStrFormat = constantsModule.dateStrFormat
export const numberFormats = constantsModule.numberFormats
export const exportFileTypes = constantsModule.exportFileTypes
export const resultsPageSize = constantsModule.resultsPageSize
export const permissions = constantsModule.permissions
export const permissionGroups = constantsModule.permissionGroups
export const permissionGroupNames = constantsModule.permissionGroupNames
export const tabs = constantsModule.tabs
export const applicationRoutes = constantsModule.applicationRoutes
export const appCollections = constantsModule.appCollections

// Export validators
export const validateEmail = inputValidatorsModule.validateEmail
export const validatePhone = inputValidatorsModule.validatePhone
export const validateZip = inputValidatorsModule.validateZip

// Export schema
export const user = schemaModule.user
export const userRoles = schemaModule.userRoles
export const application = schemaModule.application
export const form = schemaModule.form
export const review = schemaModule.review

// Export utilities (these are exported directly)
export const passwordInput = getExport(passwordInputModule)
export const toDate = getExport(toDateModule)
export const csvify = getExport(csvifyModule)
export const getById = getExport(getByIdModule)
export const switchy = getExport(switchyModule)
export const setObjVal = getExport(setObjValModule)
export const omitUndefined = getExport(omitUndefinedModule)
export const storagePath = getExport(storagePathModule)
export const getFileExt = getExport(getFileExtModule)
export const isEqualIgnoreFalsy = getExport(isEqualIgnoreFalsyModule)
export const mapDocsArray = getExport(mapDocsArrayModule)
export const generateId = getExport(generateIdModule)
export const phoneUtil = getExport(phoneUtilModule)

// Export format as an object with its methods
export const format = getExport(formatModule)

