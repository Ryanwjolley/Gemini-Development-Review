# Project overview

**eReviewHub** - Municipal Application Review Platform

eReviewHub is a comprehensive web application designed for cities to manage and review various types of permit applications (building permits, business licenses, development permits, etc.). The system supports three main user roles:

- **Public Users**: Submit applications and track their status
- **City Users**: Manage applications for their city, create custom forms, and assign reviewers
- **Reviewers**: Review assigned applications and provide feedback

## Key Features

- **Multi-role Authentication**: Role-based access control with different permissions for Public, City Users, and Reviewers
- **Custom Form Builder**: City users can create custom application forms with various field types (text, dropdown, checkboxes, date pickers, file uploads, etc.)
- **Application Management**: Submit, review, and track applications through their lifecycle
- **Review Workflow**: Assign reviewers, add review notes, and manage application status
- **Document Management**: Upload and manage supporting documents for applications
- **Dashboard Analytics**: View statistics and recent activity at a glance
- **Status Tracking**: Real-time status updates (Pending, In Review, Needs Information, Approved, Rejected)

## Style Guidelines

- **Primary color**: Deep teal (#008080) for a professional and trustworthy feel
- **Background color**: Light gray (#F0F0F0) to ensure readability and a clean interface
- **Accent color**: Warm gold (#D4AF37) for call-to-action buttons and important notifications
- **Body and headline font**: 'Inter' for a modern and neutral user experience

# Tech/Architecture

- ReactJS
- NodeJS
- Firebase
  - Firestore: source of truth database
  - Functions for backend (express app) see api function in `functions/index.js`
- Tailwind is used for styles/css
- Axios for http requests
- Lodash - utility functions

For more complex architecture (only as necessary)

- BigQuery - data duplicated from firestore here for analysis
- Elasticsearch - data duplicated from firestore here for search as you type and more complex queries.
- Puppeteer for PDF generation/exports - see this github comment on how to set it up - https://github.com/puppeteer/puppeteer/issues/9128#issuecomment-1643911630

# Configuration

## Environment Variables

Environment variables for Firebase Functions are stored in `.env` files in the `/functions/` directory:

- **`.env.default`**: Production/live environment configuration (`JDE_ENV=live`)
- **`.env.dev`**: Development environment configuration (`JDE_ENV=dev`)

These files contain API keys, database URLs, and configuration for external services

**Important notes:**

- All `.env*` files are gitignored and should never be committed
- Functions access these values via `process.env.VARIABLE_NAME`
- For local development with emulators, use `npm run serve:emulators`

### Frontend Environment Variables (Vite)

For the React frontend, create a `.env.development` file in the root directory:

```
VITE_USE_EMULATORS=true
VITE_USE_MOCK_AUTH=true
VITE_FIREBASE_PROJECT_ID=repo-template-demo
```

- `VITE_USE_EMULATORS`: Set to `true` to use Firebase emulators
- `VITE_USE_MOCK_AUTH`: Set to `true` to bypass authentication for testing (allows switching between test users)

# Development guidelines

- avoid `typeof` when possible.
- be sure to remove unused variables
- variables and database collections should be camel-case
- any data fetching on front-end from firebase, there should be functions created for that in `src/fire/` and then imported where it's used
- prefer lodash functions when possible for code brevity, like `_.sort()`, and _.keys, _.forEach, etc.
- When passing props with the same variable name to a component, use spread like <Component { ...{ somePropName, anotherPropName }}/> instead of <Component somePropName={somePropName} anotherPropName={anotherPropName}/>
- Destructure variables when using them as much as possible, rather than `data.thing`
- Constants and util functions are shared from between front-end and backend in `functions/shared/`. @shared/shared package is accessed using `npm link`.
- Inlining is preferred to creating functions that are used in only place. For example, in a react component, instead of `const thing = <div>thing</div>`, just do `<div>thing</div>` inline in the JSX.
- For component local state management, `useSetState()` in /src/utils/index.js is preferred for state that may get saved in the database since it has the helpers like `arrayUpdate()` and so on and the entire object may be saved. react's `useState` is fine for things that may not be saved to the database, like a loading state or toggling stuff, but there may be cases where toggling multiple things in an array and so on could benefit from `useArrayToggleState`.
- when doing validation for an editor/form-like component, have a `valid` variable and check for truthyness (by default, or be smart with logic if it's apparent should check for > 100 or non-empty array for example). Use `border-red-500` class for inputs when value isn't valid, and disable the save button if !valid. Use the `hasError` prop instead of border-red-500 class for SelectSimple and Datepicker components, or others that have that prop.
- for multi-case things, use `switchy()` in `functions/shared`, like `switchy(case, { a: () => 1, b: () => 2 })` instead of lots of if/else or ternaries
- global state in the app is managed in `src/globalState.js`
- Destructure variables when using them as much as possible, rather than `data.thing`
- Put re-used strings in a constants object when it pertains to things like menus, tabs, id prefixes, and so on. For example, `tabs = { profile: 'profile', settings: 'settings' }` and then use like `disabled={activeTab === tabs.profile}`
- Use shorthand syntax for object properties, so `{ name }`, not `{ name: name }`

## eReviewHub Specific

### Data Collections

- **applications**: Application submissions with status tracking
- **forms**: Custom form definitions created by city users
- **reviews**: Review notes and feedback on applications
- **users**: User accounts with role-based access

### User Roles

- **Public**: Can submit applications and view their own submissions
- **City User**: Can manage applications for their city, create forms, assign reviewers
- **Reviewer**: Can review assigned applications and provide feedback
- **Admin**: Full system access

### Key Components

- `Dashboard.js`: Overview with statistics and recent applications
- `Applications.js`: List view of applications with filtering
- `ApplicationDetail.js`: Detailed view with tabs (Details, Documents, Reviews)
- `Forms.js`: Form management and listing
- `Settings.js`: User profile and preferences (includes mock auth switcher for testing)

## Style/UI/UX

- Save and Cancel buttons should be disabled when saving, and save button should have spinner just to the right of the text of the button
- Cancel/Delete/Close (destructive-like buttons) should be on left, while edit/save/etc should be on the right
- Cancel and non-destructive dismiss buttons should use default button variant. Confirm/Save and other action buttons should use primary button variant. Delete/Destructive buttons should use danger button variant.
