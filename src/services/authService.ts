import { loginWithGoogle as loginWithGoogleApi, changePassword as changePasswordApi } from "@/features/auth/api/auth.api"
import type { LoginResponse } from "@/features/auth/types"

export async function changePassword(userId: number, payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> {
  return changePasswordApi(userId, payload)
}

export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  return loginWithGoogleApi(idToken)
}
