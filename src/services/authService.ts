import type { EmailLoginPayload } from "@/features/auth/types"
import type { EmailRegisterPayload } from "@/features/auth/types"
import { loginWithGoogle as loginWithGoogleApi } from "@/features/auth/api/auth.api"
import type { LoginResponse } from "@/features/auth/types"

export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  return loginWithGoogleApi(idToken)
}
