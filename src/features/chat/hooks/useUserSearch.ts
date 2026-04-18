import { useState, useEffect } from "react"
import { searchUsersService } from "../services/user.service"
import type { SearchUserResult } from "../services/user.service"

interface UseUserSearchResult {
  users: SearchUserResult[]
  loading: boolean
  error: string | null
}

export function useUserSearch(keyword: string): UseUserSearchResult {
  const [users, setUsers] = useState<SearchUserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword)

  // Debounce 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
    }, 300)
    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    const trimmed = debouncedKeyword.trim()
    if (!trimmed) {
      setUsers([])
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    searchUsersService(trimmed)
      .then((data) => {
        if (!cancelled) {
          console.log("[SEARCH USERS]", trimmed)
          setUsers(data)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Search failed"
          console.error("[SEARCH USERS] error:", msg)
          setError(msg)
          setUsers([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedKeyword])

  return { users, loading, error }
}
