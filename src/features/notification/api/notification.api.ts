import axiosInstance from "@/services/axiosInstance"
import type { NotificationsResponse } from "../types"

export async function getNotifications(): Promise<NotificationsResponse> {
  console.log("[notification.api] GET /api/notifications")
  const response = await axiosInstance.get<NotificationsResponse>("/api/notifications")
  console.log("[notification.api] Response:", response.data)
  return response.data
}

export async function markNotificationRead(notificationId: number): Promise<void> {
  console.log("[notification.api] POST /api/notifications/mark-read/", notificationId)
  await axiosInstance.post(`/api/notifications/mark-read/${notificationId}`)
  console.log("[notification.api] Mark read success")
}

export async function markAllNotificationsRead(): Promise<void> {
  console.log("[notification.api] POST /api/notifications/mark-all-read")
  await axiosInstance.post("/api/notifications/mark-all-read")
  console.log("[notification.api] Mark all read success")
}

export async function deleteNotification(notificationId: number): Promise<void> {
  console.log("[notification.api] DELETE /api/notifications/", notificationId)
  const response = await axiosInstance.delete<{ code?: number; message?: string }>(
    `/api/notifications/${notificationId}`
  )
  if (response.data?.code != null && response.data.code !== 0) {
    throw new Error(response.data.message || "Xóa thông báo thất bại")
  }
  console.log("[notification.api] Delete success")
}
