import { Request, Response, NextFunction } from "express";

// Logger middleware
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};

// Validation utility for required env variables
export const validateEnv = (variable: string): string => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
  return value;
};

// Safe error message helper
export const getSafeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error occurred";
};

// API response formatter
export const formatResponse = (data: any, message?: string) => {
  return {
    success: true,
    message,
    data,
  };
};

// API error formatter
export const formatError = (error: string, statusCode: number = 500) => {
  return {
    success: false,
    error,
    statusCode,
  };
};
