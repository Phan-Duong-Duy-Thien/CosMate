import { useState, useEffect, useCallback } from "react"
import { fetchNotifications } from "../services/notification.service"
import type { NotificationItem } from "../types"

interface UseNotificationsResult {
  notifications: NotificationItem[]
  loading: boolean
  unreadCount: number
  refetch: () => void
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchNotifications()
      setNotifications(data.result ?? [])
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return { notifications, loading, unreadCount, refetch: fetch }
}
