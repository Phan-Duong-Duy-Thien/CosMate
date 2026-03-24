import axiosInstance from '@/services/axiosInstance';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

/**
 * Login with username/email and password
 * @param payload - Login credentials
 * @returns Login response with token
 */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/api/auth/login', payload);
  return response.data;
}

/**
 * Register a new user account
 * @param payload - Registration data including role
 * @returns Registration response with user data
 */
export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await axiosInstance.post<RegisterResponse>('/api/auth/register', payload);
  return response.data;
}

/**
 * POST /api/auth/forgot-password
 * Sends a password reset email to the user.
 */
export async function forgotPassword(email: string): Promise<void> {
  await axiosInstance.post<void>('/api/auth/forgot-password', { email });
}

/**
 * POST /api/auth/reset-password
 * Resets the user's password using a token.
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await axiosInstance.post<void>('/api/auth/reset-password', { token, newPassword });
}
