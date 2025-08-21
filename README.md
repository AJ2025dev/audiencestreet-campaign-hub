# TAS Affiliate Management System

Performance marketing platform for advertiser and affiliate management with AI creative generation.

## Overview

The TAS Affiliate Management System is a comprehensive platform that connects advertisers with affiliates, enabling efficient campaign management, tracking, and optimization. The system provides features for advertiser management, affiliate management, campaign tracking, and AI-powered creative generation.

## Key Features

### Advertiser Management
- Campaign creation and management
- Budget allocation and control
- Performance analytics and reporting
- Integration with Meta and Google Ads APIs

### Affiliate Management
- Offer browsing and selection
- Tracking link generation
- Postback configuration
- Earnings tracking and reporting

### Tracking Mechanisms
- Postback URL generation and processing
- Pixel tracking implementation
- Event tracking and conversion measurement
- Real-time analytics dashboard

### AI Creative Generation
- Text-to-image generation using AI
- Text-to-video generation using AI
- Template-based creative creation
- Creative optimization and A/B testing

## Technology Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS with shadcn/ui components
- Vite build tool
- React Router for navigation

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL database
- Redis for caching

### Infrastructure
- Docker for containerization
- GitHub Actions for CI/CD
- AWS/GCP for cloud hosting

## Project Structure

```
tas-affiliate-management-system/
├── backend/
├── frontend/
├── database/
├── docs/
└── scripts/
```

For detailed project structure, see [project-structure.md](project-structure.md).

## Architecture

For detailed system architecture, see [tas-architecture.md](docs/tas-architecture.md).

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/tas-affiliate-management-system.git
cd tas-affiliate-management-system
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up environment variables:
```bash
# Copy example files and update with your values
cp .env.example .env
```

5. Run database migrations:
```bash
# Run migration scripts
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

## Documentation

- [Architecture Design](docs/tas-architecture.md)
- [Detailed Planning](docs/tas-detailed-planning.md)
- [Project Structure](docs/project-structure.md)
- [GitHub Setup Instructions](docs/github-setup-instructions.md)
- [API Documentation](docs/api-docs/)
- [User Guides](docs/user-guides/)

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
