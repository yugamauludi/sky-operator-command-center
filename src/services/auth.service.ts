/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/lib/axios';
import { LoginCredentials, User, ApiResponse } from '@/types/auth';

const encryptPayload = (data: any) => {
  // TODO: Implementasikan enkripsi data di sini jika diperlukan
  return data;
};

export const AuthService = {
  verifyToken: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get('/protected');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const encryptedData = encryptPayload(credentials);
      const response = await apiClient.post('/login', encryptedData, {
        headers: {
          'X-Request-ID': crypto.randomUUID(),
          'X-Source': 'command-center-web',
        }
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getUserById: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.get('/getUserById');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await apiClient.get('/getAllUsers');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const response = await apiClient.post('/logout');
      localStorage.removeItem('token');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};