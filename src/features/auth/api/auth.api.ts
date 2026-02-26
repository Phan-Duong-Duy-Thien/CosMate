import axiosInstance from '@/services/axiosInstance';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

/**
 * Login with username/email and password
 * @param payload - Login credentials
 * @returns Login response with token
 */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  // TEMP DEBUG: Verify final URL
  console.log('🔧 [auth.api] login baseURL =', axiosInstance.defaults.baseURL);
  console.log('🔧 [auth.api] login endpoint =', '/api/auth/login');
  console.log('🔧 [auth.api] final URL =', axiosInstance.defaults.baseURL + '/api/auth/login');
  
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
