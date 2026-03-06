import { Router } from 'express';
import { getPrometheusMetrics } from '../services/monitoringService';

const router = Router();

// GET /metrics - Prometheus metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await getPrometheusMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).send('Internal server error');
  }
});

export default router;
