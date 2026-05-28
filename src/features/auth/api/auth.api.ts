import axiosInstance from '@/services/axiosInstance';
import type {
  GoogleLoginRequest,
  GoogleLoginResponse,
  LoginRequest,
  LoginResponse,
  QrGenerateResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types';

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
 * Login with Google credential token
 * @param payload - Google login payload
 * @returns Login response with token
 */
export async function googleLogin(payload: GoogleLoginRequest): Promise<GoogleLoginResponse> {
  const response = await axiosInstance.post<GoogleLoginResponse>('/api/auth/google/login', payload);
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
 * Update the current user's role (for onboarding flow)
 * @param role - The role to assign to the user
 * @returns Updated user info
 */
export async function updateUserRole(role: string): Promise<{ code: number; message: string; result: unknown }> {
  const response = await axiosInstance.post('/api/auth/role', { role });
  return response.data;
}

/**
 * POST /api/users/{userId}/change-password
 * Change the current user's password.
 */
export async function changePassword(userId: number, payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> {
  await axiosInstance.post<void>(`/api/users/${userId}/change-password`, payload);
}

/**
 * GET /api/auth/qr-generate — BE creates sessionId for QR + WebSocket topic.
 */
export async function generateQrSession(): Promise<QrGenerateResponse> {
  const response = await axiosInstance.get<QrGenerateResponse>('/api/auth/qr-generate');
  return response.data;
}
