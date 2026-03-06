import { Router } from 'express';
import { tempRegister, tempLogin, tempGetMe } from '../controllers/tempAuthController';
import { tempAuthMiddleware } from '../middleware/tempAuth';

const router = Router();

// POST /api/temp-register - Register a new user (temporary)
router.post('/temp-register', tempRegister);

// POST /api/temp-login - Login user (temporary)
router.post('/temp-login', tempLogin);

// GET /api/temp-me - Get current user (protected, temporary)
router.get('/temp-me', tempAuthMiddleware, tempGetMe);

export default router;
