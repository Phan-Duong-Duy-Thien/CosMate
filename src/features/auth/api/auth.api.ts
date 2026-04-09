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
 * POST /api/auth/password-reset-request
 * Sends a password reset email to the user.
 * @param identifier - email or username
 */
export async function requestPasswordReset(identifier: string): Promise<void> {
  await axiosInstance.post<void>('/api/auth/password-reset-request', { identifier });
}

/**
 * POST /api/auth/password-reset
 * Resets the user's password using a token.
 * @param token - reset token from email
 * @param newPassword - new password
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await axiosInstance.post<void>('/api/auth/password-reset', { token, newPassword });
}
