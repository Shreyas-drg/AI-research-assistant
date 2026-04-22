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

// Single paper in a comparison
export interface ComparedPaperData {
  fileName: string;
  fileHash: string;
  summary: string;
}

// Paper document types
export interface SinglePaperDocument {
  _id?: any;
  type: "single";
  userId: any;
  fileName: string;
  fileHash: string;
  summary: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ComparisonDocument {
  _id?: any;
  type: "comparison";
  userId: any;
  comparisonName: string; // e.g., "Comparison of 3 papers"
  papers: ComparedPaperData[]; // Array of compared papers
  comparisonSummary?: string; // Overall comparison summary
  createdAt: Date;
  updatedAt?: Date;
}

// Union type for paper documents
export type PaperDocument = SinglePaperDocument | ComparisonDocument;

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
