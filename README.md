# Repo Template

## Using This Template

**Option 1: GitHub Template (Recommended)**

1. Click the **"Use this template"** button at the top of this repository
2. Enter your new repository name and details
3. Click "Create repository from template"
4. Clone your new repository and proceed to Quick Setup below

**Option 2: Manual Clone**

```bash
git clone --depth=1 git@github.com:jonesanddemille/repo-template.git my-project-name
cd my-project-name
rm -rf .git
git init
```

---

## Quick Setup

1. **Install dependencies**

   ```bash
   npm install && (cd functions && npm install)
   ```

2. **Run setup script** (interactive prompts for port configuration)

   ```bash
   npm run setup
   ```

3. **Start Firebase emulators**

   ```bash
   npm run start:functions:emulators
   ```

4. **Seed dummy data** (in another terminal)

   ```bash
   npm run seed:emulators:init
   ```

5. **Start the UI** (in another terminal)

   ```bash
   npm run start:emulators
   ```

6. **Access your app**
   - UI: http://localhost:3010
   - Firebase Emulator UI: http://localhost:4000

## Additional Configuration

- When ready to connect a real Firebase project, replace `repo-template-demo` with your Firebase project ID
- Search and update remaining `TEMPLATE_TODO` items in the codebase
- Update `Project Overview` section in `CLAUDE.md`

## Re-running Setup

You can re-run `npm run setup` at any time to update port configuration. The script will remember your previous choices and allow you to modify them.

## Firebase project naming

- Name project whatever you want, but for a separate firebase project for dev, it's preferred to name it the same but just add `-dev` to the end.

## TODOs

- eslint auto-fix/format on save
- eslint rules - check deps on both front and back
- Permissions - simplify those? just perm group names instead of a group with multiple permissions 🤷‍♂️
