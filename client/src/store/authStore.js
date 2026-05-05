import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth state from stored token
  initialize: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      set({
        user: data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Register
  register: async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('accessToken', data.data.accessToken);
    set({
      user: data.data.user,
      isAuthenticated: true,
    });
    return data;
  },

  // Login
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    set({
      user: data.data.user,
      isAuthenticated: true,
    });
    return data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, isAuthenticated: false });
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  // Reset Password
  resetPassword: async (token, password) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    return data;
  },
}));

export default useAuthStore;
