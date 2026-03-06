import { Router } from 'express';
import { getPresignedUploadUrl } from '../controllers/uploadController';
import { tempAuthMiddleware } from '../middleware/tempAuth';

const router = Router();

// POST /api/uploads/presign - Get presigned upload URL
router.post('/presign', 
  tempAuthMiddleware, 
  getPresignedUploadUrl
);

export default router;
