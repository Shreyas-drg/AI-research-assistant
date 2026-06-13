// File upload constraints
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_MIMETYPES: ["application/pdf"],
  UPLOAD_DIR: "uploads/",
};

// API constraints
export const API = {
  MAX_TEXT_LENGTH: 4000, // Limit text for better summarization
  TIMEOUT: 120000, // 120 seconds
  MODEL: "mixtral-8x7b-32768", // Using Groq's fastest open-source model
  TEMPERATURE: 0.7,
  MAX_TOKENS: 1500, // Groq is very fast
  RETRY_ATTEMPTS: 2,
  RETRY_BASE_DELAY_MS: 1000,
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error messages
export const ERROR_MESSAGES = {
  NO_FILE: "No file uploaded",
  INVALID_FILE_TYPE: "Please upload a PDF file",
  EMPTY_FILE: "File is empty",
  NO_TEXT_IN_PDF: "PDF contains no readable text",
  FILE_TOO_LARGE: "File size exceeds 50MB limit",
  INVALID_API_KEY: "Invalid Groq API key. Please check your GROQ_API_KEY environment variable.",
  RATE_LIMITED: "Groq API rate limit exceeded. Please try again in a moment.",
  SERVICE_UNAVAILABLE: "Groq service is currently unavailable. Please try again later.",
  GENERIC_ERROR: "Error processing file",
  MISSING_API_KEY: "GROQ_API_KEY is not configured",
};

// Success messages
export const SUCCESS_MESSAGES = {
  FILE_PROCESSED: "File processed successfully",
  SUMMARY_GENERATED: "Summary generated successfully",
};
