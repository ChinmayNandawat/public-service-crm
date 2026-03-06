import { Router } from 'express';
import { 
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  createNotificationController
} from '../controllers/notificationController';
import { tempAuthMiddleware } from '../middleware/tempAuth';

const router = Router();

// GET /api/notifications - Get all notifications for authenticated user
router.get('/', 
  tempAuthMiddleware, 
  getNotifications
);

// GET /api/notifications/unread - Get unread notifications
router.get('/unread', 
  tempAuthMiddleware, 
  getUnreadNotifications
);

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', 
  tempAuthMiddleware, 
  markNotificationAsRead
);

// POST /api/notifications - Create notification (for system/internal use)
router.post('/', 
  tempAuthMiddleware, 
  createNotificationController
);

export default router;
