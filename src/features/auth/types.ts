import type { UserRole } from '@/types/auth';

// ============ LOGIN TYPES ============

export type LoginFormValues = {
  usernameOrEmail: string
  password: string
  rememberMe?: boolean
}

export type EmailLoginPayload = {
  email: string
  password: string
}

export type LoginRequest = {
  usernameOrEmail: string
  password: string
}

export type LoginResult = {
  token: string
  tokenType: string
}

export type LoginResponse = {
  code: number
  message: string
  result: LoginResult
}

// ============ QR LOGIN TYPES ============

export type QrLoginSessionStatus = "PENDING" | "APPROVED" | "EXPIRED" | "CANCELLED"

export type QrLoginSessionResult = {
  loginSessionToken?: string
  sessionToken?: string
  expiresAt?: string
  expiresInSeconds?: number
}

export type QrLoginSessionResponse = {
  code: number
  message: string
  result: QrLoginSessionResult
}

export type QrLoginStatusResult = {
  status: QrLoginSessionStatus
  /** When APPROVED — same shape as email login */
  token?: string
  accessToken?: string
  tokenType?: string
  result?: LoginResult
}

export type QrLoginStatusResponse = {
  code: number
  message: string
  result: QrLoginStatusResult
}

// JWT Payload Type
export type JwtPayload = {
  sub?: string      // User ID (string format)
  id?: number       // User ID (number format, some backends)
  userId?: number   // User ID (alternative field name)
  exp?: number
  iat?: number
  roles?: string[]  // Some backends use "roles" as array
  role?: string     // Some backends use "role" as string
  [key: string]: unknown
}

// ============ REGISTER TYPES ============

export type RegisterFormValues = {
  username: string
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export type EmailRegisterPayload = {
  fullName: string
  email: string
  password: string
}

// API Contract Types for Register
export type RegisterRequest = {
  username: string
  email: string
  password: string
  phone: string
  fullName: string
  role: UserRole
}

export type RegisterResult = {
  id: number
  username: string
  email: string
  fullName: string
  avatarUrl: string | null
  phone: string
  status: string
}

export type RegisterResponse = {
  code: number
  message: string
  result: RegisterResult
}
