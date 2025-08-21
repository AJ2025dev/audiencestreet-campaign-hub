# TAS Affiliate Management System

Performance marketing platform for advertiser and affiliate management with AI creative generation.

## Overview

The TAS Affiliate Management System is a comprehensive platform that connects advertisers with affiliates, enabling efficient campaign management, tracking, and optimization. The system provides features for advertiser management, affiliate management, campaign tracking, and AI-powered creative generation.

## Current Status

This project is currently in development. The following components have been implemented:

### Backend
- User authentication and authorization system
- Database models for users, advertisers, affiliates, offers, campaigns, creatives, conversions, and postbacks
- RESTful API with JWT authentication
- PostgreSQL database integration with Sequelize ORM

### Frontend
- React application with TypeScript
- Responsive UI components
- Authentication flow (login/register)
- Role-based dashboards (advertiser, affiliate)
- Offers management
- Tracking links management
- AI creative generation interface

## Technology Stack

### Backend
- Node.js with Express.js
- PostgreSQL database
- Sequelize ORM
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

## Project Structure

```
tas-affiliate-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── scripts/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── docs/
├── README.md
└── PROJECT_SUMMARY.md
```

## Getting Started

### Prerequisites
- Node.js 14+
- PostgreSQL database
- npm or yarn
- Git (for version control and deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tas-affiliate-management-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
```bash
# Copy and configure environment files
cp backend/.env.example backend/.env
# Update the .env file with your database credentials and other settings
```

5. Start the development servers:
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in a separate terminal)
cd frontend
npm run dev
```

## Deployment to GitHub

To push this code to your GitHub repository:

1. Make sure you have Git installed on your system
2. Create a new repository on GitHub (https://github.com/new)
3. Run the provided push script:
```bash
chmod +x push-to-github.sh
./push-to-github.sh
```

4. When prompted, enter your GitHub credentials or use a personal access token

## Features

### Authentication
- User registration and login
- Role-based access control (admin, advertiser, affiliate)
- JWT token management

### Advertiser Features
- Create and manage offers
- View affiliate performance
- Track campaign conversions
- Generate AI-powered creatives

### Affiliate Features
- Browse available offers
- Generate tracking links
- View earnings and performance
- Configure postback URLs

### Tracking
- Postback URL generation
- Conversion tracking
- Performance analytics

### AI Creative Generation
- Text-to-image generation
- Creative asset management
- Downloadable creative assets

## API Documentation

The backend API is documented with Swagger. When the backend server is running, you can access the documentation at:
```
http://localhost:3000/api-docs
```

## Database Setup

The project uses PostgreSQL with Sequelize ORM. To set up the database:

1. Create a PostgreSQL database
2. Update the database credentials in `backend/.env`
3. Run the database setup script:
```bash
cd backend
node scripts/setup-db.js
```

## Testing

The project includes both unit and integration tests. To run the tests:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

The project can be deployed to any cloud platform that supports Node.js and PostgreSQL. The following environment variables need to be configured:

- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `PORT` - Server port

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub.