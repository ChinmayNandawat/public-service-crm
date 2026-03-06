import request from 'supertest';
import app from '../index';
import { AIService } from '../services/aiService';
import { computePriorityScore } from '../utils/priorityScore';

describe('Complaints API', () => {
  let citizenToken: string;
  let adminToken: string;
  let officerToken: string;

  beforeAll(async () => {
    // Create test users and get tokens
    const citizenResponse = await request(app)
      .post('/api/temp-register')
      .send({
        fullName: 'Test Citizen',
        email: 'citizen@test.com',
        phone: '+1234567890',
        password: 'password123',
        role: 'citizen'
      });

    citizenToken = citizenResponse.body.token;

    const adminResponse = await request(app)
      .post('/api/temp-register')
      .send({
        fullName: 'Test Admin',
        email: 'admin@test.com',
        phone: '+1234567891',
        password: 'admin123',
        role: 'admin'
      });

    adminToken = adminResponse.body.token;

    const officerResponse = await request(app)
      .post('/api/temp-register')
      .send({
        fullName: 'Test Officer',
        email: 'officer@test.com',
        phone: '+1234567892',
        password: 'officer123',
        role: 'officer'
      });

    officerToken = officerResponse.body.token;
  });

  describe('POST /api/complaints', () => {
    it('should create a complaint as citizen', async () => {
      const complaintData = {
        wardId: 1,
        departmentId: 1,
        description: 'There is a serious water leak near the hospital',
        location: 'Near City Hospital',
        latitude: 40.7128,
        longitude: -74.0060
      };

      const response = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(complaintData)
        .expect(201);

      expect(response.body.complaintId).toBeDefined();
      expect(response.body.priorityScore).toBeDefined();
      expect(response.body.message).toBe('Complaint created successfully.');

      // Priority score should be high due to urgency and location
      expect(response.body.priorityScore).toBeGreaterThan(0.8);
    });

    it('should reject complaint creation from non-citizen', async () => {
      const complaintData = {
        wardId: 1,
        description: 'Test complaint'
      };

      const response = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(complaintData)
        .expect(403);

      expect(response.body.error).toBe('Only citizens can create complaints.');
    });

    it('should require wardId and description', async () => {
      const response = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          description: 'Test complaint'
        })
        .expect(400);

      expect(response.body.error).toBe('wardId and description are required.');
    });

    it('should reject unauthenticated request', async () => {
      const complaintData = {
        wardId: 1,
        description: 'Test complaint'
      };

      const response = await request(app)
        .post('/api/complaints')
        .send(complaintData)
        .expect(401);

      expect(response.body.error).toBe('Access denied. No token provided.');
    });
  });

  describe('GET /api/complaints', () => {
    beforeEach(async () => {
      // Create a test complaint for testing
      await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          wardId: 1,
          description: 'Test complaint for GET tests'
        });
    });

    it('should return citizen\'s own complaints', async () => {
      const response = await request(app)
        .get('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(response.body.complaints).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      
      // All complaints should belong to the citizen
      response.body.complaints.forEach((complaint: any) => {
        expect(complaint.citizenId).toBeDefined();
      });
    });

    it('should return all complaints for admin', async () => {
      const response = await request(app)
        .get('/api/complaints')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.complaints).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });

    it('should apply pagination', async () => {
      const response = await request(app)
        .get('/api/complaints?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.complaints.length).toBeLessThanOrEqual(5);
    });

    it('should filter by ward', async () => {
      const response = await request(app)
        .get('/api/complaints?ward=1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      response.body.complaints.forEach((complaint: any) => {
        expect(complaint.wardId).toBe(1);
      });
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/complaints?status=submitted')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      response.body.complaints.forEach((complaint: any) => {
        expect(complaint.status).toBe('submitted');
      });
    });
  });

  describe('PUT /api/complaints/:id', () => {
    let complaintId: number;

    beforeEach(async () => {
      // Create a test complaint
      const response = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          wardId: 1,
          description: 'Test complaint for PUT tests'
        });
      
      complaintId = response.body.complaintId;
    });

    it('should allow admin to update complaint status', async () => {
      const response = await request(app)
        .put(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'in_progress'
        })
        .expect(200);

      expect(response.body.message).toBe('Complaint updated successfully.');
      expect(response.body.complaint.status).toBe('in_progress');
    });

    it('should reject citizen update attempts', async () => {
      const response = await request(app)
        .put(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          status: 'in_progress'
        })
        .expect(403);

      expect(response.body.error).toBe('Citizens cannot update complaints.');
    });

    it('should allow admin to assign complaints', async () => {
      const response = await request(app)
        .put(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          assignedOfficer: 3
        })
        .expect(200);

      expect(response.body.message).toBe('Complaint updated successfully.');
      expect(response.body.complaint.assignedOfficer).toBe(3);
    });

    it('should reject officer assignment attempts', async () => {
      const response = await request(app)
        .put(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          assignedOfficer: 3
        })
        .expect(403);

      expect(response.body.error).toBe('Only admins can assign complaints.');
    });
  });

  describe('DELETE /api/complaints/:id', () => {
    let complaintId: number;

    beforeEach(async () => {
      // Create a test complaint
      const response = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send({
          wardId: 1,
          description: 'Test complaint for DELETE tests'
        });
      
      complaintId = response.body.complaintId;
    });

    it('should allow admin to soft delete complaints', async () => {
      const response = await request(app)
        .delete(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe('Complaint deleted successfully.');
    });

    it('should reject citizen delete attempts', async () => {
      const response = await request(app)
        .delete(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(403);

      expect(response.body.error).toBe('Only admins can delete complaints.');
    });

    it('should reject officer delete attempts', async () => {
      const response = await request(app)
        .delete(`/api/complaints/${complaintId}`)
        .set('Authorization', `Bearer ${officerToken}`)
        .expect(403);

      expect(response.body.error).toBe('Only admins can delete complaints.');
    });
  });
});

describe('AI Service', () => {
  describe('classify', () => {
    it('should classify water-related complaints', async () => {
      const result = await AIService.classify('Water pipe is broken and flooding the street');
      
      expect(result.category).toBe('Water Supply');
      expect(['high', 'medium', 'low']).toContain(result.urgency);
      expect(['angry', 'neutral', 'positive']).toContain(result.sentiment);
    });

    it('should classify road-related complaints', async () => {
      const result = await AIService.classify('Large pothole on main road causing accidents');
      
      expect(result.category).toBe('Road Damage');
      expect(['high', 'medium', 'low']).toContain(result.urgency);
      expect(['angry', 'neutral', 'positive']).toContain(result.sentiment);
    });

    it('should classify sanitation complaints', async () => {
      const result = await AIService.classify('Garbage not collected for weeks');
      
      expect(result.category).toBe('Sanitation');
      expect(['high', 'medium', 'low']).toContain(result.urgency);
      expect(['angry', 'neutral', 'positive']).toContain(result.sentiment);
    });

    it('should detect high urgency', async () => {
      const result = await AIService.classify('This is an emergency situation, critical danger');
      
      expect(result.urgency).toBe('high');
    });

    it('should detect angry sentiment', async () => {
      const result = await AIService.classify('I am furious and frustrated with this terrible service');
      
      expect(result.sentiment).toBe('angry');
    });

    it('should detect positive sentiment', async () => {
      const result = await AIService.classify('Thank you for the wonderful service');
      
      expect(result.sentiment).toBe('positive');
    });

    it('should return default classification for general text', async () => {
      const result = await AIService.classify('Some general comment');
      
      expect(result.category).toBe('General');
      expect(result.urgency).toBe('low');
      expect(result.sentiment).toBe('neutral');
    });
  });
});
