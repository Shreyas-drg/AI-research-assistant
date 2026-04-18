'use client';

import axios from 'axios';

const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  : 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PaperSummaryResponse {
  summary: string;
}

export interface ApiError {
  error: string;
}

export const uploadPaper = async (file: File): Promise<PaperSummaryResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post<PaperSummaryResponse>(
      '/api/paper/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

export default apiClient;
