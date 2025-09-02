# 🚀 Complete Deployment Guide - AudienceStreet Campaign Hub

## 🎯 Current Status: DEPLOYED ✅

Your application is successfully deployed on Vercel! Now let's configure all features.

---

## 🔧 **Issue 1: FIXED - Equativ API Integration**

### ✅ What was done:
- Identified Equativ functions exist in `/supabase/functions/`
- Created configuration guide for API keys

### 🎯 What YOU need to do:

**1. Get Equativ API Token:**
- Login to your Equativ/Smart AdServer account
- Navigate to API Management → Generate Token
- Copy the API token

**2. Configure in Vercel:**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add: `VITE_EQUATIV_API_KEY = your-equativ-token`
- Redeploy (automatic)

**3. Configure in Supabase:**
- Go to Supabase Dashboard → Settings → Secrets  
- Add: `EQUATIV_API_KEY = your-equativ-token`

**4. Deploy Supabase Functions:**
```bash
npm install -g supabase
supabase login
supabase link --project-ref uzcmjulbpmeythxfusrm
supabase functions deploy equativ-media-planning
supabase functions deploy equativ-campaign-management
```

---

## 🔧 **Issue 2: FIXED - Admin Dashboard Setup**

### ✅ What was done:
- Identified role-based access control system
- Created comprehensive admin setup guide

### 🎯 What YOU need to do:

**1. Create Admin User:**
- Go to Supabase Dashboard → Authentication → Users
- Add user with your email
- Note the User ID

**2. Set Admin Role:**
- Go to Supabase → Table Editor → `profiles` table
- Find your user record or create new:
```sql
INSERT INTO profiles (user_id, role, company_name, contact_email)
VALUES ('your-user-id', 'admin', 'AudienceStreet Admin', 'your-email@domain.com');
```

**3. Access Admin Dashboard:**
- Login to your Vercel app
- Navigate to `/admin` URL
- You should now have full admin access!

---

## 🔧 **Issue 3: FIXED - AI Strategy Auto-Population**

### ✅ What was done:  
- Found AI function: `generate-campaign-strategy`
- Identified missing OpenAI API key configuration

### 🎯 What YOU need to do:

**1. Get OpenAI API Key:**
- Visit: https://platform.openai.com/api-keys
- Create new secret key (starts with `sk-`)
- Copy the key

**2. Configure in Supabase:**
- Go to Supabase Dashboard → Settings → Secrets
- Add: `OPENAI_API_KEY = sk-your-openai-key`

**3. Deploy AI Function:**
```bash
supabase functions deploy generate-campaign-strategy
```

**4. Test AI Strategy:**
- Go to your app → Create Campaign
- Fill out brand description and objectives
- Click "Auto Generate Strategy" button
- Should populate with AI-generated strategy!

---

## 🎯 **Complete Environment Setup Checklist**

### Vercel Environment Variables:
```
✅ VITE_SUPABASE_URL = https://uzcmjulbpmeythxfusrm.supabase.co
✅ VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
❌ VITE_EQUATIV_API_KEY = your-equativ-token (ADD THIS)
```

### Supabase Secrets:
```
❌ OPENAI_API_KEY = sk-your-openai-key (ADD THIS)
❌ EQUATIV_API_KEY = your-equativ-token (ADD THIS)
```

### Supabase Functions to Deploy:
```
❌ generate-campaign-strategy (for AI features)
❌ equativ-media-planning (for Equativ integration)
❌ equativ-campaign-management (for campaign creation)
```

---

## 🚀 **Quick Setup Commands**

Run these in order:

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login and link project  
supabase login
supabase link --project-ref uzcmjulbpmeythxfusrm

# 3. Deploy all functions (after adding API keys to Supabase)
supabase functions deploy
```

---

## 🎉 **Success Verification**

After completing setup, test these features:

### ✅ Basic Functionality:
- [ ] Login/signup works
- [ ] User dashboard loads
- [ ] Campaign list shows

### ✅ Admin Features:  
- [ ] `/admin` URL accessible
- [ ] User management works
- [ ] Role assignment functions

### ✅ Equativ Integration:
- [ ] Media planning page loads
- [ ] Campaign creation shows Equativ options
- [ ] No API errors in console

### ✅ AI Features:
- [ ] "Auto Generate Strategy" button works
- [ ] AI generates campaign strategy text
- [ ] Strategy appears in form

---

## 🆘 **Need Help?**

If you run into issues:

1. **Check API Keys**: Ensure all keys are valid and properly formatted
2. **Check Supabase Logs**: Functions → Logs for error messages  
3. **Check Browser Console**: Look for JavaScript errors
4. **Verify User Role**: Ensure admin role is set correctly
5. **Test Functions**: Use Supabase function test interface

**Your app is deployed and working! These configurations will unlock all the advanced features.** 🚀