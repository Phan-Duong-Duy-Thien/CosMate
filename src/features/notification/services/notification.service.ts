import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../api/notification.api"
import type { NotificationsResponse } from "../types"

export async function fetchNotifications(): Promise<NotificationsResponse> {
  console.log("[notification.service] fetchNotifications")
  return getNotifications()
}

export async function markRead(notificationId: number): Promise<void> {
  console.log("[notification.service] markRead:", notificationId)
  await markNotificationRead(notificationId)
}

export async function markAllRead(): Promise<void> {
  console.log("[notification.service] markAllRead")
  await markAllNotificationsRead()
}

export async function removeNotification(notificationId: number): Promise<void> {
  console.log("[notification.service] removeNotification:", notificationId)
  await deleteNotification(notificationId)
}
