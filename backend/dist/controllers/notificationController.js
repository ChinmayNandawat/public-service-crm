"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationController = exports.markNotificationAsRead = exports.getUnreadNotifications = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await (0, notificationService_1.getUserNotifications)(userId);
        res.json({
            message: 'Notifications retrieved successfully.',
            notifications,
            unreadCount: await (0, notificationService_1.getUnreadCount)(userId),
        });
    }
    catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.getNotifications = getNotifications;
const getUnreadNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await (0, notificationService_1.getUserNotifications)(userId);
        res.json({
            message: 'Unread notifications retrieved successfully.',
            notifications,
        });
    }
    catch (error) {
        console.error('Get unread notifications error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.getUnreadNotifications = getUnreadNotifications;
const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notificationId = parseInt(id);
        const userId = req.user.id;
        const notification = await (0, notificationService_1.markAsRead)(notificationId);
        res.json({
            message: 'Notification marked as read.',
            notification,
        });
    }
    catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const createNotificationController = async (req, res) => {
    try {
        const { userId, type, message } = req.body;
        const userIdFromToken = req.user.id;
        // Users can only create notifications for themselves
        if (userId !== userIdFromToken) {
            return res.status(403).json({ error: 'Cannot create notifications for other users.' });
        }
        const notification = await (0, notificationService_1.createNotification)({ userId, type, message });
        res.status(201).json({
            message: 'Notification created successfully.',
            notification,
        });
    }
    catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.createNotificationController = createNotificationController;
//# sourceMappingURL=notificationController.js.map