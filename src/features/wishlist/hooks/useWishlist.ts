import { useState, useCallback, useEffect, useRef } from 'react'
import { message } from 'antd'
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../services/wishlist.service'
import { getUserId } from '@/features/auth/services/tokenStorage'
import { getAccessToken, isAuthenticated } from '@/features/auth/utils/authStorage'
import { VI } from '@/shared/i18n/vi'
import type { WishlistItem } from '../types'

const SUCCESS_DURATION = 2.5
const ERROR_DURATION = 3.5
const WARNING_DURATION = 3.5

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [wishlistMap, setWishlistMap] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const fetchCalled = useRef(false)

  // Build map from items
  const buildMap = useCallback((items: WishlistItem[]) => {
    const map: Record<number, boolean> = {}
    items.forEach((item) => {
      map[item.costumeId] = true
    })
    setWishlistMap(map)
  }, [])

  const fetchWishlist = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    setLoading(true)
    try {
      const response = await getWishlist(userId)
      const items = response.result ?? []
      setWishlistItems(items)
      buildMap(items)
      setIsLoaded(true)
    } catch {
      console.error('[useWishlist] fetchWishlist error')
      message.error({ content: VI.common.toast.wishlist.fetchFailed, duration: ERROR_DURATION })
    } finally {
      setLoading(false)
    }
  }, [buildMap])

  // Auto-fetch once when user is authenticated (guard against double-fetch)
  useEffect(() => {
    if (fetchCalled.current) return
    if (!isAuthenticated()) return

    fetchCalled.current = true
    fetchWishlist()
  }, [fetchWishlist])

  // Re-fetch when auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      const token = getAccessToken()
      if (token && !fetchCalled.current) {
        fetchCalled.current = true
        fetchWishlist()
      } else if (!token) {
        fetchCalled.current = false
        setWishlistItems([])
        setWishlistMap({})
        setIsLoaded(false)
      }
    }
    window.addEventListener('auth:changed', handleAuthChange)
    return () => window.removeEventListener('auth:changed', handleAuthChange)
  }, [fetchWishlist])

  const isInWishlist = useCallback(
    (costumeId: number): boolean => {
      return !!wishlistMap[costumeId]
    },
    [wishlistMap]
  )

  const addToWishlistHandler = useCallback(
    async (costumeId: number) => {
      const userId = getUserId()
      if (!userId) {
        message.warning({ content: VI.common.toast.wishlist.loginRequired, duration: WARNING_DURATION })
        return
      }

      // Optimistic update
      setWishlistMap((prev) => ({ ...prev, [costumeId]: true }))

      try {
        await addToWishlist(userId, costumeId)
        message.success({ content: VI.common.toast.wishlist.addSuccess, duration: SUCCESS_DURATION })
      } catch {
        // Rollback
        setWishlistMap((prev) => {
          const next = { ...prev }
          delete next[costumeId]
          return next
        })
        message.error({ content: VI.common.toast.wishlist.addFailed, duration: ERROR_DURATION })
      }
    },
    [fetchWishlist]
  )

  const removeFromWishlistHandler = useCallback(
    async (wishlistId: number) => {
      const userId = getUserId()
      if (!userId) {
        message.warning({ content: VI.common.toast.loginRequired, duration: WARNING_DURATION })
        return
      }

      // Find costumeId before optimistic remove
      const item = wishlistItems.find((w) => w.id === wishlistId)
      const costumeId = item?.costumeId

      // Optimistic update
      setWishlistItems((prev) => prev.filter((w) => w.id !== wishlistId))
      if (costumeId !== undefined) {
        setWishlistMap((prev) => {
          const next = { ...prev }
          delete next[costumeId]
          return next
        })
      }

      try {
        await removeFromWishlist(userId, wishlistId)
        message.success({ content: VI.common.toast.wishlist.removeSuccess, duration: SUCCESS_DURATION })
      } catch {
        // Revert
        console.error('[useWishlist] removeFromWishlist error')
        message.error({ content: VI.common.toast.wishlist.removeFailed, duration: ERROR_DURATION })
        await fetchWishlist()
      }
    },
    [fetchWishlist, wishlistItems]
  )

  return {
    wishlistItems,
    wishlistMap,
    isInWishlist,
    fetchWishlist,
    addToWishlist: addToWishlistHandler,
    removeFromWishlist: removeFromWishlistHandler,
    loading,
    isLoaded,
  }
}
