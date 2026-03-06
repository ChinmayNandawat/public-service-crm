import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/register - Register a new user
router.post('/register', register);

// POST /api/login - Login user
router.post('/login', login);

// GET /api/me - Get current user (protected)
router.get('/me', authMiddleware, getMe);

export default router;
