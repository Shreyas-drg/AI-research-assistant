import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId | string;
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  _id?: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthToken {
  token: string;
  expiresIn: string;
  user: UserResponse;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
