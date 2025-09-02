# 🚨 Edge Function "Non-2xx Status Code" Error - Troubleshooting Guide

## Current Issue
You're seeing: **"Edge Function returned a non-2xx status code"**

This means the Edge Functions exist but are returning an error (400, 401, 403, 500, etc.) instead of success (200).

## 🔍 Most Likely Causes & Solutions

### 1. **Edge Functions Not Deployed** (Most Common)
**Symptoms**: Functions return 404 or "not found" errors
**Solution**: Deploy the Edge Functions

```bash
# Option A: Use our deployment script
./deploy-edge-functions.sh

# Option B: Manual deployment
npm install -g supabase
supabase login
supabase link --project-ref uzcmjulbpmeythxfusrm
supabase functions deploy admin-create-user
supabase functions deploy agency-create-advertiser
```

### 2. **Missing Service Role Key** (Very Common)
**Symptoms**: 401 Unauthorized or "Admin access required" errors
**Solution**: Set environment variables in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm/settings/functions
2. Click "Environment Variables"
3. Add these variables:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   SITE_URL=https://aj2025dev.github.io/audiencestreet-campaign-hub
   ```
4. Get your service role key from: https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm/settings/api

### 3. **Incorrect Role/Permissions**
**Symptoms**: "Admin access required" or "Agency access required" errors  
**Solution**: Ensure you're logged in with the correct role:
- For creating users: Login as **admin**
- For creating advertisers: Login as **agency**

### 4. **Missing Required Fields**
**Symptoms**: "Missing required fields" or validation errors
**Solution**: Ensure you fill out:
- **Email** (required)
- **Company Name** (required)  
- **Role** (for admin user creation)

## 🧪 Diagnostic Steps

### Step 1: Check Function Deployment
Open this diagnostic tool in your browser:
`/debug-edge-functions.html`

This will test:
- ✅ Are functions deployed and accessible?
- ✅ Can we make authenticated calls?
- 🔍 What specific errors are returned?

### Step 2: Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try creating a user
4. Look for detailed error messages

### Step 3: Manual Function Test
Test functions directly:

```bash
# Test admin-create-user (replace YOUR_JWT_TOKEN)
curl -X POST \
  https://uzcmjulbpmeythxfusrm.supabase.co/functions/v1/admin-create-user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "role": "advertiser", 
    "company_name": "Test Company"
  }'
```

## 🚀 Quick Fix Implementation

I've updated the frontend to provide better error messages. After deployment, you'll see specific errors like:

- ✅ **"Edge Function not deployed"** → Deploy functions
- ✅ **"Service role key not configured"** → Set environment variables  
- ✅ **"Admin access required"** → Login as admin
- ✅ **"Missing required fields"** → Fill out form completely

## 📋 Step-by-Step Resolution

### For You Right Now:

1. **Deploy Functions** (5 minutes):
   ```bash
   cd /path/to/your/project
   ./deploy-edge-functions.sh
   ```

2. **Set Environment Variables** (2 minutes):
   - Go to Supabase Dashboard → Functions → Environment Variables
   - Add `SUPABASE_SERVICE_ROLE_KEY` (from API settings)
   - Add `SITE_URL` (your GitHub Pages URL)

3. **Test User Creation** (1 minute):
   - Login as admin → try creating user
   - Should work with success message

### Current Fallback Behavior:
- ✅ If Edge Functions fail → automatically falls back to demo mode
- ✅ Clear error messages explain what went wrong
- ✅ App remains functional regardless of backend state

## 🎯 Expected Results After Setup

### ✅ Success Messages:
- "User 'Company Name' created successfully"
- "Password reset email sent"
- Real user appears in list immediately

### ❌ Error Messages (Fixed):
- Clear, specific error descriptions
- Instructions on how to resolve each issue
- Graceful fallback to demo mode

## 🔗 Helpful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm
- **Functions Settings**: https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm/settings/functions  
- **API Keys**: https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm/settings/api
- **Full Setup Guide**: EDGE_FUNCTIONS_SETUP.md

## ⚡ Emergency Demo Mode

If you need the app to work immediately:
- The app automatically falls back to demo mode when Edge Functions fail
- Demo mode provides full UI functionality without database changes
- Safe for testing and demonstrations

The improved error handling will guide you through the exact steps needed to enable production mode!