# TAS Affiliate Management System

Performance marketing platform for advertiser and affiliate management with AI creative generation.

## Overview

The TAS Affiliate Management System is a comprehensive platform that connects advertisers with affiliates, enabling efficient campaign management, tracking, and optimization. The system provides features for advertiser management, affiliate management, campaign tracking, and AI-powered creative generation.

## Prerequisites

- Node.js 16+
- PostgreSQL
- npm or yarn

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your database credentials and other configuration.

4. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

## Project Structure

### Backend
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.js         # Application entry point
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

### Frontend
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   ├── services/        # API service functions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Features

### Authentication
- User registration with role selection (advertiser/affiliate)
- Secure login with JWT tokens
- Role-based access control

### Advertiser Features
- Campaign creation and management
- Offer creation and management
- Performance analytics dashboard
- AI creative generation

### Affiliate Features
- Browse and select offers
- Generate tracking links
- Track earnings and conversions
- View payment history

### Tracking
- Postback URL generation
- Conversion tracking
- Earnings reporting

### AI Creative Generation
- Text prompt-based creative generation
- Image and video creative support
- Creative asset management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## Testing

To run tests (when implemented):
```bash
npm test
```

## Deployment

For production deployment, build the frontend:
```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.