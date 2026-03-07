"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const monitoringService_1 = require("../services/monitoringService");
const router = (0, express_1.Router)();
// GET /metrics - Prometheus metrics endpoint
router.get('/metrics', async (req, res) => {
    try {
        const metrics = await (0, monitoringService_1.getPrometheusMetrics)();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
    }
    catch (error) {
        console.error('Metrics error:', error);
        res.status(500).send('Internal server error');
    }
});
exports.default = router;
//# sourceMappingURL=metrics.js.map