import { changePassword as changePasswordApi } from "@/features/auth/api/auth.api"

export async function changePassword(userId: number, payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<void> {
  return changePasswordApi(userId, payload)
}
