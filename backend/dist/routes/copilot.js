"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const copilotController_1 = require("../controllers/copilotController");
const router = (0, express_1.Router)();
// Simple auth middleware for temporary auth system
const requireAdmin = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};
// POST /api/admin/copilot - Analyze municipal data with AI copilot
router.post('/admin/copilot', requireAdmin, copilotController_1.loadComplaintsData, copilotController_1.analyzeWithCopilot);
exports.default = router;
//# sourceMappingURL=copilot.js.map