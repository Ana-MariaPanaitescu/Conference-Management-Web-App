import axios from 'axios';
import { API_URL } from '../utils/constants';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  updateAuthHeader: (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user?.role === requiredRole;
  },
};

export default authService;