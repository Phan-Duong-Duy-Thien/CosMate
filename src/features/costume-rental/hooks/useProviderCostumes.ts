/**
 * useProviderCostumes
 *
 * Manages state for the Provider "My Costumes" list page.
 *
 * Data flow: Hook → API → axiosInstance
 * - Loads costume list using providerId from JWT (via existing tokenStorage pattern)
 * - Loads detail on demand (GET /api/costumes/{id}) when user clicks "View Detail"
 * - Manages modal open/close state
 */

import { useState, useEffect, useCallback, useRef }from 'react'
import { message }from 'antd'
import { getCostumesByProvider, getCostumeById } from '../api/costumeRental.api'
import type { Costume } from '../types'

/** Read providerId from JWT payload (same pattern as useCreateCostumeWizard) */
function getProviderIdFromToken(): number | null {
  const token = localStorage.getItem('cosmate_access_token')
  if (!token) return null
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json) as Record<string, unknown>
    if (typeof payload.providerId === 'number') return payload.providerId
    return null
  } catch {
    return null
  }
}

export function useProviderCostumes() {
  // ── List state ────────────────────────────────────────────────────────────
  const [costumes, setCostumes] = useState<Costume[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Detail / modal state ──────────────────────────────────────────────────
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const detailRequestIdRef = useRef(0)

  // Resolved once on mount; if null the UI shows an error and skips the API call
  const providerId = getProviderIdFromToken()

  /**
   * Fetch the provider's costume list.
   * Called on mount and exposed as `refetch` for manual refresh.
   */
  const fetchCostumes = useCallback(async () => {
    if (providerId === null) {
      setError('Không tìm thấy providerId trong token. Vui lòng đăng nhập lại.')
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      const res = await getCostumesByProvider(providerId)
      setCostumes(res.result ?? [])
    }catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách trang phục.'
      setError(msg)
      message.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [providerId])

  useEffect(() => {
    fetchCostumes()
  }, [fetchCostumes])

  /**
   * Open detail modal and fetch full costume data by id.
   * Uses a stale-request guard so rapid clicks don't show wrong data.
   */
  const openDetail = useCallback((costumeId: number) => {
    setSelectedCostume(null)
    setModalOpen(true)
    const requestId = ++detailRequestIdRef.current
    setDetailLoading(true)
    getCostumeById(costumeId)
      .then((res) => {
        if (requestId === detailRequestIdRef.current) {
          setSelectedCostume(res.result)
        }
      })
      .catch((err) => {
        if (requestId === detailRequestIdRef.current) {
          message.error(err instanceof Error ? err.message : 'Không thể tải chi tiết trang phục.')
        }
      })
      .finally(() => {
        if (requestId === detailRequestIdRef.current) {
          setDetailLoading(false)
        }
      })
  }, [])

  const closeDetail = useCallback(() => {
    setModalOpen(false)
    setSelectedCostume(null)
    setDetailLoading(false)
  }, [])

  return {
    // List
    costumes,
    isLoading,
    error,
    providerId,
    refetch: fetchCostumes,

    // Detail modal
    modalOpen,
    selectedCostume,
    detailLoading,
    openDetail,
    closeDetail,
  }
}
