import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },
  register: async (userData) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
  },
  setToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },
};

export const userService = {
  getAll: async () => {
    const { data } = await apiClient.get('/users');
    return data;
  },
  getById: async (id) => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },
  update: async (id, userData) => {
    const { data } = await apiClient.put(`/users/${id}`, userData);
    return data;
  },
  delete: async (id) => {
    await apiClient.delete(`/users/${id}`);
  },
};

export default apiClient;
