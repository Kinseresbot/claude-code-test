import axios from 'axios';
import { supabase, getAccessToken } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from Supabase
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please add your credentials to client/.env');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      session: data.session,
      user: data.user,
    };
  },

  register: async (email, password, metadata = {}) => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please add your credentials to client/.env');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;

    return {
      session: data.session,
      user: data.user,
    };
  },

  logout: async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  resetPassword: async (email) => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please add your credentials to client/.env');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  updatePassword: async (newPassword) => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please add your credentials to client/.env');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
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
