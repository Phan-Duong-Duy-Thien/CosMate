import axiosInstance from "@/services/axiosInstance"
import type { NotificationsResponse } from "../types"

export async function getNotifications(): Promise<NotificationsResponse> {
  const response = await axiosInstance.get<NotificationsResponse>("/api/notifications")
  return response.data
}

export async function markNotificationRead(notificationId: number): Promise<void> {
  await axiosInstance.post(`/api/notifications/mark-read/${notificationId}`)
}

export async function markAllNotificationsRead(): Promise<void> {
  await axiosInstance.post("/api/notifications/mark-all-read")
}
