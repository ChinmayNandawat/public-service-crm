import { Router } from 'express';
import { 
  createComplaint, 
  getComplaints, 
  getComplaintById, 
  updateComplaint, 
  deleteComplaint,
  triggerSLAEscalation 
} from '../controllers/complaintController';
import { tempAuthMiddleware, roleMiddleware } from '../middleware/tempAuth';

const router = Router();

// POST /api/complaints - Create complaint (citizens only)
router.post('/', 
  tempAuthMiddleware, 
  roleMiddleware(['citizen']), 
  createComplaint
);

// GET /api/complaints - Get complaints with role-based filtering
router.get('/', 
  tempAuthMiddleware, 
  roleMiddleware(['citizen', 'officer', 'admin']), 
  getComplaints
);

// GET /api/complaints/:id - Get complaint by ID
router.get('/:id', 
  tempAuthMiddleware, 
  roleMiddleware(['citizen', 'officer', 'admin']), 
  getComplaintById
);

// PUT /api/complaints/:id - Update complaint (officers and admins)
router.put('/:id', 
  tempAuthMiddleware, 
  roleMiddleware(['officer', 'admin']), 
  updateComplaint
);

// DELETE /api/complaints/:id - Soft delete complaint (admins only)
router.delete('/:id', 
  tempAuthMiddleware, 
  roleMiddleware(['admin']), 
  deleteComplaint
);

// POST /api/dev/sla-trigger/:complaintId - Manual SLA trigger for testing
router.post('/dev/sla-trigger/:complaintId', 
  tempAuthMiddleware, 
  roleMiddleware(['admin']), 
  triggerSLAEscalation
);

export default router;
