"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const tempAuth_1 = require("../middleware/tempAuth");
const router = (0, express_1.Router)();
// POST /api/uploads/presign - Get presigned upload URL
router.post('/presign', tempAuth_1.tempAuthMiddleware, uploadController_1.getPresignedUploadUrl);
exports.default = router;
//# sourceMappingURL=uploads.js.map