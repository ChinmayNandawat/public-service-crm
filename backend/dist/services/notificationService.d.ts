import { PrismaClient } from '@prisma/client';
export declare const initializePrisma: () => PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export interface CreateNotificationData {
    userId: number;
    type: string;
    message: string;
}
export declare const createNotification: (data: CreateNotificationData) => Promise<{
    id: number;
    userId: number;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
}>;
export declare const getUserNotifications: (userId: number) => Promise<{
    id: number;
    userId: number;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
}[]>;
export declare const getUnreadCount: (userId: number) => Promise<number>;
export declare const markAsRead: (notificationId: number) => Promise<{
    id: number;
    userId: number;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
}>;
export declare const notifyUser: (userId: number, type: string, message: string) => Promise<void>;
export declare const notifyAdmins: (message: string) => Promise<void>;
//# sourceMappingURL=notificationService.d.ts.map