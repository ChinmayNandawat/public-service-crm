"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOfficers = exports.getDepartments = exports.getWards = void 0;
// Get all wards
const getWards = async (req, res) => {
    try {
        // Load real wards data from JSON file
        const wardsData = require('../../data/wards.json');
        const wards = wardsData.map((ward) => ({
            id: ward.id,
            name: ward.name,
            geojson: ward.coordinates || {}
        }));
        res.json(wards);
    }
    catch (error) {
        console.error('Error fetching wards:', error);
        res.status(500).json({ error: 'Failed to fetch wards' });
    }
};
exports.getWards = getWards;
// Get all departments
const getDepartments = async (req, res) => {
    try {
        // Load real departments data from JSON file
        const departmentsData = require('../../data/departments.json');
        const departments = departmentsData.map((dept) => ({
            id: dept.id,
            name: dept.name,
            slaHours: dept.slaHours || 24 // Default SLA if not specified
        }));
        res.json(departments);
    }
    catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
};
exports.getDepartments = getDepartments;
// Get officers (optionally filtered by department)
const getOfficers = async (req, res) => {
    try {
        const { departmentId } = req.query;
        const usersData = require('../../data/users.json');
        const complaintsData = require('../../data/complaints.json').complaints || require('../../data/complaints.json'); // handle standard array or {complaints: []}
        const complaintsList = Array.isArray(complaintsData) ? complaintsData : (complaintsData.complaints || []);
        let officers = usersData.filter((u) => u.role === 'officer');
        if (departmentId) {
            officers = officers.filter((u) => u.departmentId === parseInt(departmentId));
        }
        // Add workload info
        const officersWithWorkload = officers.map((officer) => {
            const assignedComplaints = complaintsList.filter((c) => c.assignedOfficer === officer.id && c.status !== 'resolved');
            return {
                id: officer.id,
                fullName: officer.fullName,
                email: officer.email,
                departmentId: officer.departmentId,
                workload: assignedComplaints.length,
                assignedComplaints: assignedComplaints.map((c) => ({
                    id: c.id,
                    priorityScore: c.priorityScore,
                    status: c.status,
                    createdAt: c.createdAt
                }))
            };
        });
        res.json(officersWithWorkload);
    }
    catch (error) {
        console.error('Error fetching officers:', error);
        res.status(500).json({ error: 'Failed to fetch officers' });
    }
};
exports.getOfficers = getOfficers;
//# sourceMappingURL=utilityController.js.map