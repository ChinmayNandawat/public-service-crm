import { Response } from 'express';
export declare const getNotifications: (req: any, res: Response) => Promise<void>;
export declare const getUnreadNotifications: (req: any, res: Response) => Promise<void>;
export declare const markNotificationAsRead: (req: any, res: Response) => Promise<void>;
export declare const createNotificationController: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=notificationController.d.ts.map