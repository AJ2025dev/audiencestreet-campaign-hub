# Vercel Deployment Troubleshooting Guide

## Issue: No Recent Build Logs in Vercel

If you're not seeing recent build logs in Vercel, it likely means the deployment hasn't been triggered or there's an issue with the deployment process.

## Possible Causes and Solutions

### 1. Deployment Not Triggered
The most common reason for missing build logs is that the deployment hasn't been triggered yet.

**Solution:**
- **Trigger via GitHub Actions**:
  1. Go to your GitHub repository
  2. Navigate to "Actions" tab
  3. Find the "Auto Deploy & QA" workflow
  4. Click "Run workflow"
  5. Select the branch you want to deploy (typically `main`)
  6. Click "Run workflow"

- **Push Changes to Main Branch**:
  If you have recent changes that haven't been pushed:
  1. Commit your changes
  2. Push to the `main` branch
  3. This will automatically trigger the deployment workflow

### 2. Vercel Deploy Hook Not Configured
The GitHub workflow uses a Vercel deploy hook to trigger deployments. If this isn't configured, the deployment won't happen.

**Solution:**
1. **Get Vercel Deploy Hook**:
   - Go to your Vercel project dashboard
   - Navigate to "Settings" → "Git" → "Deploy Hooks"
   - Create a new deploy hook or copy the existing one

2. **Add to GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to "Settings" → "Secrets and variables" → "Actions"
   - Add a new repository secret named `VERCEL_DEPLOY_HOOK`
   - Paste the deploy hook URL as the value

### 3. Recent Changes Not Committed
If you've made changes locally but haven't committed them, they won't be deployed.

**Solution:**
1. Check git status:
   ```bash
   git status
   ```
2. Commit any uncommitted changes:
   ```bash
   git add .
   git commit -m "Deploy recent changes"
   git push origin main
   ```

### 4. Branch Configuration Issue
The workflow is configured to trigger on pushes to the `main` branch. If you're working on a different branch, it won't trigger automatically.

**Solution:**
1. Either merge your changes to `main` branch
2. Or temporarily modify the workflow to include your branch:
   ```yaml
   on:
     push:
       branches: [ main, your-branch-name ]
     workflow_dispatch:
   ```

## How to Verify Deployment Status

### 1. Check GitHub Actions
1. Go to GitHub repository → "Actions" tab
2. Look for recent runs of "Auto Deploy & QA" workflow
3. Check if the workflow completed successfully
4. Look for "Vercel deploy hook triggered" message in logs

### 2. Check Vercel Dashboard
1. Go to https://vercel.com/aj2025devs-projects/audiencestreet-campaign-hub
2. Navigate to "Deployments" tab
3. Look for recent deployments
4. Check deployment status (Success, Failed, Building)

### 3. Check Vercel Deploy Hooks
1. In Vercel project settings, go to "Git" → "Deploy Hooks"
2. Verify that the deploy hook exists and is correctly configured
3. Test the deploy hook manually by clicking "Trigger"

## Manual Deployment Options

If the automated deployment isn't working:

### Option 1: Manual Deploy via Vercel Dashboard
1. Go to your Vercel project
2. Click "Redeploy" on the latest deployment
3. Or click "Create Deployment" to deploy from a specific branch/commit

### Option 2: Vercel CLI Deployment
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy from your project directory:
   ```bash
   vercel --prod
   ```

## Environment Variables Check

Ensure all required environment variables are set in Vercel:

1. Go to Vercel project → "Settings" → "Environment Variables"
2. Verify these variables exist:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_EQUATIV_API_KEY` (if using Equativ features)

## Common Error Messages and Solutions

### "Vercel deploy hook not configured"
- Add the `VERCEL_DEPLOY_HOOK` secret to GitHub repository

### "Build failed" in Vercel
- Check build logs for specific error messages
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### "Deploy hook returned non-200 status"
- Check if the Vercel deploy hook URL is correct
- Verify the hook hasn't been revoked in Vercel

## Next Steps

1. Try triggering the GitHub Actions workflow manually
2. Verify Vercel deploy hook is properly configured
3. Check for any recent commits that should have triggered deployment
4. If issues persist, try manual deployment via Vercel dashboard

If you continue to have issues, please share:
1. Recent GitHub Actions workflow logs
2. Vercel deployment status
3. Any error messages you're seeing