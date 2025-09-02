#!/bin/bash

echo "🚀 Deploying Minimal Edge Functions (Test Deployment)"
echo "=================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check authentication
echo "🔍 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not authenticated. Please run:"
    echo "   supabase login"
    exit 1
fi

echo "✅ Authenticated with Supabase"

# Link project
echo "🔗 Linking to project..."
supabase link --project-ref uzcmjulbpmeythxfusrm 2>/dev/null || echo "Project already linked"

# Deploy minimal functions
echo ""
echo "📦 Deploying admin-create-user (minimal version)..."
if supabase functions deploy admin-create-user --no-verify-jwt; then
    echo "✅ admin-create-user deployed successfully!"
else
    echo "❌ Failed to deploy admin-create-user"
    echo "Error details above ☝️"
    exit 1
fi

echo ""
echo "📦 Deploying agency-create-advertiser (minimal version)..."
if supabase functions deploy agency-create-advertiser --no-verify-jwt; then
    echo "✅ agency-create-advertiser deployed successfully!"
else
    echo "❌ Failed to deploy agency-create-advertiser"
    echo "Error details above ☝️"
    exit 1
fi

echo ""
echo "🎉 SUCCESS! Both Edge Functions deployed successfully!"
echo ""
echo "🧪 Test your functions:"
echo "   curl https://uzcmjulbpmeythxfusrm.supabase.co/functions/v1/admin-create-user"
echo "   curl https://uzcmjulbpmeythxfusrm.supabase.co/functions/v1/agency-create-advertiser"
echo ""
echo "📱 Test in your app:"
echo "   1. Go to https://aj2025dev.github.io/audiencestreet-campaign-hub"
echo "   2. Try creating a user (should show success message)"
echo ""
echo "🔧 Next: Add full functionality back to the Edge Functions"