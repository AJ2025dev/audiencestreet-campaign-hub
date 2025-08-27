# How to Add STAGING_API_BASE_URL Variable to GitHub Repository

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

### Step 4: Go to Variables Tab
1. You'll see two tabs: "Secrets" and "Variables"
2. Click on the "Variables" tab

### Step 5: Add New Repository Variable
1. Click the "New repository variable" button (usually green button on the right)
2. In the "Name" field, type: `STAGING_API_BASE_URL`
3. In the "Value" field, type: `https://uzcmjulbpmeythxfusrm.supabase.co`
4. Click the "Add variable" button

### Step 6: Verification
1. After adding the variable, you should see `STAGING_API_BASE_URL` in the list of variables
2. The value should be `https://uzcmjulbpmeythxfusrm.supabase.co`

## Required Variables Summary
Make sure you also have these variables configured:

1. **API_BASE_URL** = `https://uzcmjulbpmeythxfusrm.supabase.co`

And these secrets:

1. **VERCEL_STAGING_DEPLOY_HOOK** = Your Vercel staging deploy hook URL
2. **RENDER_STAGING_DEPLOY_HOOK** = Your Render staging deploy hook URL

## Re-run the Workflow
1. Go to the "Actions" tab in your repository
2. Find the "Staging Deploy" workflow
3. Click on it
4. Click "Run workflow" or push a change to the staging branch to trigger it

## Expected Outcome
After adding the `STAGING_API_BASE_URL` variable, the workflow should no longer fail with the "STAGING_API_BASE_URL is not set" error and should complete successfully.

## Troubleshooting
If you still encounter issues:

1. **Double-check the variable name** - It must be exactly `STAGING_API_BASE_URL` (case-sensitive)
2. **Verify the variable value** - Make sure it's `https://uzcmjulbpmeythxfusrm.supabase.co`
3. **Check that you added it as a Variable, not a Secret**
4. **Ensure you're in the correct repository**
5. **Make sure you're on the Variables tab, not the Secrets tab**

## Next Steps After Adding the Variable
1. Wait a few moments for GitHub to propagate the changes
2. Re-run the failing workflow
3. Monitor the workflow execution to ensure it completes successfully
4. If successful, proceed with your manual deployment process