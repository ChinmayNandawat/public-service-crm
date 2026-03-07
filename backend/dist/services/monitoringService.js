"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrometheusMetrics = exports.getMetrics = exports.incrementErrorRate = exports.incrementTotalRequests = exports.setActiveSLAJobs = exports.incrementComplaintsResolved = exports.incrementComplaintsCreated = void 0;
// Simple monitoring service implementation
let metrics = {
    totalComplaints: 0,
    resolvedComplaints: 0,
    activeSLAJobs: 0,
    averageResolutionTime: 0,
    totalRequests: 0,
    errorRate: 0
};
const incrementComplaintsCreated = () => {
    metrics.totalComplaints++;
};
exports.incrementComplaintsCreated = incrementComplaintsCreated;
const incrementComplaintsResolved = (resolutionTimeSeconds) => {
    metrics.resolvedComplaints++;
    // Update average resolution time
    const totalTime = metrics.averageResolutionTime * (metrics.resolvedComplaints - 1) + resolutionTimeSeconds;
    metrics.averageResolutionTime = totalTime / metrics.resolvedComplaints;
};
exports.incrementComplaintsResolved = incrementComplaintsResolved;
const setActiveSLAJobs = (count) => {
    metrics.activeSLAJobs = count;
};
exports.setActiveSLAJobs = setActiveSLAJobs;
const incrementTotalRequests = () => {
    metrics.totalRequests++;
};
exports.incrementTotalRequests = incrementTotalRequests;
const incrementErrorRate = () => {
    metrics.errorRate = (metrics.errorRate + 1) / 60; // Rolling 1-minute average
};
exports.incrementErrorRate = incrementErrorRate;
const getMetrics = () => {
    return {
        totalComplaints: metrics.totalComplaints,
        resolvedComplaints: metrics.resolvedComplaints,
        activeSLAJobs: metrics.activeSLAJobs,
        averageResolutionTime: metrics.averageResolutionTime,
        totalRequests: metrics.totalRequests,
        errorRate: metrics.errorRate
    };
};
exports.getMetrics = getMetrics;
const getPrometheusMetrics = async () => {
    const metricsData = (0, exports.getMetrics)();
    return `# HELP
complaints_created_total Total number of complaints created
complaints_resolved_total Total number of complaints resolved
sla_jobs_active Number of active SLA jobs
complaint_resolution_time_seconds Average time to resolve complaints in seconds
http_requests_total Total number of HTTP requests
error_rate Error rate (errors per second)

# TYPE
complaints_created_total counter
complaints_resolved_total counter
sla_jobs_active gauge
complaint_resolution_time_seconds gauge
http_requests_total counter
error_rate gauge

# METRICS
complaints_created_total ${metricsData.totalComplaints}
complaints_resolved_total ${metricsData.resolvedComplaints}
sla_jobs_active ${metricsData.activeSLAJobs}
complaint_resolution_time_seconds ${metricsData.averageResolutionTime}
http_requests_total ${metricsData.totalRequests}
error_rate ${metricsData.errorRate}
`;
};
exports.getPrometheusMetrics = getPrometheusMetrics;
//# sourceMappingURL=monitoringService.js.map