import { useState, useEffect, useCallback } from "react"
import { fetchNotifications, markRead, markAllRead } from "../services/notification.service"
import type { NotificationItem } from "../types"

interface UseNotificationsResult {
  notifications: NotificationItem[]
  loading: boolean
  unreadCount: number
  refetch: () => void
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>
  markNotificationRead: (id: number) => Promise<void>
  markAllRead: () => Promise<void>
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

  const markNotificationRead = useCallback(async (id: number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    try {
      await markRead(id)
    } catch (err) {
      // Revert on failure
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      )
      console.error("Failed to mark notification as read:", err)
    }
  }, [])

  const markAllRead = useCallback(async () => {
    // Optimistic update
    const previous = notifications
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    try {
      await markAllRead()
    } catch (err) {
      // Revert on failure
      setNotifications(previous)
      console.error("Failed to mark all as read:", err)
    }
  }, [notifications])

  useEffect(() => {
    fetch()
  }, [fetch])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    loading,
    unreadCount,
    refetch: fetch,
    setNotifications,
    markNotificationRead,
    markAllRead,
  }
}
