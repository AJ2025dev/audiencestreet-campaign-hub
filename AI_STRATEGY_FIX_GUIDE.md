# 🤖 AI Strategy Auto-Population Fix Guide

## 🚨 Issue Identified

The AI strategy auto-population feature requires:
1. ✅ Supabase Function: `generate-campaign-strategy` (exists)
2. ❌ OpenAI API Key configuration in Supabase (missing)
3. ❌ Frontend integration may need connection (needs verification)

## 🔧 Step-by-Step Fix

### 1. Configure OpenAI API Key in Supabase

**Get OpenAI API Key:**
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

**Add to Supabase:**
1. Go to Supabase Dashboard → Your Project
2. Navigate to "Settings" → "Environment Variables" 
3. Add new secret:
   ```
   Name: OPENAI_API_KEY
   Value: sk-your-openai-api-key-here
   ```
4. Click "Save"

### 2. Deploy Supabase Functions

**Option A: Using Supabase CLI (Recommended)**
```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref uzcmjulbpmeythxfusrm

# Deploy the AI function
supabase functions deploy generate-campaign-strategy
```

**Option B: Manual Upload (Alternative)**
1. Go to Supabase Dashboard → Functions
2. Click "Create Function"
3. Name: `generate-campaign-strategy`
4. Copy the code from `/supabase/functions/generate-campaign-strategy/index.ts`
5. Deploy

### 3. Test AI Function Directly

Test the function in Supabase Dashboard:

**Test Payload:**
```json
{
  "brandDescription": "Premium sneaker brand targeting young adults",
  "campaignObjective": "Brand awareness and online sales",
  "landingPage": "https://example.com/sneakers"
}
```

**Expected Response:**
```json
{
  "strategy": "## Platform-Specific Campaign Strategy\n\n### 1. DSP Recommendations...[AI generated strategy]"
}
```

### 4. Verify Frontend Integration

The AI strategy should be called from the Create Campaign page. Check if the function is being called properly:

**In Create Campaign Form:**
- Look for "Auto Generate Strategy" button
- Should call: `/functions/v1/generate-campaign-strategy`
- Should populate strategy text area

### 5. Alternative: Manual Function Trigger

If auto-population doesn't work, you can call it manually:

```javascript
// Test in browser console on campaign page
const response = await fetch('https://uzcmjulbpmeythxfusrm.supabase.co/functions/v1/generate-campaign-strategy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Y21qdWxicG1leXRoeGZ1c3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNDQ0MDIsImV4cCI6MjA2OTgyMDQwMn0.1dj4G_WkA4c5pjD4HHi_s4UKWUvCUR1UAM5nMg8X5-U'
  },
  body: JSON.stringify({
    brandDescription: "Test brand",
    campaignObjective: "Brand awareness", 
    landingPage: "https://example.com"
  })
});
const data = await response.json();
console.log(data);
```

## 🎯 Expected Behavior After Fix

1. **Create Campaign Page**: "Auto Generate Strategy" button works
2. **AI Integration**: Generates comprehensive campaign strategy
3. **Strategy Content**: Includes DSP recommendations, budget allocation, targeting
4. **Platform-Specific**: Recommendations based on available platform options

## 🚨 Troubleshooting

### If AI strategy still doesn't work:

1. **Check Supabase Function Logs**:
   - Go to Supabase Dashboard → Functions → `generate-campaign-strategy`
   - Check "Logs" tab for errors

2. **Common Issues**:
   - ❌ OpenAI API key not set
   - ❌ OpenAI API key invalid or expired
   - ❌ Function not deployed
   - ❌ Frontend not calling the function

3. **Test with Sample Request**:
   - Use Supabase function test interface
   - Check if OpenAI API responds

### Error Messages to Look For:

- `"OpenAI API key not configured"` → Add OPENAI_API_KEY to Supabase
- `"OpenAI API rate limit exceeded"` → Wait or upgrade OpenAI plan  
- `"Function not found"` → Deploy the function to Supabase
- Network errors → Check Supabase project URL and auth

## 💡 Feature Enhancement Ideas

Once working, you can enhance the AI strategy:
1. **Custom Templates**: Add industry-specific strategy templates
2. **Budget Optimization**: AI-powered budget allocation suggestions  
3. **A/B Testing**: Generate multiple strategy variations
4. **Integration**: Connect with actual DSP APIs for real-time data