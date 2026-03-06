import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export { healthRouter as router };

// Fix the export name
export const healthRouter = router;
