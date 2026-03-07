"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utilityController_1 = require("../controllers/utilityController");
const router = (0, express_1.Router)();
// GET /api/wards - Get all wards
router.get('/wards', utilityController_1.getWards);
// GET /api/departments - Get all departments
router.get('/departments', utilityController_1.getDepartments);
// GET /api/officers - Get all officers
router.get('/officers', utilityController_1.getOfficers);
exports.default = router;
//# sourceMappingURL=utility.js.map