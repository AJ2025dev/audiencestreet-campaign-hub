#!/bin/bash

echo "🚀 Deploying Fixed Supabase Edge Functions"
echo "=========================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Installing..."
    npm install -g supabase
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Supabase CLI"
        exit 1
    fi
fi

echo "✅ Supabase CLI is available"

# Check if user is logged in
echo "🔍 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    echo "   Then run this script again."
    exit 1
fi

echo "✅ Authenticated with Supabase"

# Link to the project (suppress output if already linked)
echo "🔗 Linking to Supabase project..."
supabase link --project-ref uzcmjulbpmeythxfusrm 2>/dev/null || echo "Project already linked"

# Validate Edge Function syntax before deploying
echo "🔍 Validating Edge Function syntax..."

# Check admin-create-user function
if [ -f "supabase/functions/admin-create-user/index.ts" ]; then
    echo "✅ admin-create-user/index.ts found"
else
    echo "❌ admin-create-user/index.ts not found"
    exit 1
fi

# Check agency-create-advertiser function  
if [ -f "supabase/functions/agency-create-advertiser/index.ts" ]; then
    echo "✅ agency-create-advertiser/index.ts found"
else
    echo "❌ agency-create-advertiser/index.ts not found"
    exit 1
fi

# Deploy Edge Functions one by one with error handling
echo "📦 Deploying admin-create-user function..."
if supabase functions deploy admin-create-user --no-verify-jwt; then
    echo "✅ admin-create-user deployed successfully"
else
    echo "❌ Failed to deploy admin-create-user"
    echo "Check the error messages above for details"
    exit 1
fi

echo "📦 Deploying agency-create-advertiser function..."
if supabase functions deploy agency-create-advertiser --no-verify-jwt; then
    echo "✅ agency-create-advertiser deployed successfully"
else
    echo "❌ Failed to deploy agency-create-advertiser"
    echo "Check the error messages above for details"
    exit 1
fi

echo ""
echo "🎉 All Edge Functions deployed successfully!"
echo ""
echo "⚠️  IMPORTANT: Set environment variables in Supabase Dashboard:"
echo "   1. Go to: https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm/settings/functions"
echo "   2. Add environment variables:"
echo "      SUPABASE_SERVICE_ROLE_KEY=(your service role key)"
echo "      SITE_URL=https://aj2025dev.github.io/audiencestreet-campaign-hub"
echo ""
echo "🔑 Get your service role key from:"
echo "   https://supabase.com/dashboard/project/uzcmjulbpmeythxfusrm/settings/api"
echo ""
echo "🧪 Test your functions:"
echo "   - Login as admin → /admin → Add User"
echo "   - Login as agency → /agency → Add Advertiser"
echo ""
echo "✅ Edge Functions are now ready for production user creation!"