# How to Add Staging Deploy Hook Secrets to GitHub Repository

## Overview
The staging deploy workflow requires two deploy hook secrets:
1. `VERCEL_STAGING_DEPLOY_HOOK` - For deploying the frontend to Vercel staging environment
2. `RENDER_STAGING_DEPLOY_HOOK` - For deploying the backend to Render staging environment

## Step-by-Step Instructions

### Step 1: Access Your GitHub Repository
1. Open your web browser
2. Go to https://github.com/AJ2025dev/audiencestreet-campaign-hub
3. Make sure you're logged into your GitHub account

### Step 2: Navigate to Repository Settings
1. In your repository page, click on the "Settings" tab
   - This is usually located in the upper middle part of the page, next to tabs like "Code", "Issues", "Pull requests", etc.

### Step 3: Access Secrets and Variables
1. In the left sidebar, scroll down until you see "Secrets and variables"
2. Click on "Actions" under "Secrets and variables"

### Step 4: Go to Secrets Tab
1. You'll see two tabs: "Secrets" and "Variables"
2. Make sure you're on the "Secrets" tab (this is the default tab)

### Step 5: Add VERCEL_STAGING_DEPLOY_HOOK Secret
1. Click the "New repository secret" button (usually green button on the right)
2. In the "Name" field, type: `VERCEL_STAGING_DEPLOY_HOOK`
3. In the "Value" field, you'll need to get this from your Vercel project:
   - Go to your Vercel project dashboard
   - Navigate to "Settings" → "Git" → "Deploy Hooks"
   - Create a new deploy hook for your staging environment or copy an existing one
   - Paste the full URL in the "Value" field
4. Click the "Add secret" button

### Step 6: Add RENDER_STAGING_DEPLOY_HOOK Secret
1. Click the "New repository secret" button again
2. In the "Name" field, type: `RENDER_STAGING_DEPLOY_HOOK`
3. In the "Value" field, you'll need to get this from your Render project:
   - Go to your Render project dashboard
   - Navigate to the service you want to deploy
   - Go to "Settings" → "Deploy Hooks"
   - Create a new deploy hook or copy an existing one
   - Paste the full URL in the "Value" field
4. Click the "Add secret" button

### Step 7: Verification
1. After adding both secrets, you should see them in the list of secrets
2. The names should be exactly:
   - `VERCEL_STAGING_DEPLOY_HOOK`
   - `RENDER_STAGING_DEPLOY_HOOK`

## If You Don't Use Render for Backend
If you don't use Render for your backend deployment:

1. You can still add the `RENDER_STAGING_DEPLOY_HOOK` secret with a dummy value
2. Or modify the workflow to remove the Render deployment step
3. Or set the `RENDER_STAGING_DEPLOY_HOOK` to an empty string

## If You Don't Use Vercel for Frontend
If you don't use Vercel for your frontend deployment:

1. You can still add the `VERCEL_STAGING_DEPLOY_HOOK` secret with a dummy value
2. Or modify the workflow to remove the Vercel deployment step
3. Or set the `VERCEL_STAGING_DEPLOY_HOOK` to an empty string

## Alternative: Use the Same Deploy Hooks as Production
If you don't have separate staging environments:

1. You can use the same deploy hooks as your production environment
2. Add:
   - `VERCEL_STAGING_DEPLOY_HOOK` = Your production Vercel deploy hook URL
   - `RENDER_STAGING_DEPLOY_HOOK` = Your production Render deploy hook URL

## Re-run the Workflow
1. Go to the "Actions" tab in your repository
2. Find the "Staging Deploy" workflow
3. Click on it
4. Click "Run workflow" or push a change to the staging branch to trigger it

## Expected Outcome
After adding the deploy hook secrets, the workflow should be able to trigger deployments to your staging environments and complete successfully.

## Troubleshooting
If you still encounter issues:

1. **Double-check the secret names** - They must be exactly `VERCEL_STAGING_DEPLOY_HOOK` and `RENDER_STAGING_DEPLOY_HOOK` (case-sensitive)
2. **Verify the secret values** - Make sure they are valid deploy hook URLs
3. **Check that you added them as Secrets, not Variables**
4. **Ensure you're in the correct repository**
5. **Make sure you're on the Secrets tab, not the Variables tab**

## Next Steps After Adding the Secrets
1. Wait a few moments for GitHub to propagate the changes
2. Re-run the failing workflow
3. Monitor the workflow execution to ensure it completes successfully
4. If successful, proceed with your manual deployment process