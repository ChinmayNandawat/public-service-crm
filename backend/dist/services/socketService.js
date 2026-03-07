"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketService = exports.initializeSocketService = exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
class SocketService {
    constructor(httpServer) {
        this.users = new Map();
        this.prisma = new client_1.PrismaClient();
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true
            },
            transports: ['websocket', 'polling']
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    setupMiddleware() {
        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    return next(new Error('Authentication token required'));
                }
                // Verify JWT token
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                // Get user from database
                const user = await this.prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                });
                if (!user) {
                    return next(new Error('User not found'));
                }
                // If user is an officer, get additional details
                let wardId, departmentId;
                if (user.role === 'officer') {
                    const officer = await this.prisma.officer.findUnique({
                        where: { userId: user.id },
                        select: { wardId: true, departmentId: true }
                    });
                    wardId = officer?.wardId;
                    departmentId = officer?.departmentId;
                }
                socket.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    wardId,
                    departmentId
                };
                next();
            }
            catch (error) {
                console.error('Socket authentication error:', error);
                next(new Error('Invalid authentication token'));
            }
        });
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.user?.email} (${socket.user?.role})`);
            // Store user connection
            if (socket.user) {
                this.users.set(socket.user.id.toString(), {
                    socketId: socket.id,
                    user: socket.user
                });
            }
            // Join role-based rooms
            this.joinUserRooms(socket);
            // Handle disconnect
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.user?.email}`);
                if (socket.user) {
                    this.users.delete(socket.user.id.toString());
                }
            });
            // Handle joining specific rooms
            socket.on('join-room', (room) => {
                socket.join(room);
                console.log(`User ${socket.user?.email} joined room: ${room}`);
            });
            // Handle leaving rooms
            socket.on('leave-room', (room) => {
                socket.leave(room);
                console.log(`User ${socket.user?.email} left room: ${room}`);
            });
        });
    }
    joinUserRooms(socket) {
        if (!socket.user)
            return;
        // Join role-based room
        socket.join(`role:${socket.user.role}`);
        // Join officer-specific room if officer
        if (socket.user.role === 'officer') {
            socket.join(`officer:${socket.user.id}`);
        }
        // Join ward-specific room if user has ward
        if (socket.user.wardId) {
            socket.join(`ward:${socket.user.wardId}`);
        }
        // Join department-specific room if user has department
        if (socket.user.departmentId) {
            socket.join(`department:${socket.user.departmentId}`);
        }
        console.log(`User ${socket.user.email} joined rooms: role:${socket.user.role}${socket.user.role === 'officer' ? `, officer:${socket.user.id}` : ''}${socket.user.wardId ? `, ward:${socket.user.wardId}` : ''}${socket.user.departmentId ? `, department:${socket.user.departmentId}` : ''}`);
    }
    // Emit complaint created event
    emitComplaintCreated(complaint) {
        this.io.to('role:admin').emit('complaint.created', {
            complaint,
            timestamp: new Date().toISOString()
        });
        // Also emit to ward room if ward is specified
        if (complaint.wardId) {
            this.io.to(`ward:${complaint.wardId}`).emit('complaint.created', {
                complaint,
                timestamp: new Date().toISOString()
            });
        }
    }
    // Emit complaint assigned event
    emitComplaintAssigned(complaint, officerId) {
        const eventData = {
            complaint,
            officerId,
            timestamp: new Date().toISOString()
        };
        // Emit to specific officer
        this.io.to(`officer:${officerId}`).emit('complaint.assigned', eventData);
        // Also emit to admins
        this.io.to('role:admin').emit('complaint.assigned', eventData);
    }
    // Emit complaint status updated event
    emitComplaintStatusUpdated(complaint, oldStatus, newStatus) {
        const eventData = {
            complaint,
            oldStatus,
            newStatus,
            timestamp: new Date().toISOString()
        };
        // Emit to admins
        this.io.to('role:admin').emit('complaint.status_updated', eventData);
        // Emit to assigned officer if exists
        if (complaint.assignedOfficer) {
            this.io.to(`officer:${complaint.assignedOfficer}`).emit('complaint.status_updated', eventData);
        }
        // Emit to ward room
        if (complaint.wardId) {
            this.io.to(`ward:${complaint.wardId}`).emit('complaint.status_updated', eventData);
        }
    }
    // Emit complaint escalated event
    emitComplaintEscalated(complaint, escalationReason) {
        const eventData = {
            complaint,
            escalationReason,
            timestamp: new Date().toISOString()
        };
        // Emit to all admins
        this.io.to('role:admin').emit('complaint.escalated', eventData);
        // Emit to assigned officer
        if (complaint.assignedOfficer) {
            this.io.to(`officer:${complaint.assignedOfficer}`).emit('complaint.escalated', eventData);
        }
    }
    // Emit complaint resolved event
    emitComplaintResolved(complaint) {
        const eventData = {
            complaint,
            timestamp: new Date().toISOString()
        };
        // Emit to admins
        this.io.to('role:admin').emit('complaint.resolved', eventData);
        // Emit to assigned officer
        if (complaint.assignedOfficer) {
            this.io.to(`officer:${complaint.assignedOfficer}`).emit('complaint.resolved', eventData);
        }
        // Emit to ward room
        if (complaint.wardId) {
            this.io.to(`ward:${complaint.wardId}`).emit('complaint.resolved', eventData);
        }
    }
    // Get connected users count by role
    getConnectedUsersByRole() {
        const roleCounts = {};
        this.users.forEach(({ user }) => {
            if (user) {
                roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
            }
        });
        return roleCounts;
    }
    // Get socket instance for external use
    getIO() {
        return this.io;
    }
    // Check if user is online
    isUserOnline(userId) {
        return this.users.has(userId.toString());
    }
    // Get user's socket ID
    getUserSocketId(userId) {
        const userConnection = this.users.get(userId.toString());
        return userConnection ? userConnection.socketId : null;
    }
}
exports.SocketService = SocketService;
// Singleton instance
let socketService;
const initializeSocketService = (httpServer) => {
    if (!socketService) {
        socketService = new SocketService(httpServer);
    }
    return socketService;
};
exports.initializeSocketService = initializeSocketService;
const getSocketService = () => {
    if (!socketService) {
        throw new Error('SocketService not initialized. Call initializeSocketService first.');
    }
    return socketService;
};
exports.getSocketService = getSocketService;
//# sourceMappingURL=socketService.js.map