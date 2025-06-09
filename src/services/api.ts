import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('lms_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
  department?: string;
  company?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  created_at: string;
}

export interface Internship {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  duration: string;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  mentor_id: number;
  mentor_name: string;
  posted_date: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  max_students: number;
  tags: string[];
  salary?: string;
  application_count: number;
}

export interface Application {
  id: number;
  internship_id: number;
  student_id: number;
  student_name: string;
  applied_date: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview';
  cover_letter: string;
  resume?: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
    company?: string;
  }) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
};

// Internships API
export const internshipsAPI = {
  getInternships: async (): Promise<Internship[]> => {
    const response = await api.get('/internships');
    return response.data;
  },

  createInternship: async (internshipData: Omit<Internship, 'id' | 'posted_date' | 'application_count'>) => {
    const response = await api.post('/internships', internshipData);
    return response.data;
  },

  updateInternship: async (id: number, internshipData: Partial<Internship>) => {
    const response = await api.put(`/internships/${id}`, internshipData);
    return response.data;
  },

  deleteInternship: async (id: number) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
  },

  getInternshipsByMentor: async (mentorId: number): Promise<Internship[]> => {
    const response = await api.get(`/internships/mentor/${mentorId}`);
    return response.data;
  },
};

// Applications API
export const applicationsAPI = {
  getApplications: async (): Promise<Application[]> => {
    const response = await api.get('/applications');
    return response.data;
  },

  createApplication: async (applicationData: Omit<Application, 'id' | 'applied_date'>) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  updateApplication: async (id: number, applicationData: Partial<Application>) => {
    const response = await api.put(`/applications/${id}`, applicationData);
    return response.data;
  },

  getApplicationsByStudent: async (studentId: number): Promise<Application[]> => {
    const response = await api.get(`/applications/student/${studentId}`);
    return response.data;
  },

  getApplicationsByInternship: async (internshipId: number): Promise<Application[]> => {
    const response = await api.get(`/applications/internship/${internshipId}`);
    return response.data;
  },
};

export default api;