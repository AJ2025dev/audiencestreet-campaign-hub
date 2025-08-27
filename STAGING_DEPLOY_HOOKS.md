# Staging Deploy Hooks Setup

## Required Secrets
The staging workflow needs these secrets:
- VERCEL_STAGING_DEPLOY_HOOK
- RENDER_STAGING_DEPLOY_HOOK

## How to Add Them

1. Go to GitHub repo Settings → Secrets and variables → Actions
2. On Secrets tab, click "New repository secret"
3. Add each secret with correct deploy hook URLs from Vercel/Render
4. If you don't have staging environments, use production deploy hooks