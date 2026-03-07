"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const predictionController_1 = require("../controllers/predictionController");
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
// GET /api/admin/predictions - Get complaint predictions
router.get('/admin/predictions', requireAdmin, predictionController_1.loadComplaintsData, predictionController_1.getPredictions);
exports.default = router;
//# sourceMappingURL=predictions.js.map