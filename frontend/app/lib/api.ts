'use client';

import axios from 'axios';

const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  : 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 300000, // 5 minutes - Ollama needs time to generate summaries
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PaperSummaryResponse {
  summary: string;
  paperId?: string;
  fileName?: string;
  message?: string;
}

export interface UserPaper {
  id: string;
  fileName: string;
  summary: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
}

export const uploadPaper = async (file: File, token?: string): Promise<PaperSummaryResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const headers: any = {};

    // Add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type - let axios handle it automatically for FormData
    const response = await apiClient.post<PaperSummaryResponse>(
      '/api/paper/upload',
      formData,
      {
        headers,
        transformRequest: [(data) => data], // Prevent axios from modifying FormData
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      const message = typeof error.message === 'string' ? error.message : 'API Error';
      throw new Error(errorData?.error || message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/');
    return response.status === 200;
  } catch {
    return false;
  }
};

// Auth API functions
export interface UserData {
  _id?: string;
  email: string;
  name?: string;
  createdAt?: Date;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    expiresIn: string;
    user: UserData;
  };
}

export const registerUser = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(errorData?.error || 'Registration failed');
    }
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(errorData?.error || 'Login failed');
    }
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<UserData> => {
  try {
    const response = await apiClient.post<{ message: string; data: UserData }>(
      '/api/auth/verify',
      { token }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(errorData?.error || 'Token verification failed');
    }
    throw error;
  }
};

export const getUserProfile = async (token: string): Promise<UserData> => {
  try {
    const response = await apiClient.get<{ message: string; data: UserData }>(
      '/api/auth/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(errorData?.error || 'Failed to get profile');
    }
    throw error;
  }
};

// Paper Management API functions
export const getUserPapers = async (token: string): Promise<UserPaper[]> => {
  try {
    const response = await apiClient.get<{ message: string; count: number; data: UserPaper[] }>(
      '/api/paper/my-papers',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(errorData?.error || 'Failed to fetch papers');
    }
    throw error;
  }
};

export const deletePaper = async (paperId: string, token: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/paper/${paperId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(errorData?.error || 'Failed to delete paper');
    }
    throw error;
  }
};

export default apiClient;
