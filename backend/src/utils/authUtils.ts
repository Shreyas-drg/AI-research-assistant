import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JWTPayload } from "../types/user";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
const JWT_EXPIRY = "7d";

/**
 * Hash a password using SHA-256
 * Note: For production, use bcryptjs instead of SHA-256
 */
export const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

/**
 * Compare password with hash
 */
export const comparePassword = (password: string, hash: string): boolean => {
  const hashedPassword = hashPassword(password);
  return hashedPassword === hash;
};

/**
 * Generate JWT token
 */
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * - Minimum 6 characters
 * - At least one uppercase letter
 * - At least one number
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 6) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

/**
 * Get password validation error message
 */
export const getPasswordError = (password: string): string | null => {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
};
