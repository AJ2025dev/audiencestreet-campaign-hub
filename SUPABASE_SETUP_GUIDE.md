# 🔧 Supabase Functions Deployment Guide

## Required Environment Variables for Supabase

Your Supabase project needs these secrets configured:

### 1. OpenAI Integration
```bash
# In Supabase Dashboard → Settings → API → Secrets
OPENAI_API_KEY = your-openai-api-key
```

### 2. Equativ Integration  
```bash
EQUATIV_API_KEY = your-equativ-api-token
```

### 3. MiniMax Integration (if using)
```bash
MINIMAX_API_KEY = your-minimax-api-key
MINIMAX_GROUP_ID = your-minimax-group-id
```

## Deploy Functions to Supabase

### Option 1: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref uzcmjulbpmeythxfusrm

# Deploy all functions
supabase functions deploy
```

### Option 2: Manual Deployment via Dashboard
1. Go to Supabase Dashboard → Functions
2. Create each function manually:
   - `generate-campaign-strategy`
   - `equativ-media-planning`
   - `equativ-campaign-management` 
   - `equativ-inventory-analysis`
   - `generate-creatives`
   - `campaign-price`

## Required Functions for Your Features:

### AI Strategy Auto-Population:
- Function: `generate-campaign-strategy`
- Requires: `OPENAI_API_KEY`

### Equativ Integration:
- Function: `equativ-media-planning`
- Function: `equativ-campaign-management`
- Function: `equativ-inventory-analysis`
- Requires: `EQUATIV_API_KEY`

### Creative Generation:
- Function: `generate-creatives`
- Requires: `OPENAI_API_KEY` or `MINIMAX_API_KEY`