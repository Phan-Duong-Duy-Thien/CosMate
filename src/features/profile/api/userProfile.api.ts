import axiosInstance from "@/services/axiosInstance"
import type { AdminUserProfile, ApiResponse } from "@/features/admin/types"
import type { UpdateUserProfilePayload } from "../types"

export async function updateUserProfile(
  id: number,
  payload: UpdateUserProfilePayload
): Promise<ApiResponse<AdminUserProfile>> {
  const response = await axiosInstance.put<ApiResponse<AdminUserProfile>>(
    `/api/users/${id}/profile`,
    payload
  )
  return response.data
}

export async function uploadUserAvatar(
  id: number,
  file: File
): Promise<ApiResponse<AdminUserProfile>> {
  const formData = new FormData()
  formData.append("avatar", file)

  const response = await axiosInstance.put<ApiResponse<AdminUserProfile>>(
    `/api/users/${id}/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return response.data
}
