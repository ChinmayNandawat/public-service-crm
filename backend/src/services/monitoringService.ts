// Simple monitoring service implementation
let metrics = {
  totalComplaints: 0,
  resolvedComplaints: 0,
  activeSLAJobs: 0,
  averageResolutionTime: 0,
  totalRequests: 0,
  errorRate: 0
};

export const incrementComplaintsCreated = () => {
  metrics.totalComplaints++;
};

export const incrementComplaintsResolved = (resolutionTimeSeconds: number) => {
  metrics.resolvedComplaints++;
  
  // Update average resolution time
  const totalTime = metrics.averageResolutionTime * (metrics.resolvedComplaints - 1) + resolutionTimeSeconds;
  metrics.averageResolutionTime = totalTime / metrics.resolvedComplaints;
};

export const setActiveSLAJobs = (count: number) => {
  metrics.activeSLAJobs = count;
};

export const incrementTotalRequests = () => {
  metrics.totalRequests++;
};

export const incrementErrorRate = () => {
  metrics.errorRate = (metrics.errorRate + 1) / 60; // Rolling 1-minute average
};

export const getMetrics = () => {
  return {
    totalComplaints: metrics.totalComplaints,
    resolvedComplaints: metrics.resolvedComplaints,
    activeSLAJobs: metrics.activeSLAJobs,
    averageResolutionTime: metrics.averageResolutionTime,
    totalRequests: metrics.totalRequests,
    errorRate: metrics.errorRate
  };
};

export const getPrometheusMetrics = async () => {
  const metricsData = getMetrics();
  
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
