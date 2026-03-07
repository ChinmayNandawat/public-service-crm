import { Request, Response } from 'express';

// Get all wards
export const getWards = async (req: Request, res: Response) => {
  try {
    // Load real wards data from JSON file
    const wardsData = require('../../data/wards.json');
    const wards = wardsData.map((ward: any) => ({
      id: ward.id,
      name: ward.name,
      geojson: ward.coordinates || {}
    }));

    res.json(wards);
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({ error: 'Failed to fetch wards' });
  }
};

// Get all departments
export const getDepartments = async (req: Request, res: Response) => {
  try {
    // Load real departments data from JSON file
    const departmentsData = require('../../data/departments.json');
    const departments = departmentsData.map((dept: any) => ({
      id: dept.id,
      name: dept.name,
      slaHours: dept.slaHours || 24 // Default SLA if not specified
    }));

    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get officers (optionally filtered by department)
export const getOfficers = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.query;
    const usersData = require('../../data/users.json');
    const complaintsData = require('../../data/complaints.json').complaints || require('../../data/complaints.json'); // handle standard array or {complaints: []}
        
    const complaintsList = Array.isArray(complaintsData) ? complaintsData : (complaintsData.complaints || []);

    let officers = usersData.filter((u: any) => u.role === 'officer');
    
    if (departmentId) {
      officers = officers.filter((u: any) => u.departmentId === parseInt(departmentId as string));
    }
    
    // Add workload info
    const officersWithWorkload = officers.map((officer: any) => {
      const assignedComplaints = complaintsList.filter((c: any) => c.assignedOfficer === officer.id && c.status !== 'resolved');
      return {
        id: officer.id,
        fullName: officer.fullName,
        email: officer.email,
        departmentId: officer.departmentId,
        workload: assignedComplaints.length,
        assignedComplaints: assignedComplaints.map((c: any) => ({
          id: c.id,
          priorityScore: c.priorityScore,
          status: c.status,
          createdAt: c.createdAt
        }))
      };
    });

    res.json(officersWithWorkload);
  } catch (error) {
    console.error('Error fetching officers:', error);
    res.status(500).json({ error: 'Failed to fetch officers' });
  }
};
