export interface NotificationItem {
  id: number
  userId: number
  type: string
  header: string
  content: string
  sendAt: string
  isRead: boolean
  link?: string
}

export interface NotificationsResponse {
  result: NotificationItem[]
}
