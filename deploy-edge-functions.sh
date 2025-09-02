#!/bin/bash

echo "🚀 Deploying Supabase Edge Functions for Real User Creation"
echo "============================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

# Check if user is logged in
echo "🔍 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please login first:"
    echo "   supabase login"
    exit 1
fi

echo "✅ Supabase CLI authenticated"

# Link to the project
echo "🔗 Linking to Supabase project..."
supabase link --project-ref uzcmjulbpmeythxfusrm

# Deploy Edge Functions
echo "📦 Deploying admin-create-user function..."
supabase functions deploy admin-create-user --no-verify-jwt

echo "📦 Deploying agency-create-advertiser function..."
supabase functions deploy agency-create-advertiser --no-verify-jwt

echo ""
echo "🎉 Edge Functions deployed successfully!"
echo ""
echo "⚠️  IMPORTANT: You still need to set environment variables in Supabase Dashboard:"
echo "   1. Go to https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm/settings/functions"
echo "   2. Set these environment variables:"
echo "      SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
echo "      SITE_URL=https://aj2025dev.github.io/audiencestreet-campaign-hub"
echo ""
echo "📚 Full setup guide: https://github.com/AJ2025dev/audiencestreet-campaign-hub/blob/main/EDGE_FUNCTIONS_SETUP.md"
echo ""
echo "🧪 Test your functions at:"
echo "   - https://uzcmjulbpmeythxfusrm.supabase.co/functions/v1/admin-create-user"
echo "   - https://uzcmjulbpmeythxfusrm.supabase.co/functions/v1/agency-create-advertiser"