# Smart Public Service CRM

[![Node](https://img.shields.io/badge/node-18-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18-blue)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)
[![Docker](https://img.shields.io/badge/docker-enabled-blue)](https://www.docker.com/)

**Smart Public Service CRM** is an AI-powered civic complaint management platform designed to streamline public grievance redressal. It enables citizens to submit issues efficiently, empowers officers with tools to manage and resolve requests, and provides administrators with predictive insights and public transparency—supported by real-time updates, automated SLA escalation, and an AI governance copilot.

---

## Table of Contents
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Docker Setup](#docker-setup)
  - [Local Development Setup](#local-development-setup)
- [`environment Variables](#`environment-variables)
- [Monitoring & Observability](#monitoring--observability)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Problem Statement
Municipal complaint systems are often fragmented, slow, and opaque. Citizens file issues but rarely receive timely updates; officers struggle to prioritize and route tickets effectively; and administrators lack the clear, actionable analytics required for systemic improvements.

## Solution Overview
Smart Public Service CRM bridges this gap by providing:
- Intelligent complaint classification and priority scoring via AI.
- Real-time dashboards for officers and administrators using Socket.IO.
- Automated SLA monitoring and escalation workflows powered by Redis and BullMQ.
- Secure client-side attachment uploads through S3/MinIO presigned URLs.
- A public transparency portal and an AI Copilot for deep governance insights.

## Key Features
- **AI Complaint Classification**: Automatically categorizes incoming complaints by topic, urgency, and sentiment.
- **Priority Scoring Engine**: Computes normalized priority scores combining urgency, sentiment, and location sensitivity.
- **SLA Escalation Automation**: Background workers monitor resolution deadlines and trigger escalations automatically.
- **Real-Time Dashboards**: Instant updates pushed to admin and officer portals via WebSockets.
- **Interactive Civic Heatmap**: Geo-visualization of regional complaints utilizing Leaflet and clustering.
- **AI Governance Copilot**: Natural-language query interface for administrators to analyze trends and receive data-driven recommendations.
- **Duplicate Detection**: Embedding-based similarity engine to surface existing related complaints during submission.
- **Secure File Uploads**: Direct-to-storage uploads via S3/MinIO presigned URLs.
- **Progressive Web App (PWA)**: Installable frontend with offline draft capabilities.
- **Predictive Analytics**: Forecasting module for anticipated complaint surges and SLA breach risks.
- **Public Transparency Portal**: Aggregated, anonymized public metrics with CSV export functionality.

## Architecture
The system utilizes a modern, decoupled architecture:
- **Frontend**: React + Vite (PWA-enabled), TailwindCSS, Leaflet.
- **Backend API**: Node.js, Express, TypeScript, Prisma ORM.
- **Data & Storage**: PostgreSQL (relational data), Redis (caching and queues), S3/MinIO (object storage).
- **Realtime / Workers**: Socket.IO for event streaming, BullMQ for background job processing.
- **AI Layer**: Integrates LLMs and embeddings for classification, copilot analysis, and duplicate detection.

*(Insert architecture diagram here: ![System Architecture](docs/architecture.png))*

## Getting Started

### Docker Setup (Recommended)
To run the entire stack (Frontend, Backend, PostgreSQL, Redis, MinIO) locally:

`ash
git clone <repository-url>
cd smart-public-service-crm
docker compose up --build


### Local Development Setup
Prerequisites: Node.js (v18+), npm/pnpm/yarn, and Docker (for backend services).

1. **Start infrastructure services:**
   `ash
   docker compose up postgres redis minio -d
   

2. **Setup Backend:**
   `ash
   cd backend
   npm install
   npx prisma migrate dev --name init
   npx prisma generate
   # Optional: Seed the database
   npm run seed:demo 
   npm run dev
   

3. **Setup Frontend:**
   `ash
   cd frontend
   npm install
   npm run dev
   

## `environment Variables
Copy the provided .`env.example in both rontend and ackend directories and configure the values appropriately. 

**Backend .`env example:**
`env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/civiccrm"
PORT=5001
NODE_`env="development"
CORS_ORIGIN="http://localhost:5173"
JWT_SECRET="your_secure_jwt_secret"
GEMINI_API_KEY="your_api_key_here"
REDIS_URL="redis://localhost:6379"


## Monitoring & Observability
- **Metrics**: Exposes standard Prometheus metrics via the /api/metrics endpoint.
- **Error Tracking**: Configurable Sentry integration for runtime exception capturing.
- **Logging**: Structured JSON logging powered by Winston.

## Deployment
Ready out-of-the-box for containerized PaaS or standard cloud hosting (e.g., Render, Vercel, AWS):
1. Deploy the PostgreSQL database (e.g., Neon, Supabase, RDS).
2. Deploy the Redis datastore (e.g., Upstash, ElastiCache).
3. Deploy the compiled Express backend to a Node.js-compatible `environment.
4. Deploy the Vite React frontend to a static host (e.g., Vercel, Netlify).

## Contributing
We welcome contributions to the Smart Public Service CRM! 
1. Fork the repository.
2. Create a feature branch (git checkout -b feature/your-feature).
3. Commit your changes.
4. Push to the branch and open a Pull Request.

## License
This system is open-sourced under the [MIT License](./LICENSE).

## Contact
For technical queries or live demonstration requests:
- Email: abhnish.1289@gmail.com
- Email: dev24.chinmay@gmail.com
