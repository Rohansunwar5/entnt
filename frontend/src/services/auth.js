// src/services/auth.js
import { authAPI } from './api';
import { AUTH_TOKEN_KEY } from '../utils/constants';

export const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    const { token, user } = response.data;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return user;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const validateToken = async () => {
  try {
    const response = await authAPI.validateToken();
    return response.data;
  } catch (error) {
    logout();
    throw error;
  }
};