import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export const initializePrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export interface CreateNotificationData {
  userId: number;
  type: string;
  message: string;
}

export const createNotification = async (data: CreateNotificationData) => {
  try {
    const prisma = initializePrisma();
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        read: false,
      },
    });

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw new Error('Failed to create notification');
  }
};

export const getUserNotifications = async (userId: number) => {
  try {
    const prisma = initializePrisma();
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
  } catch (error) {
    console.error('Get notifications error:', error);
    throw new Error('Failed to get notifications');
  }
};

export const getUnreadCount = async (userId: number) => {
  try {
    const prisma = initializePrisma();
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return count;
  } catch (error) {
    console.error('Get unread count error:', error);
    throw new Error('Failed to get unread count');
  }
};

export const markAsRead = async (notificationId: number) => {
  try {
    const prisma = initializePrisma();
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
  } catch (error) {
    console.error('Mark as read error:', error);
    throw new Error('Failed to mark notification as read');
  }
};

export const notifyUser = async (userId: number, type: string, message: string) => {
  const prisma = initializePrisma();
  await createNotification({ userId, type, message });
  console.log(`Notification created for user ${userId}: ${type} - ${message}`);
};

export const notifyAdmins = async (message: string) => {
  try {
    const prisma = initializePrisma();
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
    });

    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: 'system',
        message,
      });
    }

    console.log(`Admin notification sent to ${admins.length} admins: ${message}`);
  } catch (error) {
    console.error('Notify admins error:', error);
    throw new Error('Failed to notify admins');
  }
};
