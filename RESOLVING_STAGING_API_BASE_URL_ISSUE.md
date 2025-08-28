# Resolving the STAGING_API_BASE_URL Issue

## Issue Analysis
Based on the error message, there's a GitHub Actions workflow that's trying to use a `STAGING_API_BASE_URL` environment variable, but it's not set. The error shows:

```
env:
  STAGING_API_BASE_URL: 
STAGING_API_BASE_URL is not set. Please add it as a repository variable.
```

This indicates that:
1. The workflow is referencing `STAGING_API_BASE_URL` in its environment
2. The variable is empty (not set)
3. There's a script checking if the variable is set and failing because it's not

## Root Cause
The workflow appears to be using a modified version of the health check script from `auto-deploy-and-qa.yml`, but it's been changed to use `STAGING_API_BASE_URL` instead of `API_BASE_URL`.

## Solution
Add the `STAGING_API_BASE_URL` variable to your GitHub repository:

1. Go to your GitHub repository: https://github.com/AJ2025dev/audiencestreet-campaign-hub
2. Navigate to "Settings" → "Secrets and variables" → "Actions"
3. Click on the "Variables" tab
4. Click "New repository variable"
5. Add:
   - **Name**: `STAGING_API_BASE_URL`
   - **Value**: `https://uzcmjulbpmeythxfusrm.supabase.co` (your Supabase project URL)
6. Click "Add variable"

## Alternative Solution
If you want to modify the workflow to use the existing `API_BASE_URL` variable instead:

1. Find the workflow that's causing the error
2. Look for the section that references `STAGING_API_BASE_URL`
3. Change it to use `API_BASE_URL` instead

However, the easiest solution is to just add the missing variable as described above.

## Required Variables Summary
Make sure you have these variables configured in your GitHub repository:

1. **Repository Variables** (Settings → Secrets and variables → Actions → Variables tab):
   - `API_BASE_URL` = `https://uzcmjulbpmeythxfusrm.supabase.co`
   - `STAGING_API_BASE_URL` = `https://uzcmjulbpmeythxfusrm.supabase.co` (same as above)

2. **Repository Secrets** (Settings → Secrets and variables → Actions → Secrets tab):
   - `VERCEL_DEPLOY_HOOK` = Your Vercel deploy hook URL
   - `RENDER_DEPLOY_HOOK` = Your Render deploy hook URL (if using Render)

## Verification Steps
1. After adding the variable, re-run the failed workflow
2. Check that the workflow completes successfully
3. Verify that there are no other missing variables

## Next Steps
1. Add the `STAGING_API_BASE_URL` repository variable as described above
2. Re-run the workflow from the GitHub Actions page
3. Monitor for successful completion
4. Proceed with Vercel deployment once the workflow completes successfully

This should resolve the STAGING_API_BASE_URL error and allow your workflows to proceed.