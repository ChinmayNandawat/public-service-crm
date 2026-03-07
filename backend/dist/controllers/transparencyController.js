"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransparencyCSV = exports.getTransparencyData = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
// Cache for transparency data (5 minutes TTL)
const transparencyCache = new node_cache_1.default({ stdTTL: 300 }); // 5 minutes
const getTransparencyData = async (req, res) => {
    try {
        // Check cache first
        const cacheKey = 'transparency-data';
        let data = transparencyCache.get(cacheKey);
        if (!data) {
            // Import complaints data (in real app, this would be from database)
            let complaints = [];
            let wards = [];
            let departments = [];
            try {
                const complaintsData = require('../../data/complaints.json');
                complaints = complaintsData.complaints || [];
            }
            catch (error) {
                console.log('Complaints data not found, using empty array');
            }
            try {
                wards = require('../../data/wards.json');
            }
            catch (error) {
                console.log('Wards data not found, using empty array');
            }
            try {
                departments = require('../../data/departments.json');
            }
            catch (error) {
                console.log('Departments data not found, using empty array');
            }
            // Calculate KPIs
            const totalComplaints = complaints.length;
            const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;
            const resolvedRatio = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0;
            // Calculate average resolution time
            const resolvedWithTime = complaints.filter((c) => c.status === 'resolved' && c.createdAt && c.resolvedAt);
            let avgResolutionTimeHours = 0;
            if (resolvedWithTime.length > 0) {
                const totalTime = resolvedWithTime.reduce((sum, complaint) => {
                    const created = new Date(complaint.createdAt).getTime();
                    const resolved = new Date(complaint.resolvedAt).getTime();
                    return sum + (resolved - created);
                }, 0);
                avgResolutionTimeHours = totalTime / resolvedWithTime.length / (1000 * 60 * 60); // Convert to hours
            }
            // Aggregate by department
            const complaintsByDepartment = {};
            complaints.forEach((complaint) => {
                if (complaint.departmentId) {
                    const dept = departments.find((d) => d.id === complaint.departmentId);
                    const deptName = dept ? dept.name : 'Unknown';
                    complaintsByDepartment[deptName] = (complaintsByDepartment[deptName] || 0) + 1;
                }
            });
            // Convert to array and sort by count
            const topIssues = Object.entries(complaintsByDepartment)
                .map(([department, count]) => ({ department, count }))
                .sort((a, b) => b.count - a.count); // Show all departments
            // Aggregate by ward
            const complaintsByWard = {};
            complaints.forEach((complaint) => {
                if (complaint.wardId) {
                    const ward = wards.find((w) => w.id === complaint.wardId);
                    const wardName = ward ? ward.name : `Ward ${complaint.wardId}`;
                    complaintsByWard[wardName] = (complaintsByWard[wardName] || 0) + 1;
                }
            });
            // Convert to array with ward info
            const complaintsByWardArray = Object.entries(complaintsByWard)
                .map(([wardName, count]) => {
                const ward = wards.find((w) => w.name === wardName);
                return {
                    wardId: ward ? ward.id : null,
                    wardName,
                    count,
                    coordinates: ward ? ward.coordinates : undefined
                };
            })
                .sort((a, b) => b.count - a.count);
            // Prepare response data (no PII)
            data = {
                totalComplaints,
                resolvedRatio: Math.round(resolvedRatio * 10) / 10, // Round to 1 decimal
                avgResolutionTimeHours: Math.round(avgResolutionTimeHours * 10) / 10, // Round to 1 decimal
                topIssues,
                complaintsByWard: complaintsByWardArray,
                lastUpdated: new Date().toISOString()
            };
            // Cache the data
            transparencyCache.set(cacheKey, data);
        }
        // Add cache headers
        res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching transparency data:', error);
        res.status(500).json({ error: 'Failed to fetch transparency data' });
    }
};
exports.getTransparencyData = getTransparencyData;
const getTransparencyCSV = async (req, res) => {
    try {
        // Get the transparency data
        const cacheKey = 'transparency-data';
        let data = transparencyCache.get(cacheKey);
        if (!data) {
            // Generate fresh data if not cached
            await (0, exports.getTransparencyData)(req, res);
            data = transparencyCache.get(cacheKey);
        }
        if (!data) {
            throw new Error('Failed to generate transparency data');
        }
        // Generate CSV content
        const csvHeaders = ['Metric', 'Value', 'Category'];
        const csvRows = [
            ['Total Complaints', data.totalComplaints.toString(), 'Overview'],
            ['Resolved Ratio (%)', data.resolvedRatio.toString(), 'Overview'],
            ['Avg Resolution Time (Hours)', data.avgResolutionTimeHours.toString(), 'Overview'],
            ...data.topIssues.map((issue) => [issue.department, issue.count.toString(), 'Top Issues']),
            ...data.complaintsByWard.map((ward) => [ward.wardName, ward.count.toString(), 'By Ward'])
        ];
        const csvContent = [
            csvHeaders.join(','),
            ...csvRows.map(row => row.map((cell) => `"${cell}"`).join(','))
        ].join('\n');
        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="transparency-data-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csvContent);
    }
    catch (error) {
        console.error('Error generating CSV:', error);
        res.status(500).json({ error: 'Failed to generate CSV' });
    }
};
exports.getTransparencyCSV = getTransparencyCSV;
//# sourceMappingURL=transparencyController.js.map