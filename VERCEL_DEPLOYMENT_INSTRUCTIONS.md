# Vercel Deployment Instructions

## Overview
This document provides instructions on how to deploy the updated campaign hub application to Vercel. The deployment process is automated through GitHub Actions workflows.

## Prerequisites
1. Access to the GitHub repository
2. Vercel account with appropriate permissions
3. Vercel deploy hook URL configured as a repository secret

## Deployment Process

### Option 1: Trigger via GitHub Actions (Recommended)
The easiest way to deploy to Vercel is to trigger the existing GitHub Actions workflow:

1. Navigate to the GitHub repository
2. Go to the "Actions" tab
3. Find the "Auto Deploy & QA" workflow
4. Click "Run workflow"
5. Select the branch you want to deploy (typically `main`)
6. Click "Run workflow"

This will:
- Trigger the Vercel frontend deploy hook
- Deploy the backend to Render
- Run automated QA tests
- Perform smoke tests on the APIs

### Option 2: Manual Vercel Deployment
If you prefer to deploy directly to Vercel:

1. Commit and push all changes to the `main` branch
2. The GitHub Actions workflow will automatically trigger on push to `main`
3. This will trigger both Render backend deploy and Vercel frontend deploy

### Option 3: Direct Vercel Integration
If you have Vercel integrated with your GitHub repository:

1. Push changes to the `main` branch
2. Vercel will automatically detect changes and start deployment
3. Monitor deployment progress in the Vercel dashboard

## Environment Variables
Ensure the following environment variables are configured in your Vercel project:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_EQUATIV_API_KEY` - Equativ API key (if applicable)
- Any other required environment variables

## Verification
After deployment, verify that all features are working correctly:

1. Visit the deployed URL
2. Test login functionality
3. Verify admin access at `/admin`
4. Test agency commission management at `/agency-commissions`
5. Test Equativ inventory pull functionality
6. Test AI campaign strategy auto-creation

## Troubleshooting
If deployment fails:

1. Check GitHub Actions logs for error messages
2. Verify all environment variables are correctly configured
3. Ensure the Vercel deploy hook URL is correct
4. Check for any build errors in the Vercel dashboard

## Rollback
If issues are discovered after deployment:

1. Revert to the previous commit in the repository
2. Trigger a new deployment
3. Monitor for successful deployment