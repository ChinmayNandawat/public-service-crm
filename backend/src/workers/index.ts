import { bullSLAWorker } from './bullSLAWorker';

console.log('Starting Bull SLA Worker...');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Bull SLA Worker shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Bull SLA Worker shutting down gracefully...');
  process.exit(0);
});

export default bullSLAWorker;
