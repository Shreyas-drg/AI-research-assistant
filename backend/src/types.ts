// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

// Paper summary response
export interface PaperSummary {
  summary: string;
}

// Multer file type
export interface UploadedFile {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

// Error response
export interface ErrorResponse {
  error: string;
}
