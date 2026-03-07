"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = exports.router = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Fix the export name
exports.healthRouter = router;
exports.router = exports.healthRouter;
//# sourceMappingURL=health.js.map