import { useState, useCallback } from 'react'
import { message } from 'antd'
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../services/wishlist.service'
import { getUserId } from '@/features/auth/services/tokenStorage'
import type { WishlistItem } from '../types'

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchWishlist = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    setLoading(true)
    try {
      const response = await getWishlist(userId)
      setWishlistItems(response.result ?? [])
    } catch (err) {
      console.error('[useWishlist] fetchWishlist error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addToWishlistHandler = useCallback(async (costumeId: number) => {
    const userId = getUserId()
    if (!userId) {
      message.warning('Please log in to add to wishlist.')
      return
    }

    setLoading(true)
    try {
      await addToWishlist(userId, costumeId)
      message.success('Added to wishlist!')
      await fetchWishlist()
    } catch (err) {
      console.error('[useWishlist] addToWishlist error:', err)
      message.error('Failed to add to wishlist.')
    } finally {
      setLoading(false)
    }
  }, [fetchWishlist])

  const removeFromWishlistHandler = useCallback(
    async (wishlistId: number) => {
      const userId = getUserId()
      if (!userId) {
        message.warning('Please log in to manage wishlist.')
        return
      }

      // Optimistic update — remove immediately from UI
      setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId))

      try {
        await removeFromWishlist(userId, wishlistId)
        message.success('Removed from wishlist.')
      } catch (err) {
        // Revert on failure
        console.error('[useWishlist] removeFromWishlist error:', err)
        message.error('Failed to remove from wishlist.')
        await fetchWishlist()
      }
    },
    [fetchWishlist]
  )

  return {
    wishlistItems,
    fetchWishlist,
    addToWishlist: addToWishlistHandler,
    removeFromWishlist: removeFromWishlistHandler,
    loading,
  }
}