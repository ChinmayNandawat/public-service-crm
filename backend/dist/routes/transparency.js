"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transparencyController_1 = require("../controllers/transparencyController");
const router = (0, express_1.Router)();
// Get transparency data (public endpoint - no auth required)
router.get('/', transparencyController_1.getTransparencyData);
// Export transparency data as CSV (public endpoint - no auth required)
router.get('/csv', transparencyController_1.getTransparencyCSV);
exports.default = router;
//# sourceMappingURL=transparency.js.map