// File upload constraints
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_MIMETYPES: ["application/pdf"],
  UPLOAD_DIR: "uploads/",
};

// API constraints
export const API = {
  MAX_TEXT_LENGTH: 4000, // Reduced from 8000 to prevent Ollama crashes
  TIMEOUT: 120000, // 120 seconds (Ollama might be slower on first run)
  MODEL: "mistral", // Using Ollama's Mistral model
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000, // Ollama allows more tokens
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
  INVALID_API_KEY: "Ollama is not running on localhost:11434",
  RATE_LIMITED: "Ollama is processing another request, please try again in a moment",
  SERVICE_UNAVAILABLE: "Ollama service is currently unavailable. Make sure it's running.",
  GENERIC_ERROR: "Error processing file",
  MISSING_API_KEY: "OLLAMA_API_URL is not configured",
};

// Success messages
export const SUCCESS_MESSAGES = {
  FILE_PROCESSED: "File processed successfully",
  SUMMARY_GENERATED: "Summary generated successfully",
};
