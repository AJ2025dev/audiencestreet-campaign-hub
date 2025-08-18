# DSP Platform UI Design Prompt for Figma Make

## Project Overview
Design a comprehensive Demand-Side Platform (DSP) for programmatic advertising with multiple user roles, advanced campaign management, and real-time analytics.

## Design System Requirements

### Brand & Visual Identity
- **Style**: Modern, professional B2B SaaS interface
- **Color Palette**: 
  - Primary: Deep blue (#1e40af) for trust and professionalism
  - Secondary: Emerald green (#059669) for success states
  - Accent: Amber (#f59e0b) for warnings and highlights
  - Neutral grays: #f8fafc to #1e293b for backgrounds and text
- **Typography**: Clean, readable sans-serif (Inter or similar)
- **UI Style**: Clean, minimal with subtle shadows and rounded corners
- **Data Visualization**: Professional charts and graphs with consistent color coding

### Layout & Navigation
- **Sidebar Navigation**: Collapsible left sidebar with role-based menu items
- **Header**: Global search, notifications, user profile, company branding
- **Responsive**: Desktop-first with mobile considerations
- **Dark/Light Mode**: Support for both themes

## User Roles & Dashboards

### 1. Advertiser Dashboard
- **Campaign Performance Cards**: Active campaigns, spend, impressions, CTR
- **Quick Actions**: Create campaign, view reports, manage budget
- **Recent Activity**: Campaign updates, bid adjustments, creative approvals
- **Performance Charts**: Spend trends, impression volume, conversion tracking

### 2. Agency Dashboard  
- **Client Overview**: Multiple advertiser accounts management
- **Consolidated Metrics**: Cross-client performance summaries
- **Client Switching**: Easy navigation between different advertiser accounts
- **Commission Tracking**: Agency fee calculations and reporting

### 3. Admin Dashboard
- **Platform Overview**: System health, user activity, revenue metrics
- **User Management**: Add/edit users, role assignments, access control
- **System Monitoring**: Platform performance, API usage, error tracking
- **Financial Dashboard**: Revenue, commissions, billing overview

## Core Feature Screens

### Campaign Management
- **Campaign List**: Sortable table with status, budget, performance metrics
- **Campaign Builder**: Multi-step wizard for campaign creation
  - Basic Info (name, budget, dates, goals)
  - Targeting (demographics, interests, behaviors, custom audiences)
  - Creative Assets (upload, preview, AI generation tools)
  - Budget & Bidding (daily/lifetime budgets, bid strategies)
  - Review & Launch (summary before activation)
- **Campaign Details**: In-depth view with performance charts, settings, optimization suggestions

### Audience Management
- **Audience Library**: Pre-built and custom audience segments
- **Audience Builder**: Visual interface for creating complex targeting rules
- **Lookalike Audiences**: AI-powered similar audience generation
- **Audience Analytics**: Size estimates, overlap analysis, performance history

### Creative Management
- **Creative Library**: Grid view of all ad creatives with filters
- **Creative Studio**: 
  - Upload interface with drag-and-drop
  - AI creative generation with prompts and customization
  - Preview across different ad formats and sizes
  - A/B testing setup for creative variants
- **Performance Analysis**: Creative-level metrics and optimization recommendations

### Reporting & Analytics
- **Report Builder**: Drag-and-drop interface for custom reports
- **Dashboard Widgets**: Configurable performance widgets
- **Real-time Data**: Live campaign performance updates
- **Export Options**: PDF, CSV, scheduled email reports
- **Attribution Analysis**: Multi-touch attribution and conversion paths

### Budget & Bidding Controls
- **Budget Management**: Real-time spend tracking with alerts
- **Bid Strategy Center**: Automated and manual bidding options
- **Pacing Controls**: Even spend distribution tools
- **Budget Allocation**: Cross-campaign budget optimization

### Inventory & Supply
- **Publisher Lists**: Whitelist/blacklist management
- **Domain Controls**: Site-level targeting and blocking
- **App Lists**: Mobile app inventory management
- **PMP Deals**: Private marketplace deal negotiation interface
- **Supply Quality**: Fraud detection and brand safety tools

## Technical Integration Screens

### Platform Connections
- **Google Ads Integration**: OAuth setup, sync status, data mapping
- **Meta Ads Integration**: Similar to Google with platform-specific controls
- **Retail Media Platforms**: Amazon DSP, Walmart Connect interfaces
- **Data Connectors**: First-party data integration tools

### Advanced Features
- **Frequency Capping**: Cross-platform frequency management
- **Dayparting**: Time-based campaign scheduling
- **Geo-targeting**: Map-based location targeting with radius tools
- **Weather Targeting**: Dynamic creative based on weather conditions
- **Real-time Optimization**: AI-powered bid and creative adjustments

## UI Components & Patterns

### Data Tables
- Sortable columns with clear hierarchy
- Bulk actions for multiple selections  
- Inline editing for quick updates
- Pagination and filtering controls
- Export functionality

### Forms & Inputs
- Multi-step wizards with progress indicators
- Smart validation with helpful error messages
- Auto-complete for common fields
- File upload with preview capabilities
- Toggle switches for on/off settings

### Charts & Visualization
- Time series charts for performance trends
- Funnel charts for conversion tracking
- Heatmaps for geo-performance
- Pie charts for budget allocation
- Real-time updating widgets

### Status Indicators
- Campaign status badges (Active, Paused, Ended)
- Performance indicators (green/yellow/red)
- Loading states and skeleton screens
- Success/error notifications and toasts

## Screen Specifications

### Key Screens to Design
1. **Authentication**: Login, signup, password reset
2. **Onboarding**: Welcome flow, platform setup, first campaign
3. **Main Dashboards**: Advertiser, agency, admin variants
4. **Campaign Suite**: List, create, edit, analytics views
5. **Audience Management**: Builder, library, analytics
6. **Creative Studio**: Upload, generate, manage, test
7. **Reporting Center**: Builder, scheduled reports, exports
8. **Settings**: Account, billing, integrations, team management
9. **Admin Tools**: User management, system monitoring
10. **Mobile Views**: Key screens optimized for tablets/phones

## Success Metrics
- Intuitive navigation with minimal training required
- Fast task completion for common workflows
- Clear data visualization for decision-making
- Professional appearance suitable for enterprise clients
- Scalable design system for future features

## Deliverables
- Complete design system with components library
- High-fidelity mockups for all major screens
- Interactive prototypes for key user flows
- Mobile/responsive variations
- Design specifications and developer handoff assets
- Style guide documentation

## Additional Notes
- Emphasize data-driven decision making in the interface
- Include subtle animations for state changes and loading
- Ensure accessibility compliance (WCAG 2.1 AA)
- Consider international users with localization support
- Design for performance with large datasets and real-time updates