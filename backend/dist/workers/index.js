"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullSLAWorker_1 = require("./bullSLAWorker");
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
exports.default = bullSLAWorker_1.bullSLAWorker;
//# sourceMappingURL=index.js.map