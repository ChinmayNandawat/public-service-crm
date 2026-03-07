"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadComplaintsData = exports.getPredictions = void 0;
const predictionService_1 = require("../services/predictionService");
// Middleware to load complaints data
const loadComplaintsData = (req, res, next) => {
    try {
        // Load complaints from persistent storage
        const fs = require('fs');
        const path = require('path');
        const dataFile = path.join(__dirname, '../../data/complaints.json');
        if (fs.existsSync(dataFile)) {
            const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            req.complaints = data.complaints || [];
        }
        else {
            req.complaints = [];
        }
        next();
    }
    catch (error) {
        console.error('Error loading complaints data:', error);
        req.complaints = [];
        next();
    }
};
exports.loadComplaintsData = loadComplaintsData;
// Get predictions for next N days
const getPredictions = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const groupBy = req.query.groupBy || 'ward';
        // Validate inputs
        if (days < 1 || days > 30) {
            return res.status(400).json({
                error: 'Days parameter must be between 1 and 30'
            });
        }
        if (!['ward', 'department'].includes(groupBy)) {
            return res.status(400).json({
                error: 'GroupBy parameter must be either "ward" or "department"'
            });
        }
        // Get complaints data
        const complaints = req.complaints || [];
        // Generate predictions
        const predictions = await (0, predictionService_1.predictComplaints)(complaints, {
            periodDays: days,
            groupBy: groupBy
        });
        // Return response with metadata
        res.json({
            predictions,
            metadata: {
                periodDays: days,
                groupBy,
                totalComplaints: complaints.length,
                generatedAt: new Date().toISOString(),
                algorithm: 'rolling_average_linear_trend'
            }
        });
    }
    catch (error) {
        console.error('Prediction generation error:', error);
        res.status(500).json({
            error: 'Failed to generate predictions. Please try again later.'
        });
    }
};
exports.getPredictions = getPredictions;
//# sourceMappingURL=predictionController.js.map