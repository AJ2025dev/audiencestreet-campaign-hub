#!/bin/bash

echo "🔍 Checking Deployment Readiness"
echo "================================"

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in project root directory with supabase/config.toml"
    echo "   Please cd to your project directory first"
    exit 1
fi

echo "✅ In correct project directory"

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not installed"
    echo "   Run: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI installed"

# Check authentication
if ! supabase projects list &> /dev/null; then
    echo "❌ Not authenticated with Supabase"
    echo "   Run: supabase login"
    exit 1
fi

echo "✅ Authenticated with Supabase"

# Check Edge Function files exist
if [ ! -f "supabase/functions/admin-create-user/index.ts" ]; then
    echo "❌ admin-create-user/index.ts not found"
    exit 1
fi

if [ ! -f "supabase/functions/agency-create-advertiser/index.ts" ]; then
    echo "❌ agency-create-advertiser/index.ts not found"
    exit 1
fi

echo "✅ Both Edge Function files exist"

# Check file contents
echo ""
echo "📄 Checking file contents..."

admin_lines=$(wc -l < supabase/functions/admin-create-user/index.ts)
agency_lines=$(wc -l < supabase/functions/agency-create-advertiser/index.ts)

echo "   admin-create-user/index.ts: $admin_lines lines"
echo "   agency-create-advertiser/index.ts: $agency_lines lines"

if [ $admin_lines -lt 20 ]; then
    echo "⚠️  admin-create-user seems very short (might be incomplete)"
fi

if [ $agency_lines -lt 20 ]; then
    echo "⚠️  agency-create-advertiser seems very short (might be incomplete)"
fi

# Check for problematic files
if [ -f "supabase/functions/admin-create-user/deno.json" ]; then
    echo "⚠️  Found deno.json file (might cause parsing issues)"
    echo "   Consider removing: rm supabase/functions/*/deno.json"
fi

if [ -f "supabase/functions/admin-create-user/import_map.json" ]; then
    echo "⚠️  Found import_map.json file (might cause parsing issues)"
    echo "   Consider removing: rm supabase/functions/*/import_map.json"
fi

# Check first few lines of each file for syntax
echo ""
echo "📝 First few lines of admin-create-user/index.ts:"
head -5 supabase/functions/admin-create-user/index.ts

echo ""
echo "📝 First few lines of agency-create-advertiser/index.ts:"
head -5 supabase/functions/agency-create-advertiser/index.ts

echo ""
echo "🎯 Deployment Readiness Summary:"
echo "✅ Directory structure correct"
echo "✅ Supabase CLI ready"  
echo "✅ Authentication working"
echo "✅ Edge Function files present"
echo ""
echo "🚀 Ready to deploy! Run: ./deploy-minimal.sh"