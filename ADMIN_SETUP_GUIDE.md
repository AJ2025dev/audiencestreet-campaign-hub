# 👑 Admin Dashboard Setup Guide

## 🔐 How to Set Up Admin Access

Your application uses role-based access control. Here's how to create an admin user:

### Method 1: Database Direct Access (Recommended)

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: `uzcmjulbpmeythxfusrm`

2. **Create Admin User**:
   - Go to "Authentication" → "Users"
   - Click "Add User" or invite via email
   - **Email**: your-admin-email@domain.com
   - **Password**: Set a secure password
   - Click "Create User"

3. **Set Admin Role**:
   - Go to "Table Editor" → "profiles" table
   - Find your user's profile record
   - Set the `role` field to: `admin`
   - Save the changes

### Method 2: SQL Command (Advanced)

Go to Supabase → SQL Editor and run:

```sql
-- First create the user account (or use existing)
-- Then update their profile to admin role
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = 'your-user-uuid-here';

-- Or create a new profile if it doesn't exist
INSERT INTO profiles (user_id, role, company_name, contact_email)
VALUES (
  'your-user-uuid-here',
  'admin', 
  'Admin Company',
  'admin@yourdomain.com'
);
```

### Method 3: Through Application Signup

1. **Sign up normally** through your app
2. **Check Supabase profiles table** for your user
3. **Update role to 'admin'** in Supabase dashboard

## 🎯 Admin Dashboard Features

Once you have admin access, you can:

✅ **User Management**: View and manage all users
✅ **Role Assignment**: Set user roles (admin/agency/advertiser)  
✅ **Commission Management**: Set up agency commissions
✅ **System Configuration**: Configure platform settings
✅ **Analytics Overview**: View platform-wide metrics
✅ **Campaign Oversight**: Monitor all campaigns across accounts

## 🔑 Access the Admin Dashboard

After setting up admin role:

1. **Login** to your application
2. **Navigate** to `/admin` URL
3. **Access** full admin functionality

**URL**: https://your-vercel-app.vercel.app/admin

## 🛡️ Role-Based Access Control

Your application supports three roles:

- **`admin`**: Full system access, user management, global settings
- **`agency`**: Manage campaigns for multiple advertisers, commission tracking
- **`advertiser`**: Manage own campaigns only, view own reports

## 🚨 Troubleshooting Admin Access

### If you can't access /admin:
1. ✅ Check your profile role in Supabase profiles table
2. ✅ Ensure role is exactly `admin` (lowercase)
3. ✅ Refresh the page or logout/login
4. ✅ Check browser console for any errors

### If profile doesn't exist:
1. ✅ Sign up through the application first
2. ✅ Check auth.users table for your user ID
3. ✅ Manually create profile with admin role
4. ✅ Refresh the application

## 📊 Default Admin User

For testing, you can create a default admin:
- **Email**: admin@audiencestreet.com  
- **Role**: admin
- **Company**: AudienceStreet Platform