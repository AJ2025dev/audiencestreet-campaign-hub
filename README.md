# AudienceStreet Campaign Hub

## Project Overview
- **Name**: AudienceStreet Campaign Hub
- **Goal**: Comprehensive campaign management platform for advertisers, agencies, and admins
- **Features**: Enhanced admin dashboard, agency management, advertiser controls, commission tracking, media planning tools

## URLs
- **Production**: https://aj2025dev.github.io/audiencestreet-campaign-hub
- **GitHub**: https://github.com/AJ2025dev/audiencestreet-campaign-hub

## Current Status
- **Platform**: GitHub Pages
- **Status**: ✅ Active - Successfully deployed with foreign key constraint fixes
- **Tech Stack**: React 18 + TypeScript + TailwindCSS + Supabase + Vite
- **Last Updated**: 2025-01-02

## Key Features

### ✅ Currently Completed Features
1. **Enhanced Admin Dashboard** - Comprehensive 5-tab interface (Users, Agencies, Advertisers, Commissions, Campaigns)
2. **User Management** - Create, edit, and manage users with role-based access (Admin, Agency, Advertiser)
3. **Agency Dashboard** - Enhanced agency interface for managing advertisers and setting commissions
4. **Media Planning Tools** - Equativ API integration for reach forecasts, budget optimization, and inventory analysis
5. **Campaign Strategy Generator** - AI-powered campaign strategy creation using OpenAI integration
6. **Commission Management** - Set and track commission rates for agencies and advertisers
7. **API Configuration Interface** - Manage Equativ, OpenAI, and other API integrations
8. **Demo Mode Implementation** - User creation functionality using local state management
9. **Authentication System** - Supabase-based authentication with role-based routing
10. **Responsive UI** - Modern glassmorphism design with shadcn/ui components

### 📋 Functional Entry URIs
- `/admin` - Enhanced admin dashboard with complete user/agency/advertiser management
- `/agency` - Enhanced agency dashboard for managing advertisers and commissions
- `/advertiser` - Advertiser dashboard for campaign management
- `/login` - Authentication interface
- `/campaigns/create` - Campaign creation with media planning tools
- `/media-planning` - Dedicated media planning and strategy tools
- `/equativ-*` - Equativ DSP integration endpoints

## Data Architecture
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Main Tables**: profiles, campaigns, commissions, agency_advertisers
- **Storage Services**: Supabase Auth, Database, and Edge Functions
- **Data Flow**: React → Supabase Client → PostgreSQL with real-time subscriptions

## User Guide

### For Admins
1. **Access**: Navigate to `/admin` with admin role
2. **User Management**: Create users, assign roles (admin/agency/advertiser)
3. **Agency Oversight**: Monitor agencies, their advertisers, and commission structures
4. **Media Planning**: Use Equativ integration for reach forecasts and budget optimization
5. **API Management**: Configure API keys for Equativ, OpenAI, and other services

### For Agencies
1. **Access**: Navigate to `/agency` with agency role
2. **Advertiser Management**: Add new advertisers to your portfolio
3. **Commission Setting**: Set and manage commission rates for each advertiser
4. **Portfolio Tracking**: Monitor advertiser performance and revenue

### For Advertisers
1. **Access**: Navigate to `/advertiser` with advertiser role
2. **Campaign Creation**: Create and manage advertising campaigns
3. **Budget Control**: Set and monitor campaign budgets
4. **Performance Tracking**: View campaign analytics and optimization suggestions

## Recent Updates (January 2, 2025)

### 🚀 MAJOR ENHANCEMENT: Real Database User Creation System
- **Implementation**: Supabase Edge Functions for proper user creation workflow
- **Edge Functions Created**:
  - `admin-create-user` - Allows admins to create users with any role
  - `agency-create-advertiser` - Allows agencies to create advertisers under their management
- **Database Flow**: auth.users → profiles → agency_advertisers (proper foreign key handling)
- **Features**:
  - ✅ Real Supabase authentication user creation
  - ✅ Proper profile creation with user_id foreign key references
  - ✅ Agency-advertiser relationship management
  - ✅ Automatic password reset email integration
  - ✅ Graceful fallback to demo mode if Edge Functions unavailable
  - ✅ Role-based access control and security validation

### ✅ Foreign Key Constraint Resolution
- **Previous Issue**: Database errors when creating users due to Supabase auth.users foreign key requirements
- **Current Solution**: Production-ready Edge Functions with proper auth workflow
- **Fallback**: Demo mode still available if Edge Functions not deployed

### ✅ Build System Optimization
- Successfully builds with Vite (build time: ~20-25 seconds)
- No TypeScript or ESLint errors
- Optimized bundle size for production deployment

## Technical Implementation

### Authentication & Authorization
```typescript
// Role-based access control
interface Profile {
  id: string;
  user_id: string; 
  role: 'agency' | 'advertiser' | 'admin';
  company_name: string;
  contact_email?: string;
  // ... other fields
}
```

### Demo Mode User Creation
```typescript
// Safe user creation without database constraints
const createUser = async () => {
  const newUserId = crypto.randomUUID()
  const newUser = {
    id: newUserId,
    email: userForm.email,
    created_at: new Date().toISOString(),
    profiles: { /* profile data */ }
  }
  setUsers(prevUsers => [...prevUsers, newUser])
  // Shows success without database operations
}
```

## Deployment

### GitHub Pages Deployment
```bash
npm run build    # Build production assets
npm run deploy   # Deploy to GitHub Pages
```

### Development Setup
```bash
git clone https://github.com/AJ2025dev/audiencestreet-campaign-hub.git
cd audiencestreet-campaign-hub
npm install      # Install dependencies
npm run dev      # Start development server
```

## Environment Variables
Required for full functionality:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `EQUATIV_API_KEY` - Equativ DSP API key (stored via admin interface)
- `OPENAI_API_KEY` - OpenAI API key for campaign strategy generation

## Edge Functions Setup (Production User Creation)

### 🚀 Real Database User Creation Available!
The application now supports real database user creation through Supabase Edge Functions:

#### Setup Required for Production Use:
1. **Deploy Edge Functions**:
   ```bash
   supabase functions deploy admin-create-user
   supabase functions deploy agency-create-advertiser
   ```

2. **Set Environment Variables** in Supabase Dashboard:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SITE_URL=https://aj2025dev.github.io/audiencestreet-campaign-hub
   ```

3. **Test User Creation**:
   - Login as admin → `/admin` → "Add User"
   - Login as agency → `/agency` → "Add Advertiser"

📚 **Full Setup Guide**: See `EDGE_FUNCTIONS_SETUP.md` for comprehensive instructions

#### Current Behavior:
- ✅ **Edge Functions Available**: Real database user creation with proper auth flow
- 🔄 **Edge Functions Not Deployed**: Graceful fallback to demo mode
- 📧 **Password Management**: Automatic password reset emails sent to new users

## Next Development Steps
1. **Enhanced Analytics** - Add detailed performance reporting and dashboards
2. **Campaign Automation** - Expand AI-powered campaign optimization features
3. **Third-party Integrations** - Add Google Ads, Facebook Ads API integrations
4. **Real-time Features** - Implement live campaign monitoring and notifications
5. **Bulk User Import** - CSV import functionality for batch user creation