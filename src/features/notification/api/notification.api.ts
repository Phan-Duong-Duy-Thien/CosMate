import axiosInstance from "@/services/axiosInstance"
import type { NotificationsResponse } from "../types"

export async function getNotifications(): Promise<NotificationsResponse> {
  const response = await axiosInstance.get<NotificationsResponse>("/api/notifications")
  return response.data
}
