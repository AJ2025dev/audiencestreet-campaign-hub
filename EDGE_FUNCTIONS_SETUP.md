# Real Database User Creation Setup Guide

This guide explains how to set up and use the Supabase Edge Functions for real database user creation, replacing the demo mode with actual user creation that properly handles Supabase authentication and foreign key constraints.

## 🎯 What This Implements

### Before (Demo Mode)
- User creation only updated local state
- No actual database records created
- Foreign key constraint errors when attempting real database operations

### After (Real Database Creation)
1. **Admin User Creation**: Admins can create users with proper auth.users entries
2. **Agency Advertiser Creation**: Agencies can create advertisers linked to their account
3. **Proper Auth Flow**: auth.users → profiles → agency_advertisers relationships
4. **Password Management**: Automatic password reset emails for new users

## 🚀 Edge Functions Created

### 1. `admin-create-user`
- **Path**: `/supabase/functions/admin-create-user/`
- **Purpose**: Allows admins to create users with any role (admin/agency/advertiser)
- **Auth Required**: Admin role
- **Process**:
  1. Validates admin permissions
  2. Creates auth user via Supabase Admin API
  3. Creates profile with proper user_id reference
  4. Sends password reset email
  5. Returns success with user data

### 2. `agency-create-advertiser`
- **Path**: `/supabase/functions/agency-create-advertiser/`
- **Purpose**: Allows agencies to create advertisers under their management
- **Auth Required**: Agency role
- **Process**:
  1. Validates agency permissions
  2. Creates auth user for advertiser
  3. Creates advertiser profile
  4. Links advertiser to agency in `agency_advertisers` table
  5. Sends password reset email

## 📋 Prerequisites

### 1. Supabase CLI Installation
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

### 2. Environment Variables Setup
Set these in your Supabase project dashboard under Settings > API:

#### Required for Edge Functions:
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (enables admin operations)
- `SITE_URL` - Your production site URL for password reset redirects

#### Get these values:
1. Go to Supabase Dashboard → Your Project → Settings → API
2. Copy the `service_role` key (not the `anon` key)
3. Set `SUPABASE_SERVICE_ROLE_KEY` in Edge Function secrets

## 🛠️ Local Development Setup

### 1. Start Local Supabase
```bash
cd /path/to/your/project
supabase start
```

### 2. Deploy Functions Locally
```bash
# Deploy all functions to local instance
supabase functions deploy admin-create-user --local
supabase functions deploy agency-create-advertiser --local
```

### 3. Set Local Environment Variables
```bash
# Set service role key for local functions
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key --local
supabase secrets set SITE_URL=http://localhost:3000 --local
```

### 4. Update .env.local
```env
# Point to local Supabase instance
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
```

## 🌐 Production Deployment

### 1. Deploy Functions to Production
```bash
# Deploy to production Supabase
supabase functions deploy admin-create-user
supabase functions deploy agency-create-advertiser
```

### 2. Set Production Secrets
```bash
# Set production environment variables
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
supabase secrets set SITE_URL=https://aj2025dev.github.io/audiencestreet-campaign-hub
```

### 3. Update Edge Function URLs
The functions will be available at:
- `https://uzcmjulbpmeythxfusrm.supabase.co/functions/v1/admin-create-user`
- `https://uzcmjulbpmeythxfusrm.supabase.co/functions/v1/agency-create-advertiser`

## 🔧 Frontend Integration

### Current Implementation
The frontend components (`EnhancedAdmin.tsx` and `EnhancedAgencyDashboard.tsx`) now:

1. **Try Edge Functions First**: Attempt real user creation via Edge Functions
2. **Fallback to Demo Mode**: If Edge Functions fail, use local state (demo mode)
3. **Clear Error Handling**: Show appropriate success/error messages
4. **Graceful Degradation**: App works even if Edge Functions aren't deployed

### Example Usage in Admin Dashboard:
```typescript
// Calls supabase.functions.invoke('admin-create-user', { ... })
const { data, error } = await supabase.functions.invoke('admin-create-user', {
  body: {
    email: userForm.email,
    role: userForm.role,
    company_name: userForm.company_name,
    // ... other fields
  }
})
```

## 🧪 Testing Real User Creation

### 1. Test Admin User Creation
1. Login as admin user
2. Go to `/admin` dashboard
3. Click "Add User" button
4. Fill out form with:
   - Email: `newuser@example.com`
   - Role: `agency` or `advertiser`
   - Company Name: `Test Company`
5. Submit form

**Expected Result**: 
- ✅ Success message appears
- ✅ User appears in users list
- ✅ User receives password reset email
- ✅ Real database records created

### 2. Test Agency Advertiser Creation
1. Login as agency user
2. Go to `/agency` dashboard
3. Click "Add Advertiser" button
4. Fill out advertiser details
5. Submit form

**Expected Result**:
- ✅ Success message appears
- ✅ Advertiser appears in agency's list
- ✅ Agency-advertiser relationship created
- ✅ Advertiser receives password reset email

## 🚨 Troubleshooting

### Edge Function Not Found
**Error**: `Function not found`
**Solution**: Deploy the Edge Functions:
```bash
supabase functions deploy admin-create-user
supabase functions deploy agency-create-advertiser
```

### Service Role Key Error
**Error**: `Unauthorized` or `Admin access required`
**Solution**: Set the service role key:
```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Email Not Sending
**Error**: Password reset emails not received
**Solution**: 
1. Check SMTP configuration in Supabase dashboard
2. Verify `SITE_URL` environment variable is set correctly

### Foreign Key Constraint Error
**Error**: Still getting foreign key violations
**Solution**: 
1. Ensure Edge Functions are deployed and working
2. Check that `SUPABASE_SERVICE_ROLE_KEY` is correctly set
3. Verify the functions are being called (check Supabase logs)

## 📊 Current Status

### ✅ Implemented
- Edge Functions for admin and agency user creation
- Frontend integration with graceful fallback
- Proper auth.users → profiles → relationships flow
- Password reset email integration
- Error handling and validation

### 🔄 Fallback Behavior
- If Edge Functions are unavailable, app falls back to demo mode
- Clear messaging indicates when demo mode is active
- All UI functionality preserved regardless of backend availability

### 🎯 Next Steps (Optional)
1. **Email Templates**: Customize password reset email templates
2. **Role Validation**: Add additional role-based validation
3. **Bulk User Import**: Create Edge Function for CSV user import
4. **User Management**: Add user deactivation/reactivation functions
5. **Audit Logging**: Track user creation and modifications

## 🔐 Security Features

- **Role-based Access Control**: Only admins can create any user, agencies can only create advertisers
- **JWT Validation**: All Edge Functions verify user authentication
- **Service Role Security**: Admin operations use service role key securely
- **Input Validation**: Email, required fields, and role validation
- **Clean-up on Failure**: If profile creation fails, auth user is automatically deleted
- **RLS Policies**: All database operations respect Row Level Security policies

This implementation provides a production-ready user creation system that properly handles Supabase authentication while maintaining backward compatibility through graceful fallback to demo mode.