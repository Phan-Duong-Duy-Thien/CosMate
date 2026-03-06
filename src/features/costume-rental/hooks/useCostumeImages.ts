/**
 * useCostumeImages
 *
 * Loads images for a costume from GET /api/images/costume/{costumeId}.
 * Exposes grouped MAIN/DETAIL lists, loading/error state, and refetch.
 */

import { useState, useEffect, useCallback } from 'react'
import { getCostumeImages, type CostumeImage } from '../api/costumeImages.api'

export interface UseCostumeImagesReturn {
  mainImages: CostumeImage[]
  detailImages: CostumeImage[]
  allImages: CostumeImage[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCostumeImages(costumeId: number | null): UseCostumeImagesReturn {
  const [allImages, setAllImages] = useState<CostumeImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (costumeId === null) return
    let cancelled = false
    setLoading(true)
    setError(null)
    getCostumeImages(costumeId)
      .then((imgs) => {
        if (!cancelled) setAllImages(imgs)
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Không thể tải ảnh trang phục.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [costumeId, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return {
    mainImages: allImages.filter((img) => img.type === 'MAIN'),
    detailImages: allImages.filter((img) => img.type === 'DETAIL'),
    allImages,
    loading,
    error,
    refetch,
  }
}
