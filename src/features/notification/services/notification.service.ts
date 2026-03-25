import { getNotifications } from "../api/notification.api"
import type { NotificationsResponse } from "../types"

export async function fetchNotifications(): Promise<NotificationsResponse> {
  return getNotifications()
}
