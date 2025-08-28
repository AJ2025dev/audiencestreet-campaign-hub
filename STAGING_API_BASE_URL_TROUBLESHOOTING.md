# STAGING_API_BASE_URL Troubleshooting Guide

## Issue: STAGING_API_BASE_URL Not Set

You're seeing this error:
```
if [ -z "$STAGING_API_BASE_URL" ]; then
STAGING_API_BASE_URL is not set. Please add it as a repository variable.
Error: Process completed with exit code 1.
```

This indicates that a workflow is trying to use a `STAGING_API_BASE_URL` environment variable that hasn't been configured.

## Possible Causes

1. **Missing Repository Variable**: The `STAGING_API_BASE_URL` variable hasn't been added to your GitHub repository
2. **Incorrect Workflow**: You might be running a workflow that's meant for a staging environment
3. **Environment Configuration**: The workflow expects staging environment variables but you're running it in a different context

## Solutions

### 1. Add STAGING_API_BASE_URL to Repository Variables

If you have a staging environment, you need to configure the variable:

1. Go to your GitHub repository
2. Navigate to "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository variable"
4. Add:
   - **Name**: `STAGING_API_BASE_URL`
   - **Value**: Your staging Supabase URL (e.g., `https://your-staging-project.supabase.co`)

### 2. Check Which Workflow is Failing

Identify which workflow is causing the error:

1. Go to your GitHub repository → "Actions" tab
2. Look for the failed workflow run
3. Check which job is failing with this error
4. Review that workflow's configuration

### 3. If You Don't Have a Staging Environment

If you don't have a separate staging environment and want to use the same settings as production:

1. **Option A: Use API_BASE_URL instead**
   - Modify the workflow to use `API_BASE_URL` instead of `STAGING_API_BASE_URL`
   - This variable is already used in the auto-deploy workflow

2. **Option B: Set STAGING_API_BASE_URL to Production URL**
   - Add the repository variable with your production Supabase URL:
     - **Name**: `STAGING_API_BASE_URL`
     - **Value**: Your production Supabase URL

### 4. Skip Staging Checks (If Appropriate)

If you don't need staging validation, you can modify the workflow to skip this check:

1. Find the workflow file causing the error
2. Look for the section that checks `STAGING_API_BASE_URL`
3. Either:
   - Comment out the check
   - Modify it to use `API_BASE_URL` instead
   - Add a condition to skip if running in production context

## How to Identify the Problematic Workflow

1. Go to GitHub → "Actions" tab
2. Find the failed workflow run
3. Click on it to see details
4. Look at which job failed
5. Check the workflow file for that job

## Common Workflow Locations to Check

1. **Auto Deploy & QA** (`auto-deploy-and-qa.yml`)
2. **Agent Pipeline** (`agent-pipeline.yml`)
3. **Test workflows** in the `.github/workflows/` directory

## Example Fix for a Workflow

If you find a workflow with this problematic code:
```bash
if [ -z "$STAGING_API_BASE_URL" ]; then
  echo "STAGING_API_BASE_URL is not set. Please add it as a repository variable."
  exit 1
fi
```

You can either:

1. **Add the variable** (recommended if you have staging):
   ```bash
   # In GitHub repository settings
   STAGING_API_BASE_URL = https://your-staging-project.supabase.co
   ```

2. **Modify to use existing variable**:
   ```bash
   # Replace the check with:
   if [ -z "$STAGING_API_BASE_URL" ]; then
     STAGING_API_BASE_URL="$API_BASE_URL"
   fi
   ```

3. **Skip the check entirely** (if not needed):
   ```bash
   # Comment out or remove the check
   # if [ -z "$STAGING_API_BASE_URL" ]; then
   #   echo "STAGING_API_BASE_URL is not set. Please add it as a repository variable."
   #   exit 1
   # fi
   ```

## Next Steps

1. Identify which workflow is causing the error
2. Determine if you need a staging environment
3. Either add the `STAGING_API_BASE_URL` variable or modify the workflow
4. Re-run the workflow to see if the error is resolved

If you continue to have issues, please share:
1. Which workflow is failing
2. Whether you have a staging environment
3. Your Supabase project URLs (production and staging if applicable)