# TAS Affiliate Management System - Project Structure

## Overview
This document outlines the directory structure and organization for the TAS Affiliate Management System. The project follows a modern full-stack architecture with separate backend and frontend components.

## Directory Structure
```
tas-affiliate-management-system/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── .gitignore
├── .env.example
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── tests/
│   ├── docs/
│   └── scripts/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── public/
│   │   ├── favicon.ico
│   │   └── assets/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── advertiser/
│   │   │   ├── affiliate/
│   │   │   ├── campaigns/
│   │   │   ├── tracking/
│   │   │   └── creatives/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   └── tests/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema/
├── docs/
│   ├── architecture.md
│   ├── api-docs/
│   ├── user-guides/
│   └── technical-specs/
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   └── dev.sh
└── docker/
    ├── docker-compose.yml
    ├── backend.Dockerfile
    └── frontend.Dockerfile
```

## Backend Structure Details

### Controllers
- `auth.controller.ts` - Authentication and user management
- `advertiser.controller.ts` - Advertiser-related operations
- `affiliate.controller.ts` - Affiliate-related operations
- `campaign.controller.ts` - Campaign management
- `offer.controller.ts` - Offer management
- `tracking.controller.ts` - Conversion and tracking endpoints
- `creative.controller.ts` - AI creative generation
- `report.controller.ts` - Reporting and analytics
- `admin.controller.ts` - Administrative functions

### Services
- `auth.service.ts` - Authentication logic
- `user.service.ts` - User management
- `advertiser.service.ts` - Advertiser business logic
- `affiliate.service.ts` - Affiliate business logic
- `campaign.service.ts` - Campaign management logic
- `offer.service.ts` - Offer management logic
- `tracking.service.ts` - Conversion tracking logic
- `creative.service.ts` - AI creative generation logic
- `meta-api.service.ts` - Meta Ads API integration
- `google-api.service.ts` - Google Ads API integration
- `payment.service.ts` - Payment processing
- `email.service.ts` - Email notifications
- `report.service.ts` - Reporting logic

### Models
- `user.model.ts` - User entity
- `advertiser.model.ts` - Advertiser entity
- `affiliate.model.ts` - Affiliate entity
- `campaign.model.ts` - Campaign entity
- `offer.model.ts` - Offer entity
- `creative.model.ts` - Creative asset entity
- `conversion.model.ts` - Conversion tracking entity
- `postback.model.ts` - Postback configuration entity
- `payment.model.ts` - Payment entity

### Middleware
- `auth.middleware.ts` - Authentication and authorization
- `validation.middleware.ts` - Request validation
- `error.middleware.ts` - Error handling
- `rate-limit.middleware.ts` - Rate limiting
- `logger.middleware.ts` - Request logging

### Routes
- `auth.routes.ts` - Authentication endpoints
- `advertiser.routes.ts` - Advertiser management endpoints
- `affiliate.routes.ts` - Affiliate management endpoints
- `campaign.routes.ts` - Campaign management endpoints
- `offer.routes.ts` - Offer management endpoints
- `tracking.routes.ts` - Tracking endpoints
- `creative.routes.ts` - Creative generation endpoints
- `report.routes.ts` - Reporting endpoints
- `admin.routes.ts` - Administrative endpoints

## Frontend Structure Details

### Components
- `ui/` - Reusable UI components (buttons, forms, cards, etc.)
- `layout/` - Layout components (header, sidebar, footer)
- `auth/` - Authentication components (login, register, password reset)
- `dashboard/` - Dashboard components for different user roles
- `advertiser/` - Advertiser-specific components
- `affiliate/` - Affiliate-specific components
- `campaigns/` - Campaign management components
- `tracking/` - Tracking and conversion components
- `creatives/` - AI creative generation components

### Pages
- `Home.tsx` - Landing page
- `Login.tsx` - Authentication page
- `Register.tsx` - Registration page
- `Dashboard.tsx` - Main dashboard (role-specific)
- `AdvertiserDashboard.tsx` - Advertiser dashboard
- `AffiliateDashboard.tsx` - Affiliate dashboard
- `AdminDashboard.tsx` - Admin dashboard
- `Campaigns.tsx` - Campaign management
- `Offers.tsx` - Offer management
- `Creatives.tsx` - Creative generation
- `Tracking.tsx` - Tracking and conversions
- `Reports.tsx` - Reporting dashboard
- `Settings.tsx` - User settings
- `Profile.tsx` - User profile

### Services
- `api.service.ts` - API client configuration
- `auth.service.ts` - Authentication API calls
- `advertiser.service.ts` - Advertiser API calls
- `affiliate.service.ts` - Affiliate API calls
- `campaign.service.ts` - Campaign API calls
- `offer.service.ts` - Offer API calls
- `tracking.service.ts` - Tracking API calls
- `creative.service.ts` - Creative API calls
- `report.service.ts` - Reporting API calls

### Hooks
- `useAuth.ts` - Authentication state management
- `useAdvertiser.ts` - Advertiser data management
- `useAffiliate.ts` - Affiliate data management
- `useCampaigns.ts` - Campaign data management
- `useTracking.ts` - Tracking data management
- `useCreatives.ts` - Creative data management
- `useReports.ts` - Reporting data management

## Database Structure
The database directory contains:
- Migration files for schema changes
- Seed data for initial setup
- Schema documentation

## Documentation
The docs directory contains:
- Architecture documentation
- API documentation
- User guides
- Technical specifications

## Scripts
Utility scripts for:
- Development environment setup
- Deployment processes
- Development workflows

## Docker Configuration
Docker files for containerizing:
- Backend services
- Frontend application
- Development environment