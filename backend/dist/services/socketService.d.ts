import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
export declare class SocketService {
    private io;
    private prisma;
    private users;
    constructor(httpServer: HTTPServer);
    private setupMiddleware;
    private setupEventHandlers;
    private joinUserRooms;
    emitComplaintCreated(complaint: any): void;
    emitComplaintAssigned(complaint: any, officerId: number): void;
    emitComplaintStatusUpdated(complaint: any, oldStatus: string, newStatus: string): void;
    emitComplaintEscalated(complaint: any, escalationReason: string): void;
    emitComplaintResolved(complaint: any): void;
    getConnectedUsersByRole(): {
        [role: string]: number;
    };
    getIO(): SocketIOServer;
    isUserOnline(userId: number): boolean;
    getUserSocketId(userId: number): string | null;
}
export declare const initializeSocketService: (httpServer: HTTPServer) => SocketService;
export declare const getSocketService: () => SocketService;
//# sourceMappingURL=socketService.d.ts.map