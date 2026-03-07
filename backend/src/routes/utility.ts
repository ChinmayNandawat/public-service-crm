import { Router } from 'express';
import { getWards, getDepartments, getOfficers } from '../controllers/utilityController';

const router = Router();

// GET /api/wards - Get all wards
router.get('/wards', getWards);

// GET /api/departments - Get all departments
router.get('/departments', getDepartments);

// GET /api/officers - Get all officers
router.get('/officers', getOfficers);
export default router;
