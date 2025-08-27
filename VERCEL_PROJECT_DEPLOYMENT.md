# Vercel Project Deployment Guide

## Project Information
- **Project Name**: audiencestreet-campaign-hub
- **Project URL**: https://vercel.com/aj2025devs-projects/audiencestreet-campaign-hub
- **Framework**: React + Vite + TypeScript

## Deployment Process

### 1. Connect Repository to Vercel
If not already connected:
1. Visit https://vercel.com/aj2025devs-projects/audiencestreet-campaign-hub
2. Click "Settings" → "Git Repository"
3. Connect your GitHub repository containing the campaign hub code

### 2. Configure Build Settings
Vercel should automatically detect the correct settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If manual configuration is needed:
1. Go to project settings → "General" → "Build & Development Settings"
2. Set "Framework Preset" to "Vite"
3. Verify build settings match above

### 3. Environment Variables
Add the following environment variables in Vercel project settings:

1. Go to project → Settings → Environment Variables
2. Add these required variables:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anonymous key
   - `VITE_EQUATIV_API_KEY` = Your Equativ API key (if using Equativ features)

### 4. Deploy Latest Changes
To deploy the latest changes:

1. **Option A: Manual Deploy**
   - Visit the Vercel project dashboard
   - Click "Deployments" tab
   - Click "Redeploy" on the latest deployment or "Create Deployment"

2. **Option B: Git Push**
   - Push changes to your connected GitHub repository
   - Vercel will automatically detect and deploy changes

3. **Option C: GitHub Actions**
   - Follow the instructions in VERCEL_DEPLOYMENT_INSTRUCTIONS.md
   - Trigger the "Auto Deploy & QA" workflow

### 5. Post-Deployment Verification
After deployment completes:

1. Visit the deployed URL
2. Test all implemented features:
   - Login functionality
   - Admin access at `/admin`
   - Agency commissions at `/agency-commissions`
   - Equativ inventory pull functionality
   - AI campaign strategy auto-creation
3. Verify real data is displayed (not mock data)
4. Test responsive design on different devices

### 6. Monitoring
- Check Vercel dashboard for build logs and deployment status
- Monitor performance metrics in Vercel Analytics
- Set up alerts for deployment failures if needed

## Troubleshooting Common Issues

### Build Failures
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are correctly specified in package.json
3. Verify Node.js version compatibility

### Runtime Errors
1. Check browser console for JavaScript errors
2. Verify environment variables are correctly set
3. Confirm Supabase connection settings

### Performance Issues
1. Check Vercel Analytics for performance metrics
2. Optimize bundle size if needed
3. Consider adding caching strategies

## Next Steps
1. Deploy the latest code using one of the methods above
2. Verify all features work correctly with real data
3. Share the deployment URL with stakeholders for review
4. Monitor for any issues during initial usage