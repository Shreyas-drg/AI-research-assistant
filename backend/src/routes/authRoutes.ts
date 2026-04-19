import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db/mongodb";
import { User, UserResponse, AuthToken } from "../types/user";
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  isValidEmail,
  isValidPassword,
  getPasswordError,
} from "../utils/authUtils";
import { HTTP_STATUS } from "../constants";

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Invalid email format",
      });
    }

    const passwordError = getPasswordError(password);
    if (passwordError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: passwordError,
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "User with this email already exists",
      });
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    const newUser: User = {
      email,
      password: hashedPassword,
      name: name || email.split("@")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Generate token
    const token = generateToken(result.insertedId.toString(), email);

    const userResponse: UserResponse = {
      _id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };

    const authToken: AuthToken = {
      token,
      expiresIn: "7d",
      user: userResponse,
    };

    res.status(HTTP_STATUS.OK).json({
      message: "User registered successfully",
      data: authToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: "Failed to register user",
    });
  }
});

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Email and password are required",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Invalid email or password",
      });
    }

    // Verify password
    if (!comparePassword(password, user.password)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id!.toString(), email);

    const userResponse: UserResponse = {
      _id: user._id!.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    const authToken: AuthToken = {
      token,
      expiresIn: "7d",
      user: userResponse,
    };

    res.status(HTTP_STATUS.OK).json({
      message: "Login successful",
      data: authToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: "Failed to login",
    });
  }
});

/**
 * POST /api/auth/verify
 * Verify JWT token and return user data
 */
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Token is required",
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Invalid or expired token",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");
    const user = await usersCollection.findOne({
      _id: new ObjectId(payload.userId),
    });

    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "User not found",
      });
    }

    const userResponse: UserResponse = {
      _id: user._id!.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    res.status(HTTP_STATUS.OK).json({
      message: "Token verified",
      data: userResponse,
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: "Failed to verify token",
    });
  }
});

/**
 * GET /api/auth/profile
 * Get user profile (requires token in header)
 */
router.get("/profile", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Authorization token required",
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "Invalid or expired token",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");
    const user = await usersCollection.findOne({
      _id: new ObjectId(payload.userId),
    });

    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: "User not found",
      });
    }

    const userResponse: UserResponse = {
      _id: user._id!.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    res.status(HTTP_STATUS.OK).json({
      message: "Profile retrieved",
      data: userResponse,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      error: "Failed to retrieve profile",
    });
  }
});

export default router;
