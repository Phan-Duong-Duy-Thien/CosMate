import { useState, useEffect, useCallback } from "react"
import {
  fetchNotifications,
  markRead,
  markAllRead as markAllReadService,
  removeNotification,
} from "../services/notification.service"
import type { NotificationItem } from "../types"

interface UseNotificationsResult {
  notifications: NotificationItem[]
  loading: boolean
  unreadCount: number
  refetch: () => void
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>
  markNotificationRead: (id: number) => Promise<void>
  markAllRead: () => Promise<boolean>
  deleteNotification: (id: number) => Promise<boolean>
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      console.log("[useNotifications] Fetching notifications...")
      const data = await fetchNotifications()
      console.log("[useNotifications] Response:", data)
      console.log("[useNotifications] Notifications:", data.result)
      setNotifications(data.result ?? [])
    } catch (err) {
      console.error("[useNotifications] Fetch error:", err)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  const markNotificationRead = useCallback(async (id: number) => {
    console.log("[useNotifications] Marking as read:", id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    try {
      await markRead(id)
      console.log("[useNotifications] Marked as read success:", id)
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      )
      console.error("[useNotifications] Mark as read failed:", err)
    }
  }, [])

  const markAllRead = useCallback(async () => {
    console.log("[useNotifications] Marking all as read")
    const previous = notifications
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    try {
      await markAllReadService()
      console.log("[useNotifications] Mark all as read success")
      return true
    } catch (err) {
      setNotifications(previous)
      console.error("[useNotifications] Mark all as read failed:", err)
      return false
    }
  }, [notifications])

  const deleteNotificationById = useCallback(async (id: number) => {
    const previous = notifications
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    try {
      await removeNotification(id)
      console.log("[useNotifications] Delete success:", id)
      return true
    } catch (err) {
      setNotifications(previous)
      console.error("[useNotifications] Delete failed:", err)
      return false
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
    deleteNotification: deleteNotificationById,
  }
}
