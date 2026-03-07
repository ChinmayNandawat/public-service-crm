"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaintController_1 = require("../controllers/complaintController");
const tempAuth_1 = require("../middleware/tempAuth");
const router = (0, express_1.Router)();
// POST /api/complaints - Create complaint (citizens only)
router.post('/', tempAuth_1.tempAuthMiddleware, (0, tempAuth_1.roleMiddleware)(['citizen']), complaintController_1.createComplaint);
// GET /api/complaints - Get complaints with role-based filtering
router.get('/', tempAuth_1.tempAuthMiddleware, (0, tempAuth_1.roleMiddleware)(['citizen', 'officer', 'admin']), complaintController_1.getComplaints);
// GET /api/complaints/:id - Get complaint by ID
router.get('/:id', tempAuth_1.tempAuthMiddleware, (0, tempAuth_1.roleMiddleware)(['citizen', 'officer', 'admin']), complaintController_1.getComplaintById);
// PUT /api/complaints/:id - Update complaint (officers and admins)
router.put('/:id', tempAuth_1.tempAuthMiddleware, (0, tempAuth_1.roleMiddleware)(['officer', 'admin']), complaintController_1.updateComplaint);
// DELETE /api/complaints/:id - Soft delete complaint (admins only)
router.delete('/:id', tempAuth_1.tempAuthMiddleware, (0, tempAuth_1.roleMiddleware)(['admin']), complaintController_1.deleteComplaint);
// POST /api/dev/sla-trigger/:complaintId - Manual SLA trigger for testing
router.post('/dev/sla-trigger/:complaintId', tempAuth_1.tempAuthMiddleware, (0, tempAuth_1.roleMiddleware)(['admin']), complaintController_1.triggerSLAEscalation);
exports.default = router;
//# sourceMappingURL=complaints.js.map