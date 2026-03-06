# Smart Public Service CRM

A comprehensive CRM system for managing public service complaints and requests with intelligent duplicate detection, file uploads, and monitoring.

## 🚀 Quick Start

### 1. **Clone and navigate to project:**
```bash
cd smart-public-service-crm
```

### 2. **Start all services with Docker Compose:**
```bash
docker compose up --build
```

### 3. **Access the applications:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Database**: localhost:5433 (PostgreSQL)
- **Redis**: localhost:6379

## 📋 Available Endpoints

### Backend
- `GET /api/health` - Health check endpoint
- `POST /api/temp-register` - Register new user
- `POST /api/temp-login` - User login
- `GET /api/temp-me` - Get current user
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints` - List complaints (with pagination)
- `GET /api/complaints/:id` - Get complaint by ID
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint
- `POST /api/uploads/presign` - Get presigned upload URL
- `GET /api/metrics` - Prometheus metrics

### Frontend Pages
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/submit-complaint` - Submit new complaint
- `/my-complaints` - View user's complaints
- `/admin` - Admin dashboard
- `/officer` - Officer dashboard

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/civiccrm
JWT_SECRET=your-jwt-secret-here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
JWT_EXPIRES_IN=7d

# AI Service Configuration
AI_SERVICE_URL=http://localhost:5002
AI_SERVICE_API_KEY=your-ai-service-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@smartcrm.com

# AWS S3 Configuration
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET=smart-crm-uploads

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key

# Sentry Configuration
SENTRY_DSN=your-sentry-dsn
```

📖 **See complete environment documentation**: [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)

## 🛠️ Technology Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL 15
- Redis 7
- Winston (logging)
- Prometheus (metrics)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Infrastructure
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Render/Railway (deployment)

## 🗄️ Database Setup

### Migration Files
The migration files are committed to the repository in `backend/prisma/migrations/`. These files contain the database schema changes and are version-controlled.

### 1. Run Migrations
```bash
cd backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/civiccrm" npx prisma migrate dev --name init
```

### 2. Generate Prisma Client
```bash
cd backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/civiccrm" npx prisma generate
```

### 3. Seed Database (Optional)
```bash
# Option A: Using SQL seed (recommended)
cd backend
PGPASSWORD=postgres psql -h localhost -p 5433 -U postgres -d civiccrm -f prisma/seed.sql

# Option B: Using JavaScript seed (requires Prisma client generation)
cd backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/civiccrm" node prisma/seed.js
```

### Default Login Credentials
- **Admin**: admin@civiccrm.gov / admin123
- **Officer**: officer@civiccrm.gov / officer123  
- **Citizen**: citizen@example.com / citizen123

## 🏗️ Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Database Management
```bash
cd backend
npx prisma studio  # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma migrate dev  # Run database migrations
```

## 📁 Project Structure

```
smart-public-service-crm/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── index.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .env
├── README.md
├── ENVIRONMENT_VARIABLES.md
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy.yml
```

## 🚀 Production Deployment

### Prerequisites
- Docker installed and running
- GitHub repository access
- Deployment platform account (Render/Railway)
- Environment variables configured

### Automated Deployment (GitHub Actions)

The project includes automated CI/CD pipelines that:

1. **Run tests** on every push
2. **Build Docker images** for backend and frontend
3. **Deploy to staging** on develop branch
4. **Deploy to production** on main branch
5. **Health checks** after deployment

### Manual Deployment

#### Using Render

1. **Connect your GitHub repository** to Render
2. **Configure environment variables** in Render dashboard
3. **Deploy services** using the provided Docker images

#### Using Railway

1. **Install Railway CLI**
2. **Login and deploy** using railway commands

### Environment-Specific Configuration

- **Development**: Local development with Docker Compose
- **Staging**: Pre-production environment for testing
- **Production**: Live environment with full monitoring

## 📊 Monitoring & Observability

### Health Checks
- Backend health endpoint: `/api/health`
- Frontend availability monitoring
- Database connection monitoring

### Metrics
- Prometheus metrics endpoint: `/api/metrics`
- Custom business metrics tracked
- Performance monitoring with Sentry

### Logging
- Structured JSON logging with Winston
- Multiple log levels (info, warn, error)
- Production error tracking with Sentry

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (citizen, officer, admin)
- CORS protection
- Input validation and sanitization
- Secure file uploads with S3 presigned URLs

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage
- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Verify database is running
   - Check network connectivity

2. **CORS Errors**
   - Verify `CORS_ORIGIN` includes your frontend URL
   - Check preflight requests in browser

3. **Authentication Failures**
   - Verify `JWT_SECRET` is set
   - Check token expiration settings

4. **File Upload Issues**
   - Verify AWS credentials
   - Check S3 bucket permissions
   - Verify endpoint URLs

### Support

For issues with setup or deployment:

1. Check [environment documentation](ENVIRONMENT_VARIABLES.md)
2. Review GitHub Actions workflow logs
3. Check application logs
4. Contact the development team

## 📞 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests locally
5. Submit a pull request
6. Ensure CI/CD pipeline passes

## 📄 License

This project is licensed under the MIT License.

---

*For detailed environment variable documentation, see [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)*
