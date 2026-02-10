import axiosInstance from '@/services/axiosInstance';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

/**
 * Login with username/email and password
 * @param payload - Login credentials
 * @returns Login response with token
 */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>('/auth/login', payload);
  return response.data;
}

/**
 * Register a new user account
 * @param payload - Registration data including role
 * @returns Registration response with user data
 */
export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await axiosInstance.post<RegisterResponse>('/auth/register', payload);
  return response.data;
}
