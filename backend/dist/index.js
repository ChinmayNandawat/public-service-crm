"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const health_1 = require("./routes/health");
const tempAuth_1 = __importDefault(require("./routes/tempAuth"));
const complaints_1 = __importDefault(require("./routes/complaints"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const utility_1 = __importDefault(require("./routes/utility"));
const copilot_1 = __importDefault(require("./routes/copilot"));
const predictions_1 = __importDefault(require("./routes/predictions"));
const socketService_1 = require("./services/socketService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Create HTTP server for Socket.IO
const server = (0, http_1.createServer)(app);
// Initialize Socket.IO
const socketService = (0, socketService_1.initializeSocketService)(server);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', health_1.healthRouter);
app.use('/api', tempAuth_1.default);
app.use('/api/complaints', complaints_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/uploads', uploads_1.default);
app.use('/api/metrics', metrics_1.default);
app.use('/api', utility_1.default);
app.use('/api', copilot_1.default);
app.use('/api', predictions_1.default);
// Public transparency portal (no authentication required)
const transparency_1 = __importDefault(require("./routes/transparency"));
app.use('/api/transparency', transparency_1.default);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Socket.IO initialized for real-time updates`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map