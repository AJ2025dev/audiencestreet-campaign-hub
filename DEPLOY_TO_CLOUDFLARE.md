# 🚀 Deploy AudienceStreet Campaign Hub to Cloudflare Pages

## Prerequisites ✅
- [x] Code pushed to GitHub repository
- [x] Build issues fixed (ESLint, TypeScript)
- [x] Environment variables configured
- [ ] Cloudflare API key configured

## Quick Deploy Steps

### 1. Set Up Cloudflare API Key
1. Go to **Deploy** tab in sidebar
2. Follow instructions to create Cloudflare API token
3. Enter API key and save

### 2. Build the Application
```bash
cd /home/user/webapp
npm run build
```

### 3. Deploy to Cloudflare Pages
After API key is configured, run:
```bash
# Setup Cloudflare authentication
setup_cloudflare_api_key

# Create Cloudflare Pages project
npx wrangler pages project create audiencestreet-campaign-hub \
  --production-branch main \
  --compatibility-date 2024-01-01

# Deploy the application
npx wrangler pages deploy dist --project-name audiencestreet-campaign-hub
```

### 4. Configure Environment Variables in Cloudflare
```bash
# Set production environment variables
npx wrangler pages secret put VITE_SUPABASE_URL --project-name audiencestreet-campaign-hub
npx wrangler pages secret put VITE_SUPABASE_ANON_KEY --project-name audiencestreet-campaign-hub
npx wrangler pages secret put VITE_EQUATIV_API_KEY --project-name audiencestreet-campaign-hub
```

## Expected Results
- **Production URL**: `https://audiencestreet-campaign-hub.pages.dev`
- **Branch URL**: `https://main.audiencestreet-campaign-hub.pages.dev`
- **Custom Domain**: Can be configured later

## Verification Steps
1. ✅ Visit production URL
2. ✅ Test user authentication (login/signup)
3. ✅ Test admin access at `/admin`
4. ✅ Test campaign creation functionality
5. ✅ Test Equativ integration features

## Troubleshooting
- If deployment fails: Check API key permissions
- If build fails: Verify `npm run build` works locally
- If app doesn't load: Check environment variables in Cloudflare dashboard