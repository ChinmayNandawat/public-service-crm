"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tempAuthController_1 = require("../controllers/tempAuthController");
const tempAuth_1 = require("../middleware/tempAuth");
const router = (0, express_1.Router)();
// POST /api/temp-register - Register a new user (temporary)
router.post('/temp-register', tempAuthController_1.tempRegister);
// POST /api/temp-login - Login user (temporary)
router.post('/temp-login', tempAuthController_1.tempLogin);
// GET /api/temp-me - Get current user (protected, temporary)
router.get('/temp-me', tempAuth_1.tempAuthMiddleware, tempAuthController_1.tempGetMe);
exports.default = router;
//# sourceMappingURL=tempAuth.js.map