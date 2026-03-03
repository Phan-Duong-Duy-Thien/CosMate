import { VI } from "@/shared/i18n/vi"
import type { AdminUserProfile } from "@/features/admin/types"
import type { UpdateUserProfilePayload } from "../types"
import * as userProfileApi from "../api/userProfile.api"

export async function updateProfile(
  userId: number,
  payload: UpdateUserProfilePayload
): Promise<AdminUserProfile> {
  const response = await userProfileApi.updateUserProfile(userId, payload)

  if (response.code !== 0) {
    throw new Error(response.message || VI.profile.messages.updateFailed)
  }

  return response.result
}

export async function uploadAvatar(
  userId: number,
  file: File
): Promise<AdminUserProfile> {
  const response = await userProfileApi.uploadUserAvatar(userId, file)

  if (response.code !== 0) {
    throw new Error(response.message || VI.profile.messages.uploadAvatarFailed)
  }

  return response.result
}
