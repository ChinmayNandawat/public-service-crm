"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const tempAuth_1 = require("../middleware/tempAuth");
const router = (0, express_1.Router)();
// GET /api/notifications - Get all notifications for authenticated user
router.get('/', tempAuth_1.tempAuthMiddleware, notificationController_1.getNotifications);
// GET /api/notifications/unread - Get unread notifications
router.get('/unread', tempAuth_1.tempAuthMiddleware, notificationController_1.getUnreadNotifications);
// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', tempAuth_1.tempAuthMiddleware, notificationController_1.markNotificationAsRead);
// POST /api/notifications - Create notification (for system/internal use)
router.post('/', tempAuth_1.tempAuthMiddleware, notificationController_1.createNotificationController);
exports.default = router;
//# sourceMappingURL=notifications.js.map