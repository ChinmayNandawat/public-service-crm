import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API base configuration
const API_BASE_URL = 'http://localhost:5001/api';

// Types
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'citizen' | 'officer' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Complaint {
  id: number;
  citizenId: number;
  wardId: number;
  departmentId?: number;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  category: string;
  sentiment: string;
  priorityScore: number;
  status: 'submitted' | 'in_progress' | 'resolved' | 'closed' | 'deleted';
  assignedOfficer?: number;
  createdAt: string;
  assignedAt?: string;
  resolvedAt?: string;
}

export interface ComplaintCreateResponse {
  complaintId: number;
  priorityScore: number;
  message: string;
}

export interface ComplaintListResponse {
  complaints: Complaint[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ComplaintDetail {
  complaint: Complaint & {
    citizen?: {
      id: number;
      fullName: string;
      email: string;
    };
  };
}

export interface Ward {
  id: number;
  name: string;
  geojson: any;
}

export interface Department {
  id: number;
  name: string;
  slaHours: number;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: 'citizen' | 'officer' | 'admin';
  }): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/temp-register', userData),

  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> => 
    api.post('/temp-login', credentials),

  getMe: (): Promise<AxiosResponse<{ user: User }>> => 
    api.get('/temp-me'),
};

// Complaints API
export const complaintsAPI = {
  create: (complaintData: {
    wardId: number;
    departmentId?: number;
    description: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    attachments?: File;
  }): Promise<AxiosResponse<ComplaintCreateResponse>> => 
    api.post('/complaints', complaintData),

  getAll: (params?: {
    page?: number;
    limit?: number;
    ward?: number;
    department?: number;
    status?: string;
  }): Promise<AxiosResponse<ComplaintListResponse>> => 
    api.get('/complaints', { params }),

  getById: (id: number): Promise<AxiosResponse<ComplaintDetail>> => 
    api.get(`/complaints/${id}`),

  update: (id: number, data: {
    status?: string;
    assignedOfficer?: number;
  }): Promise<AxiosResponse<{ message: string; complaint: Complaint }>> => 
    api.put(`/complaints/${id}`, data),

  delete: (id: number): Promise<AxiosResponse<{ message: string }>> => 
    api.delete(`/complaints/${id}`),
};

// Utility API (for wards and departments)
export const utilityAPI = {
  // Note: This would be implemented when we have the actual endpoints
  getWards: (): Promise<AxiosResponse<Ward[]>> => 
    // Mock data for now - return proper AxiosResponse structure
    Promise.resolve({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      data: [
        { id: 1, name: 'Ward 1', geojson: {} },
        { id: 2, name: 'Ward 2', geojson: {} },
        { id: 3, name: 'Ward 3', geojson: {} },
      ]
    }),

  getDepartments: (): Promise<AxiosResponse<Department[]>> => 
    // Mock data for now - return proper AxiosResponse structure
    Promise.resolve({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      data: [
        { id: 1, name: 'Water', slaHours: 24 },
        { id: 2, name: 'Roads', slaHours: 48 },
        { id: 3, name: 'Sanitation', slaHours: 12 },
      ]
    }),
};

export default api;
