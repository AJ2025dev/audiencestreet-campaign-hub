# Fix for Staging Deploy Workflow

## Issue
The "Staging Deploy" workflow is failing because it's trying to use a `STAGING_API_BASE_URL` environment variable that hasn't been configured in your GitHub repository.

## Root Cause
The workflow references `${{ vars.STAGING_API_BASE_URL }}` in two places:
1. In the `wait_for_backend` job environment
2. In the `staging_tests` job environment

But this variable doesn't exist in your repository variables.

## Solution Options

### Option 1: Add the Missing Variable (Recommended)
Add the `STAGING_API_BASE_URL` variable to your GitHub repository:

1. Go to your GitHub repository: https://github.com/AJ2025dev/audiencestreet-campaign-hub
2. Navigate to "Settings" → "Secrets and variables" → "Actions"
3. Click on the "Variables" tab
4. Click "New repository variable"
5. Add:
   - **Name**: `STAGING_API_BASE_URL`
   - **Value**: `https://uzcmjulbpmeythxfusrm.supabase.co` (your Supabase project URL)
6. Click "Add variable"

### Option 2: Modify the Workflow to Use API_BASE_URL
If you don't have a separate staging environment and want to use the same Supabase instance:

1. Edit the workflow file (`.github/workflows/staging-deploy.yml` or similar)
2. Replace all instances of `STAGING_API_BASE_URL` with `API_BASE_URL`
3. Change:
   ```yaml
   env:
     STAGING_API_BASE_URL: ${{ vars.STAGING_API_BASE_URL }}
   ```
   to:
   ```yaml
   env:
     STAGING_API_BASE_URL: ${{ vars.API_BASE_URL }}
   ```

## Required Variables Summary
Make sure you have these variables configured in your GitHub repository:

1. **Repository Variables** (Settings → Secrets and variables → Actions → Variables tab):
   - `API_BASE_URL` = `https://uzcmjulbpmeythxfusrm.supabase.co`
   - `STAGING_API_BASE_URL` = `https://uzcmjulbpmeythxfusrm.supabase.co` (if using Option 1)

2. **Repository Secrets** (Settings → Secrets and variables → Actions → Secrets tab):
   - `VERCEL_STAGING_DEPLOY_HOOK` = Your Vercel staging deploy hook URL
   - `RENDER_STAGING_DEPLOY_HOOK` = Your Render staging deploy hook URL

## Verification Steps
1. After making the changes, commit and push the workflow file
2. Trigger the workflow manually or by pushing to the staging branch
3. Check that the workflow completes successfully
4. Verify that there are no other missing variables

## Next Steps
1. Choose either Option 1 or Option 2 above
2. Implement the chosen solution
3. Re-run the workflow
4. Monitor for successful completion

This should resolve the STAGING_API_BASE_URL error and allow your staging deployment to proceed.