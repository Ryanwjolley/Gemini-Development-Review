# Netlify Deployment Guide - eReviewHub

This guide explains how to deploy eReviewHub to Netlify using mock data (no Firebase required).

## Overview

The app is configured to run in **mock data mode** on Netlify:
- All data stored in-memory (resets on page refresh)
- Pre-loaded with seed data (5 users, 5 applications, 4 forms, 2 reviews)
- Full CRUD functionality works
- No backend/database required
- Perfect for demos and testing

## Prerequisites

- Node.js 22 or higher
- Netlify account (free tier works)
- Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub**
   ```bash
   git push origin netlify-mock-deployment
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `build`
   - **Node version**: 22

4. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at a Netlify URL (e.g., `https://your-app.netlify.app`)

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Environment Configuration

The app automatically uses mock data in production builds. The configuration is set in:

- **`vite.config.js`**: Defines `VITE_USE_MOCK_DATA=true` for production mode
- **`netlify.toml`**: Netlify build configuration
- **`package.json`**: Build script `build:netlify`

## Testing the Deployment

After deployment, test these features:

### 1. User Switching (Settings Page)
- Go to Settings
- Use the "Testing Mode" section to switch between users:
  - **John Q. Public** (Public) - Can submit applications
  - **Jane Springfield** (City User) - Can manage Springfield applications
  - **Tom Shelbyville** (City User) - Can manage Shelbyville applications
  - **Alice Reviewer** (Reviewer) - Can review assigned applications
  - **Bob Reviewer** (Reviewer) - Can review assigned applications

### 2. Test Public User Flow
- Switch to John Q. Public
- Go to Applications → Click "New Application"
- Submit a new application
- Verify it appears in the list

### 3. Test City User Flow
- Switch to Jane Springfield
- View applications filtered by Springfield
- Click on an application
- Assign a reviewer using the "Review Management" section
- Change application status (Approve/Reject/Request Info)

### 4. Test Reviewer Flow
- Switch to Alice Reviewer
- View applications assigned to you
- Open an application
- Add review notes in the Reviews tab

### 5. Test Form Builder
- Switch to Jane Springfield (City User)
- Go to Forms → Click "New Form"
- Create a form with fields
- Save and verify it appears in the list

## Important Notes

### Data Persistence
- **All data resets on page refresh** - This is by design for demo purposes
- Changes made during a session persist until refresh
- Each visitor gets a fresh copy of the seed data

### Limitations in Mock Mode
- No file uploads (document attachments disabled)
- No email notifications
- No real authentication (mock users only)
- No data persistence across sessions

### Reverting to Firebase Mode
To switch back to Firebase mode for local development:
```bash
git checkout pre-netlify-backup
```

Or to continue development with both modes:
```bash
# Local development with Firebase emulators
npm run start:emulators

# Build for Netlify (mock mode)
npm run build:netlify
```

## Troubleshooting

### Build Fails
- Check Node version is 22 or higher
- Verify all dependencies installed: `npm install`
- Check build logs in Netlify dashboard

### App Shows Blank Page
- Check browser console for errors
- Verify the build output directory is `build`
- Check Netlify deploy logs

### Features Not Working
- Refresh the page to reset mock data
- Check browser console for JavaScript errors
- Verify you're using the correct user role for the feature

## Custom Domain (Optional)

To add a custom domain:
1. Go to Netlify dashboard → Site settings → Domain management
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Wait for SSL certificate to provision (automatic)

## Support

For issues or questions:
- Check browser console for errors
- Review Netlify build logs
- Verify mock data is loading correctly

## Next Steps

After user feedback, you can:
1. Switch back to Firebase mode: `git checkout pre-netlify-backup`
2. Continue development on the feature branch
3. Merge changes when ready: `git merge netlify-mock-deployment`



