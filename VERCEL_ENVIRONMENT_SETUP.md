# 🚀 Vercel Environment Variables Setup

## 🎯 Required Environment Variables for Full Functionality

Go to your Vercel project → Settings → Environment Variables and add these:

### 1. ✅ Supabase Configuration (Required)
```
VITE_SUPABASE_URL = https://uzcmjulbpmeythxfusrm.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Y21qdWxicG1leXRoeGZ1c3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDQ0MDIsImV4cCI6MjA2OTgyMDQwMn0.1dj4G_WkA4c5pjD4HHi_s4UKWUvCUR1UAM5nMg8X5-U
VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Y21qdWxicG1leXRoeGZ1c3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDQ0MDIsImV4cCI6MjA2OTgyMDQwMn0.1dj4G_WkA4c5pjD4HHi_s4UKWUvCUR1UAM5nMg8X5-U
```

### 2. 🔧 Equativ API Integration (For Media Planning)
```
VITE_EQUATIV_API_KEY = your-equativ-api-token
```

### 3. 🤖 AI Features (Optional - for enhanced features)
```
VITE_OPENAI_API_KEY = sk-your-openai-api-key
VITE_MINIMAX_API_KEY = your-minimax-api-key (if using MiniMax)
```

### 4. 📊 Analytics & Tracking (Optional)
```
VITE_GA_MEASUREMENT_ID = G-XXXXXXXXXX (Google Analytics)
VITE_HOTJAR_ID = your-hotjar-id (Hotjar)
```

## 🎯 How to Get API Keys

### Equativ API Key:
1. Login to Equativ/Smart AdServer platform
2. Go to Account Settings → API Management
3. Generate new API token
4. Copy the token

### OpenAI API Key:
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"  
3. Copy the key (starts with `sk-`)

### MiniMax API Key (Alternative to OpenAI):
1. Visit MiniMax platform
2. Generate API credentials
3. Copy API key and Group ID

## 🚀 After Adding Variables

1. **Redeploy**: Vercel will automatically redeploy with new variables
2. **Test**: Check that all features work in your deployed app
3. **Verify**: 
   - ✅ Login/signup works
   - ✅ Admin dashboard accessible  
   - ✅ Equativ media planning loads
   - ✅ AI strategy generation works

## 🔍 Environment-Specific Configuration

### Production (Vercel):
All variables above should be set in Vercel dashboard

### Development (Local):
Update your `.env` file with the same variables (without `VITE_` prefix for backend-only vars)

### Supabase Functions:
Configure these in Supabase Dashboard → Settings → Secrets:
- `OPENAI_API_KEY`
- `EQUATIV_API_KEY` 
- `MINIMAX_API_KEY`
- `MINIMAX_GROUP_ID`

## ⚠️ Security Notes

1. **Never commit API keys** to git repositories
2. **Use Vercel environment variables** for production
3. **Use .env files** for local development (and add to .gitignore)
4. **Rotate keys regularly** for security
5. **Use different keys** for development and production

## 🛠️ Troubleshooting

### If features still don't work after adding variables:

1. **Check Variable Names**: Ensure exact spelling (case-sensitive)
2. **Redeploy**: Sometimes Vercel needs manual redeploy
3. **Check Logs**: Look at Vercel Function logs for errors
4. **Test Locally**: Verify variables work in local development
5. **API Key Validity**: Test API keys directly in their platforms

### Common Issues:

- ❌ **Equativ 401 Error**: Invalid API key or expired token
- ❌ **OpenAI 401 Error**: Invalid API key or insufficient credits
- ❌ **Supabase Connection Error**: Wrong project URL or anon key
- ❌ **Features Not Loading**: Missing `VITE_` prefix for frontend variables

## 🎉 Success Checklist

After configuration, verify these work:

- ✅ User authentication (login/signup)
- ✅ Role-based access (admin/agency/advertiser) 
- ✅ Campaign creation and management
- ✅ Equativ media planning interface
- ✅ AI strategy auto-generation
- ✅ Creative management
- ✅ Reports and analytics
- ✅ Admin dashboard functionality