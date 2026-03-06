import { Request, Response } from 'express';
import { 
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  notifyUser,
  notifyAdmins
} from '../services/notificationService';

export const getNotifications = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const notifications = await getUserNotifications(userId);

    res.json({
      message: 'Notifications retrieved successfully.',
      notifications,
      unreadCount: await getUnreadCount(userId),
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getUnreadNotifications = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const notifications = await getUserNotifications(userId);

    res.json({
      message: 'Unread notifications retrieved successfully.',
      notifications,
    });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const markNotificationAsRead = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const notificationId = parseInt(id);
    const userId = req.user.id;

    const notification = await markAsRead(notificationId);

    res.json({
      message: 'Notification marked as read.',
      notification,
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const createNotificationController = async (req: any, res: Response) => {
  try {
    const { userId, type, message } = req.body;
    const userIdFromToken = req.user.id;

    // Users can only create notifications for themselves
    if (userId !== userIdFromToken) {
      return res.status(403).json({ error: 'Cannot create notifications for other users.' });
    }

    const notification = await createNotification({ userId, type, message });

    res.status(201).json({
      message: 'Notification created successfully.',
      notification,
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
