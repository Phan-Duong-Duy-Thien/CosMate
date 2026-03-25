import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../api/notification.api"
import type { NotificationsResponse } from "../types"

export async function fetchNotifications(): Promise<NotificationsResponse> {
  return getNotifications()
}

export async function markRead(notificationId: number): Promise<void> {
  await markNotificationRead(notificationId)
}

export async function markAllRead(): Promise<void> {
  await markAllNotificationsRead()
}
