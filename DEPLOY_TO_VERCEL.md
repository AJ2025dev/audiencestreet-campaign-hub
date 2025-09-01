# 🚀 Deploy AudienceStreet Campaign Hub to Vercel

## Quick Vercel Deployment

### Option 1: Direct Vercel Deployment (Fastest)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from project directory:**
```bash
cd /home/user/webapp
vercel --prod
```

4. **Follow the prompts:**
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N` (create new)
- Project name: `audiencestreet-campaign-hub`
- Directory: `./` (current directory)

### Option 2: GitHub Integration (Automatic Deployments)

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository: `AJ2025dev/audiencestreet-campaign-hub`

2. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   ```
   VITE_SUPABASE_URL = https://uzcmjulbpmeythxfusrm.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_EQUATIV_API_KEY = [Your Equativ API Key]
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

### Option 3: Use Existing GitHub Actions Workflow

Your repository already has a GitHub Actions workflow for Vercel deployment!

1. **Set up GitHub Repository Secrets:**
   Go to GitHub Repository → Settings → Secrets and variables → Actions

   **Add these secrets:**
   ```
   VERCEL_DEPLOY_HOOK = [Get from Vercel Project Settings → Git → Deploy Hooks]
   ```

2. **Set up Repository Variables:**
   ```
   API_BASE_URL = https://uzcmjulbpmeythxfusrm.supabase.co
   STAGING_API_BASE_URL = https://uzcmjulbpmeythxfusrm.supabase.co
   ```

3. **Trigger Deployment:**
   - Go to GitHub → Actions → "Auto Deploy & QA"
   - Click "Run workflow" → Select `main` branch → "Run workflow"

## Expected Results
- **Production URL**: `https://your-app.vercel.app`
- **Automatic deployments** on every push to main branch
- **Preview deployments** for pull requests

## Advantages of Vercel
- ✅ **Zero configuration** for React/Vite apps
- ✅ **Automatic deployments** from GitHub
- ✅ **Preview deployments** for testing
- ✅ **Built-in analytics** and monitoring
- ✅ **Edge network** for fast global delivery
- ✅ **Custom domains** and SSL certificates

## Verification Steps
1. ✅ Visit production URL
2. ✅ Test user authentication
3. ✅ Test admin functionality
4. ✅ Test Supabase integration
5. ✅ Test responsive design on mobile