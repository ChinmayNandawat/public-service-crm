# Environment Variables Documentation

This document outlines all environment variables required for running the Smart Public Service CRM in different environments.

## 📋 Table of Contents

- [Required Variables](#required-variables)
- [Application Configuration](#application-configuration)
- [Database Configuration](#database-configuration)
- [Authentication & Security](#authentication--security)
- [Email Configuration](#email-configuration)
- [File Storage Configuration](#file-storage-configuration)
- [AI Services Configuration](#ai-services-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Deployment Variables](#deployment-variables)

---

## Required Variables

These variables must be set in all environments:

| Variable | Description | Default | Required |
|-----------|-------------|---------|----------|
| `NODE_ENV` | Environment (development/staging/production) | `development` | ✅ |
| `PORT` | Server port | `5000` | ✅ |

---

## Application Configuration

| Variable | Description | Default | Example |
|-----------|-------------|---------|-----------|
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` | `https://yourapp.com` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` | `24h` |
| `LOG_LEVEL` | Logging level | `info` | `warn` |

---

## Database Configuration

| Variable | Description | Default | Example |
|-----------|-------------|---------|-----------|
| `DATABASE_URL` | PostgreSQL connection string | - | `postgresql://user:password@host:port/database` |

**Example:**
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/civiccrm
```

---

## Authentication & Security

| Variable | Description | Default | Example |
|-----------|-------------|---------|-----------|
| `JWT_SECRET` | JWT signing secret | - | `your-super-secret-jwt-key-here` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `10` | `12` |

---

## Email Configuration

| Variable | Description | Default | Example |
|-----------|-------------|---------|-----------|
| `SMTP_HOST` | SMTP server host | - | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` | `587` |
| `SMTP_USER` | SMTP username | - | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password | - | `your-app-password` |
| `EMAIL_FROM` | From email address | - | `noreply@yourdomain.com` |

---

## File Storage Configuration

| Variable | Description | Default | Example |
|-----------|-------------|---------|-----------|
| `AWS_ACCESS_KEY` | AWS access key | - | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_KEY` | AWS secret key | - | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region | `us-east-1` | `eu-west-1` |
| `AWS_BUCKET` | S3 bucket name | `smart-crm-uploads` | `your-production-bucket` |
| `AWS_S3_ENDPOINT` | S3 endpoint (MinIO) | - | `http://localhost:9000` |

---

## AI Services Configuration

| Variable | Description | Default | Example |
|-----------|-------------|---------|-----------|
| `AI_SERVICE_URL` | AI service URL | `http://localhost:5002` | `https://ai.yourdomain.com` |
| `AI_SERVICE_API_KEY` | AI service API key | - | `your-ai-service-key` |
| `GEMINI_API_KEY` | Gemini API key | - | `AIzaSy...` |

---

## Monitoring & Logging

| Variable | Description | Default | Example |
|-----------|-------------|---------|-----------|
| `SENTRY_DSN` | Sentry error tracking DSN | - | `https://your-id@sentry.io/project-id` |

---

## Deployment Variables

These variables are used in CI/CD pipelines and production deployments:

### GitHub Actions

| Variable | Description | Example |
|-----------|-------------|---------|-----------|
| `GITHUB_TOKEN` | GitHub token (auto-provided) | - | - |
| `RENDER_API_TOKEN` | Render deployment API token | - | `rnd_xxx...` |

### Production URLs

| Variable | Description | Example |
|-----------|-------------|---------|-----------|
| `PROD_BACKEND_URL` | Production backend URL | - | `https://api.yourapp.com` |
| `PROD_FRONTEND_URL` | Production frontend URL | - | `https://yourapp.com` |
| `STAGING_BACKEND_URL` | Staging backend URL | - | `https://api-staging.yourapp.com` |
| `STAGING_FRONTEND_URL` | Staging frontend URL | - | `https://staging.yourapp.com` |

### Database URLs

| Variable | Description | Example |
|-----------|-------------|---------|-----------|
| `REDIS_URL` | Redis connection string | - | `redis://localhost:6379` |
| `REDIS_PASSWORD` | Redis password | - | `your-redis-password` |

---

## 🚀 Environment Setup

### Development

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your local values
nano .env

# Start services
docker-compose up -d
```

### Staging

```bash
# Set environment to staging
export NODE_ENV=staging
export DATABASE_URL=postgresql://user:pass@staging-db:5432/civiccrm
export API_URL=https://api-staging.yourapp.com

# Deploy to staging
./deploy.sh staging
```

### Production

```bash
# Set environment to production
export NODE_ENV=production
export DATABASE_URL=postgresql://user:pass@prod-db:5432/civiccrm
export API_URL=https://api.yourapp.com

# Deploy to production
./deploy.sh production
```

---

## 🔒 Security Notes

1. **Never commit secrets to version control**
2. **Use environment-specific secrets management**
3. **Rotate secrets regularly**
4. **Use different secrets for different environments**
5. **Enable MFA for all external services**

---

## 📝 Additional Configuration

### Docker Environment Variables

When using Docker, you can pass environment variables:

```bash
docker run -e NODE_ENV=production -e DATABASE_URL=... your-app
```

### Docker Compose

```yaml
services:
  backend:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/civiccrm
      - REDIS_URL=redis://redis:6379
```

---

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

---

## 📞 Support

For issues with environment setup or deployment, please:

1. Check this documentation first
2. Review the error logs
3. Check the GitHub Actions workflow logs
4. Contact the development team

---

*Last updated: $(date)*
