# STAGING_API_BASE_URL Resolution Guide

## Issue
You're seeing this error:
```
Run if [ -z "$STAGING_API_BASE_URL" ]; then
STAGING_API_BASE_URL is not set. Please add it as a repository variable.
Error: Process completed with exit code 1.
```

## Root Cause
A GitHub Actions workflow is trying to use a `STAGING_API_BASE_URL` environment variable that hasn't been configured. This variable is not defined in any of the workflow files in your repository, which means it's either:
1. Being referenced in a workflow that's not in your repository
2. Being used by a script or tool that's being called by a workflow
3. Being checked by a third-party action or tool

## Immediate Solution
Add the `STAGING_API_BASE_URL` variable to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository variable"
4. Add:
   - **Name**: `STAGING_API_BASE_URL`
   - **Value**: Your Supabase project URL (e.g., `https://your-project.supabase.co`)
   
   If you don't have a separate staging environment, just use your production Supabase URL.

## Alternative Solutions

### Option 1: Use Your Production URL
If you don't have a separate staging environment, you can set the variable to your production URL:
- **Name**: `STAGING_API_BASE_URL`
- **Value**: `https://uzcmjulbpmeythxfusrm.supabase.co` (or your Supabase project URL)

### Option 2: Modify the Workflow (If You Can Identify It)
If you can identify which workflow is causing the error:
1. Find the workflow file
2. Look for the section that checks `STAGING_API_BASE_URL`
3. Either:
   - Comment out the check
   - Modify it to use `API_BASE_URL` instead
   - Add a fallback:
     ```bash
     if [ -z "$STAGING_API_BASE_URL" ]; then
       STAGING_API_BASE_URL="$API_BASE_URL"
     fi
     ```

## How to Identify the Problematic Workflow

1. Go to your GitHub repository → "Actions" tab
2. Look for the failed workflow run
3. Check which job failed with this error
4. Look at the workflow file for that job

## Common Locations to Check

1. **Third-party actions**: Some GitHub Actions might require this variable
2. **Scripts in your repository**: Check if any scripts (bash, Python, etc.) are checking for this variable
3. **Testing workflows**: Some testing frameworks might require this variable

## Search for the Variable in Your Codebase

Run this command in your repository to find where the variable might be referenced:
```bash
grep -r "STAGING_API_BASE_URL" .
```

Or if you're using Windows:
```cmd
findstr /s /i "STAGING_API_BASE_URL" *
```

## If You Can't Find the Source

If you can't identify where this variable is being used:

1. **Add the variable anyway** - This is the quickest solution
2. **Check GitHub Actions marketplace** - Some third-party actions might require this variable
3. **Check recent workflow runs** - Look at the logs to see which step is failing

## Required Variables Summary

Make sure you have these variables configured in your GitHub repository:

1. **Repository Variables** (Settings → Secrets and variables → Actions → Variables tab):
   - `API_BASE_URL` = `https://uzcmjulbpmeythxfusrm.supabase.co`
   - `STAGING_API_BASE_URL` = `https://uzcmjulbpmeythxfusrm.supabase.co` (same as above if no separate staging)

2. **Repository Secrets** (Settings → Secrets and variables → Actions → Secrets tab):
   - `VERCEL_DEPLOY_HOOK` = Your Vercel deploy hook URL
   - `RENDER_DEPLOY_HOOK` = Your Render deploy hook URL (if using Render)

## Next Steps

1. Add the `STAGING_API_BASE_URL` repository variable as described above
2. Re-run the failing workflow
3. If it works, proceed with your Vercel deployment
4. If you continue to have issues, please share:
   - The exact workflow that's failing
   - The full error log
   - Whether you have separate staging/production environments

This should resolve the STAGING_API_BASE_URL error and allow your workflows to proceed.