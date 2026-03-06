// Simple logger implementation
export default {
  info: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'info',
      message,
      ...meta
    };
    console.log(JSON.stringify(logEntry));
  },
  warn: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'warn',
      message,
      ...meta
    };
    console.warn(JSON.stringify(logEntry));
  },
  error: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: 'error',
      message,
      ...meta
    };
    console.error(JSON.stringify(logEntry));
  }
};
