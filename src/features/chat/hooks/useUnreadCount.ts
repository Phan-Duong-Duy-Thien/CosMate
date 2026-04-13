import { useState, useEffect, useCallback, useRef } from "react"
import { getUnreadCountService } from "../services/chat.service"

interface UseUnreadCountResult {
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Module-level ref — all instances share the same unread count so that
// refetch() from any component updates the header badge correctly.
let countRef: { value: number } | null = null

export function useUnreadCount(userId: number | null): UseUnreadCountResult {
  // Seed module ref once
  if (!countRef) {
    countRef = { value: 0 }
  }

  const [version, setVersion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bump = useCallback(() => setVersion((v) => v + 1), [])

  const fetch = useCallback(async () => {
    if (userId === null) return
    setLoading(true)
    setError(null)
    try {
      const count = await getUnreadCountService(userId)
      if (countRef) countRef.value = count ?? 0
      bump()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load unread count")
    } finally {
      setLoading(false)
    }
  }, [userId, bump])

  useEffect(() => {
    fetch()
  }, [fetch])

  // Stable refetch — updates module-level count so all instances re-render
  const refetch = useCallback(() => {
    fetch()
  }, [fetch])

  // Expose module-level value so all instances stay in sync
  const unreadCount = countRef ? countRef.value : 0

  return { unreadCount, loading, error, refetch }
}