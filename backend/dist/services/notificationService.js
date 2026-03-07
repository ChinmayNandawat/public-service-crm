"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAdmins = exports.notifyUser = exports.markAsRead = exports.getUnreadCount = exports.getUserNotifications = exports.createNotification = exports.initializePrisma = void 0;
const client_1 = require("@prisma/client");
let prisma;
const initializePrisma = () => {
    if (!prisma) {
        prisma = new client_1.PrismaClient();
    }
    return prisma;
};
exports.initializePrisma = initializePrisma;
const createNotification = async (data) => {
    try {
        const prisma = (0, exports.initializePrisma)();
        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                message: data.message,
                read: false,
            },
        });
        return notification;
    }
    catch (error) {
        console.error('Create notification error:', error);
        throw new Error('Failed to create notification');
    }
};
exports.createNotification = createNotification;
const getUserNotifications = async (userId) => {
    try {
        const prisma = (0, exports.initializePrisma)();
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                read: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return notifications;
    }
    catch (error) {
        console.error('Get notifications error:', error);
        throw new Error('Failed to get notifications');
    }
};
exports.getUserNotifications = getUserNotifications;
const getUnreadCount = async (userId) => {
    try {
        const prisma = (0, exports.initializePrisma)();
        const count = await prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
        return count;
    }
    catch (error) {
        console.error('Get unread count error:', error);
        throw new Error('Failed to get unread count');
    }
};
exports.getUnreadCount = getUnreadCount;
const markAsRead = async (notificationId) => {
    try {
        const prisma = (0, exports.initializePrisma)();
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new Error('Notification not found');
        }
        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
        return notification;
    }
    catch (error) {
        console.error('Mark as read error:', error);
        throw new Error('Failed to mark notification as read');
    }
};
exports.markAsRead = markAsRead;
const notifyUser = async (userId, type, message) => {
    const prisma = (0, exports.initializePrisma)();
    await (0, exports.createNotification)({ userId, type, message });
    console.log(`Notification created for user ${userId}: ${type} - ${message}`);
};
exports.notifyUser = notifyUser;
const notifyAdmins = async (message) => {
    try {
        const prisma = (0, exports.initializePrisma)();
        const admins = await prisma.user.findMany({
            where: { role: 'admin' },
        });
        for (const admin of admins) {
            await (0, exports.createNotification)({
                userId: admin.id,
                type: 'system',
                message,
            });
        }
        console.log(`Admin notification sent to ${admins.length} admins: ${message}`);
    }
    catch (error) {
        console.error('Notify admins error:', error);
        throw new Error('Failed to notify admins');
    }
};
exports.notifyAdmins = notifyAdmins;
//# sourceMappingURL=notificationService.js.map