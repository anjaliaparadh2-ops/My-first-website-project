import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken');
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        }
      }
      
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message);
    }
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => 
    api.post('/auth/login', credentials),
  
  verifyToken: () => 
    api.get('/auth/verify'),
  
  changePassword: (passwords) => 
    api.put('/auth/change-password', passwords),
};

// Subjects APIs
export const subjectsAPI = {
  getAll: () => 
    api.get('/subjects'),
  
  getOne: (id) => 
    api.get(`/subjects/${id}`),
  
  create: (formData) => 
    api.post('/subjects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id, formData) => 
    api.put(`/subjects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id) => 
    api.delete(`/subjects/${id}`),
};

// Notes APIs
export const notesAPI = {
  getAll: (params = {}) => 
    api.get('/notes', { params }),
  
  getRecent: () => 
    api.get('/notes/recent/all'),
  
  getOne: (id) => 
    api.get(`/notes/${id}`),
  
  getDownloadUrl: (id) => 
    `${API_URL}/notes/${id}/download`,
  
  create: (formData) => 
    api.post('/notes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id, formData) => 
    api.put(`/notes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id) => 
    api.delete(`/notes/${id}`),
};

export default api;
