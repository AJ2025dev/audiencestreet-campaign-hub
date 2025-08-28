# Instructions to Add STAGING_API_BASE_URL Repository Variable

## Step-by-Step Guide

1. **Go to Your GitHub Repository**
   - Visit: https://github.com/AJ2025dev/audiencestreet-campaign-hub

2. **Navigate to Repository Settings**
   - Click on the "Settings" tab (usually near the top of the repository page)

3. **Access Secrets and Variables**
   - In the left sidebar, scroll down to find "Secrets and variables"
   - Click on "Actions" under "Secrets and variables"

4. **Add New Repository Variable**
   - You'll see two tabs: "Secrets" and "Variables"
   - Make sure you're on the "Variables" tab
   - Click the "New repository variable" button

5. **Configure the Variable**
   - **Name**: `STAGING_API_BASE_URL`
   - **Value**: `https://uzcmjulbpmeythxfusrm.supabase.co`
   
   Note: If you don't have a separate staging environment, use the same URL as your production Supabase project.

6. **Save the Variable**
   - Click the "Add variable" button

## Verification Steps

1. **Confirm Variable is Added**
   - After adding, you should see `STAGING_API_BASE_URL` in the list of variables

2. **Check Other Required Variables**
   - Make sure you also have:
     - `API_BASE_URL` = `https://uzcmjulbpmeythxfusrm.supabase.co`
   
3. **Check Required Secrets**
   - Make sure you also have these secrets configured in the "Secrets" tab:
     - `VERCEL_DEPLOY_HOOK` = Your Vercel deploy hook URL
     - `RENDER_DEPLOY_HOOK` = Your Render deploy hook URL (if using Render)

## Re-run the Workflow

1. **Go to Actions Tab**
   - Click on the "Actions" tab in your repository

2. **Find the Failed Workflow**
   - Look for the workflow that failed with the STAGING_API_BASE_URL error

3. **Re-run the Workflow**
   - Click on the workflow run
   - Click the "Re-run all jobs" button

## Expected Outcome

After adding the `STAGING_API_BASE_URL` variable and re-running the workflow, the error should be resolved and the workflow should complete successfully. This will then allow your Vercel deployment to proceed.

## Troubleshooting

If you still encounter issues after adding the variable:

1. **Double-check the variable name** - It must be exactly `STAGING_API_BASE_URL`
2. **Verify the variable value** - Make sure it's your correct Supabase project URL
3. **Check that you added it as a Variable, not a Secret**
4. **Ensure you're in the correct repository**