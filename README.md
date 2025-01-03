# Calendar Application for Communication Tracking

A React-based calendar application that enables efficient tracking of company communications, ensuring timely follow-ups and consistent engagement with organizations.

## Features

### Admin Module
- Company Management (CRUD operations)
- Communication Method Configuration
- User Management

### User Module
- Interactive Dashboard with color-coded highlights
- Communication logging and tracking
- Calendar view for past and upcoming communications
- Real-time notifications for due and overdue communications

### Analytics Module
- Communication frequency analysis
- Engagement effectiveness metrics
- Overdue communication trends
- Exportable reports (PDF/CSV)
- Real-time activity logging

## Tech Stack

### Frontend
- React
- TypeScript
- Redux (for state management)
- Tailwind CSS (for styling)

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Redis (for caching)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calendar-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create `.env` files in both frontend and backend directories:

Backend `.env`:
```
PORT=4010
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
```

Frontend `.env`:
```
REACT_APP_API_URL=http://localhost:4010
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

### Production Mode

1. Build and start the backend:
```bash
cd backend
npm run build
npm start
```

2. Build and serve the frontend:
```bash
cd frontend
npm run build
```

## Project Structure

```
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── services
│   │   ├── repositories
│   │   ├── routes
│   │   ├── utils
│   │   └── app.ts
│   └── package.json
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── services
    │   ├── store
    │   └── utils
    └── package.json
```

API Routes
Base Route

GET /api/v1/: Hello World endpoint
GET /api/v1/health: Health check endpoint
GET /api/v1/country: Get country information

Authentication

POST /api/v1/auth/login: User login
POST /api/v1/auth/login/user: Admin login
POST /api/v1/auth/signup: User registration
GET /api/v1/auth/profile: Get user profile (Protected)

Companies

GET /api/v1/company/companies: Get all companies (Protected)
GET /api/v1/company/companies/:_id: Get company by ID (Protected)
POST /api/v1/company/companies: Create new company (Protected)
PUT /api/v1/company/companies/:_id: Update company (Protected)
DELETE /api/v1/company/companies/:_id: Delete company (Protected)
PATCH /api/v1/company/companies/:_id/highlight: Toggle company highlight (Protected)

Communications
Methods

GET /api/v1/communication/communication-methods: Get all communication methods (Protected)
POST /api/v1/communication/communication-methods: Create new method (Protected)
PUT /api/v1/communication/communication-methods/:_id: Update method (Protected)
PATCH /api/v1/communication/communication-methods/:_id/sequence: Update method sequence (Protected)

Records

POST /api/v1/communication/communication-records: Create new communication record (Protected)
GET /api/v1/communication/communication-records/company/:id: Get company communications (Protected)
GET /api/v1/communication/communication-records/latest: Get latest communications (Protected)
GET /api/v1/communication/communication-records/overdue: Get overdue communications (Protected)
GET /api/v1/communication/communication-records/today: Get today's communications (Protected)

Schedule

GET /api/v1/schedule/schedule: Get schedule (Protected)
POST /api/v1/schedule/schedule: Create scheduled communication (Protected)
PUT /api/v1/schedule/schedule/:_id: Update scheduled communication (Protected)
DELETE /api/v1/schedule/schedule/:_id: Delete scheduled communication (Protected)

Analytics

GET /api/v1/analytics/analytics/communication-frequency: Get communication frequency (Protected)
GET /api/v1/analytics/analytics/effectiveness-metrics: Get effectiveness metrics (Protected)
GET /api/v1/analytics/analytics/overdue-trends: Get overdue trends (Protected)
GET /api/v1/analytics/analytics/activity-log: Get activity log (Protected)
GET /api/v1/analytics/analytics/export-reports: Export reports (Protected)

## Architecture

The application follows a layered architecture:
- Routes → Controllers → Services → Repositories
- Built with TypeScript for better type safety and maintainability
- Uses Redis for caching frequently accessed data
- Implements clustering for better performance in production

## Performance Optimizations

1. Database indexing for faster queries
2. Redis caching layer
3. Node.js clustering for load distribution
4. Frontend optimizations:
   - Code splitting
   - Lazy loading
   - Memoization of expensive calculations

## Security Measures

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- Secure HTTP headers

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
