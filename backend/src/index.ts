import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import tempAuthRouter from './routes/tempAuth';
import complaintRouter from './routes/complaints';
import notificationRouter from './routes/notifications';
import uploadRouter from './routes/uploads';
import metricsRouter from './routes/metrics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRouter);
app.use('/api', tempAuthRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/metrics', metricsRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
