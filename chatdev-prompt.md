# ChatDev Prompt: Build a Comprehensive Demand Side Platform (DSP)

## Project Overview
Create a full-stack programmatic advertising Demand Side Platform (DSP) that enables advertisers and agencies to manage digital advertising campaigns across multiple channels with real-time bidding, audience targeting, and comprehensive analytics.

## Core Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL) with Edge Functions
- **Authentication**: Supabase Auth with role-based access control
- **State Management**: React Query + Context API
- **UI Framework**: shadcn/ui with custom design system
- **External APIs**: OpenAI for campaign strategy generation

## User Roles & Access Control
1. **Admin**: Full system access, user management, commission settings
2. **Agency**: Manage multiple advertiser accounts, view commissions
3. **Advertiser**: Manage own campaigns and budgets

## Core Features to Implement

### 1. Authentication & User Management
- Secure login/signup with email verification
- Role-based routing and permissions
- User profiles with company information
- Agency-advertiser relationship management

### 2. Campaign Management System
- Create, edit, pause/resume campaigns
- Set start/end dates, budgets (total & daily)
- Campaign status tracking (draft, active, paused, completed)
- Budget utilization alerts and auto-pause functionality
- Campaign targeting configuration (demographics, interests, locations)
- Frequency capping settings

### 3. Real-Time Bidding & Tracking
- Impression tracking with spend monitoring
- Click tracking and attribution
- Real-time budget pacing algorithms
- Performance metrics calculation (CTR, CPC, ROAS)
- Automated campaign optimization

### 4. Domain & Publisher Management
- Allow/blocklist management for domains and publishers
- Global and campaign-specific lists
- Bulk upload functionality for lists (CSV/Excel)
- Publisher list categorization and filtering

### 5. Private Marketplace (PMP) Deals
- Create and manage PMP deal configurations
- Deal pricing (fixed price, auction) 
- Deal targeting and inventory specification
- DSP integration settings
- Deal performance tracking

### 6. Multi-Platform Integration
- **Google Ads**: Campaign sync, budget management, performance data
- **Meta Ads**: Facebook/Instagram campaign management
- **Retail Media**: Amazon, Walmart, Target advertising integration
- **TAS Open Marketplace**: Programmatic buying interface

### 7. Creative Management
- Upload and manage ad creatives (images, videos, HTML5)
- Creative specifications for different platforms
- A/B testing capabilities for creatives
- AI-powered creative generation and optimization

### 8. Advanced Targeting & Audiences
- Demographic targeting (age, gender, income)
- Geographic targeting (countries, states, cities, zip codes)
- Interest and behavioral targeting
- Custom audience uploads (email lists, customer data)
- Lookalike audience creation
- Cross-device targeting capabilities

### 9. Budget Control & Optimization
- Real-time spend monitoring and alerts
- Automatic budget redistribution based on performance
- Bid strategy optimization (CPC, CPM, CPA, ROAS)
- Dayparting and scheduling controls
- Weather-based bidding adjustments

### 10. Reporting & Analytics Dashboard
- Real-time campaign performance metrics
- Custom date range reporting
- Export capabilities (PDF, CSV, Excel)
- Attribution modeling and conversion tracking
- ROI and ROAS calculation
- Cross-platform performance comparison

### 11. Commission & Billing System
- Agency commission calculation and tracking
- Automated invoicing and payment processing
- Spend reconciliation across platforms
- Margin management for agencies
- Financial reporting and forecasting

### 12. Administrative Tools
- System health monitoring
- User activity logs and audit trails
- Platform integration status monitoring
- Automated campaign rule engine
- Data backup and recovery systems

## Technical Requirements

### Database Schema (Supabase)
- **profiles**: User information and roles
- **campaigns**: Campaign data with targeting config
- **impression_tracking**: Real-time performance data
- **clicks**: Click tracking and attribution
- **domain_lists**: Publisher allow/blocklists
- **frequency_caps**: Campaign frequency settings
- **pmp_deals**: Private marketplace configurations
- **platform_credentials**: API keys for external platforms
- **agency_advertisers**: Agency-client relationships
- **commissions**: Commission structures and tracking

### Security & Compliance
- Row Level Security (RLS) for all database operations
- GDPR compliance for user data handling
- Secure API key management
- Rate limiting and DDoS protection
- Data encryption at rest and in transit

### Performance & Scalability
- Optimized database queries with proper indexing
- Caching strategies for frequently accessed data
- Asynchronous processing for heavy operations
- CDN integration for static assets
- Auto-scaling capabilities

### Integration APIs
- OpenAI API for AI-powered campaign strategies
- Google Ads API for campaign management
- Facebook Marketing API for Meta campaigns
- Amazon Advertising API for retail media
- Real-time bidding protocols (RTB)

## UI/UX Requirements
- Clean, modern dashboard with intuitive navigation
- Responsive design for all device types
- Dark/light mode toggle
- Accessibility compliance (WCAG 2.1)
- Interactive charts and visualizations
- Drag-and-drop interfaces for campaign setup
- Toast notifications for important events
- Loading states and error handling

## Development Guidelines
- Type-safe development with TypeScript
- Component-driven architecture
- Comprehensive error handling and logging
- Unit and integration test coverage
- CI/CD pipeline with automated testing
- Environment-based configuration
- Code documentation and API documentation

## Success Metrics
- Campaign creation to activation time < 5 minutes
- Real-time data updates within 30 seconds
- 99.9% uptime and reliability
- Support for 1000+ concurrent campaigns
- Sub-second page load times
- Mobile-first responsive design

## Deployment & DevOps
- Automated deployment pipeline
- Environment management (dev, staging, production)
- Database migrations and rollback strategies
- Monitoring and alerting systems
- Performance optimization and caching
- Backup and disaster recovery procedures

Build this as a production-ready platform with enterprise-level features, focusing on performance, security, and user experience. The system should handle high-volume programmatic advertising operations while maintaining real-time responsiveness and data accuracy.