# eReviewHub - Getting Started

## Overview

eReviewHub is a municipal application review platform that allows cities to manage permit applications with custom forms, role-based access, and a complete review workflow.

## Quick Start

### 1. Install Dependencies

```bash
npm install && (cd functions && npm install)
```

### 2. Setup Environment

Create a `.env.development` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=repo-template-demo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=repo-template-demo
VITE_FIREBASE_STORAGE_BUCKET=repo-template-demo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Use Firebase Emulators
VITE_USE_EMULATORS=true

# Use Mock Auth (bypasses Firebase Auth for testing)
VITE_USE_MOCK_AUTH=true
```

### 3. Start Firebase Emulators

```bash
npm run start:functions:emulators
```

### 4. Seed Test Data (in another terminal)

```bash
node scripts/seedEReviewHub.js
```

### 5. Start the UI (in another terminal)

```bash
npm run start:emulators
```

### 6. Access the Application

- **UI**: http://localhost:3010
- **Firebase Emulator UI**: http://localhost:4000

## Test Users

When `VITE_USE_MOCK_AUTH=true`, you can log in as any of these test users (no password required):

1. **John Q. Public** (john.public@email.com)
   - Role: Public User
   - Can submit and view own applications

2. **Jane Springfield** (jane.springfield@email.com)
   - Role: City User
   - City: Springfield
   - Can manage Springfield applications and create forms

3. **Tom Shelbyville** (tom.shelbyville@email.com)
   - Role: City User
   - City: Shelbyville
   - Can manage Shelbyville applications and create forms

4. **Alice Reviewer** (alice.reviewer@email.com)
   - Role: Reviewer
   - Can review assigned applications

5. **Bob Reviewer** (bob.reviewer@email.com)
   - Role: Reviewer
   - Can review assigned applications

## Key Features

### Dashboard
- View application statistics (Pending, In Review, Approved, Rejected)
- See recent application activity
- Role-specific views

### Applications
- **Public Users**: Submit new applications, view own submissions
- **City Users**: View all applications for their city, assign reviewers
- **Reviewers**: View assigned applications

### Application Details
- **Details Tab**: View application information
- **Documents Tab**: Manage supporting documents
- **Reviews Tab**: Add review notes and feedback
- **Actions**: Approve, Reject, Request Information

### Forms Management
- **City Users**: Create custom application forms
- **All Users**: View available forms
- Support for various field types: text, textarea, dropdown, checkboxes, date, email, phone, file upload

### Settings
- View profile information
- Switch between test users (when mock auth is enabled)
- Manage preferences

## Architecture

### Frontend
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Lodash for utilities
- Lucide React for icons

### Backend
- Firebase Firestore (via emulators)
- Firebase Functions (Express API)
- Shared schema and constants between frontend/backend

### Data Collections
- `users`: User accounts with roles
- `applications`: Application submissions
- `forms`: Custom form definitions
- `reviews`: Review notes and feedback

## Development Workflow

### Mock Authentication
With `VITE_USE_MOCK_AUTH=true`, authentication is bypassed for easy testing:
- Select a user from the login dropdown
- Switch users anytime from Settings page
- No password required

### Adding New Features
1. Update schemas in `functions/shared/schema/`
2. Add Firebase functions in `src/fire/`
3. Create React components in `src/components/`
4. Add routes in `src/routes.js`
5. Update global state in `src/globalState.js` if needed

### Seeding Data
The seed script (`scripts/seedEReviewHub.js`) creates:
- 5 test users (various roles)
- 5 sample applications
- 4 sample forms
- 2 sample reviews

Run it anytime to reset test data:
```bash
node scripts/seedEReviewHub.js
```

## Next Steps

### Form Builder (TODO)
The Form Builder component for drag-and-drop form creation is planned but not yet implemented. This will allow City Users to:
- Add/remove form fields
- Configure field properties
- Reorder fields
- Preview forms
- Publish forms

### Production Deployment
1. Set `VITE_USE_MOCK_AUTH=false`
2. Set `VITE_USE_EMULATORS=false`
3. Configure real Firebase project credentials
4. Deploy functions: `firebase deploy --only functions`
5. Build and deploy hosting: `npm run build && firebase deploy --only hosting`

## Troubleshooting

### Emulators won't start
- Make sure ports 8410, 9410, 5010, and 4000 are available
- Check `firebase.json` for emulator configuration

### Login not working
- Verify `VITE_USE_MOCK_AUTH=true` in `.env.development`
- Check browser console for errors
- Ensure emulators are running

### Data not loading
- Run the seed script to populate test data
- Check Firebase Emulator UI (http://localhost:4000) to verify data exists
- Check browser console for Firebase errors

## Support

For questions or issues, refer to:
- `CLAUDE.md` for project architecture and guidelines
- `README.md` for template setup instructions
- Firebase documentation for emulator usage

