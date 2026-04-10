import axiosInstance from '@/services/axiosInstance';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

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

/**
 * Login/Register with Google idToken
 * @param idToken - Google OAuth idToken from Google Identity Services
 * @returns Login response with token
 */
export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/api/auth/google/login', { idToken });
  return response.data;
}

/**
 * Update the current user's role (for onboarding flow)
 * @param role - The role to assign to the user
 * @returns Updated user info
 */
export async function updateUserRole(role: string): Promise<{ code: number; message: string; result: unknown }> {
  const response = await axiosInstance.post('/api/auth/role', { role });
  return response.data;
}
