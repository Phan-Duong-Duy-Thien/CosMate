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
import { useDataSyncRefetch } from '@/shared/hooks/useDataSyncRefetch'
import { scheduleBackgroundRefetch } from '@/shared/sync/pendingListMerge'
import { DATA_SYNC_EVENTS, notifyCostumesChanged } from '@/shared/sync/dataSync'
import { message }from 'antd'
import { getCostumesByProvider, getCostumeById, deleteCostume } from '../api/costumeRental.api'
import type { Costume, CostumeStatus } from '../types'
import { getUserId } from '@/features/auth/services/tokenStorage'
import { getProviderByUserId } from '@/features/provider/api/provider.api'

export type CostumeSortKey = 'name' | 'pricePerDay' | 'status' | 'createdAt'
export type SortOrder = 'asc' | 'desc'

export function useProviderCostumes() {
  // ── List state ────────────────────────────────────────────────────────────
  const [costumes, setCostumes] = useState<Costume[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Sort / Filter state ────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<CostumeSortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<CostumeStatus | 'ALL'>('ALL')

  // ── Derived: filtered + sorted costumes ────────────────────────────────────
  const filteredCostumes = [...costumes]
    .filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false
      if (searchText) {
        const q = searchText.toLowerCase()
        return c.name.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'pricePerDay') cmp = a.pricePerDay - b.pricePerDay
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status)
      return sortOrder === 'asc' ? cmp : -cmp
    })

  // ── Detail / modal state ──────────────────────────────────────────────────
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const detailRequestIdRef = useRef(0)

  const [providerId, setProviderId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  /**
   * Fetch the provider's costume list.
   * Called on mount and exposed as `refetch` for manual refresh.
   */
  const fetchCostumes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      let resolvedProviderId = providerId
      if (resolvedProviderId === null) {
        const userId = getUserId()
        if (!userId) {
          setError('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.')
          return
        }
        const provider = await getProviderByUserId(userId)
        resolvedProviderId = provider?.id ?? null
        setProviderId(resolvedProviderId)
      }

      if (resolvedProviderId === null) {
        setError('Không tìm thấy hồ sơ provider. Vui lòng hoàn tất hồ sơ provider.')
        return
      }

      const res = await getCostumesByProvider(resolvedProviderId)
      const visible = (res.result ?? []).filter((c) => c.status !== 'DELETED')
      setCostumes(visible)
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

  useDataSyncRefetch(fetchCostumes, DATA_SYNC_EVENTS.COSTUMES_CHANGED, Boolean(providerId))

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

  const removeCostume = useCallback(
    async (costumeId: number): Promise<boolean> => {
      try {
        setDeletingId(costumeId)
        await deleteCostume(costumeId)
        message.success('Đã xóa trang phục')
        if (selectedCostume?.id === costumeId) {
          closeDetail()
        }
        setCostumes((prev) => prev.filter((c) => c.id !== costumeId))
        notifyCostumesChanged({ costumeId })
        scheduleBackgroundRefetch(() => fetchCostumes())
        return true
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Không thể xóa trang phục.'
        message.error(msg)
        return false
      } finally {
        setDeletingId(null)
      }
    },
    [fetchCostumes, selectedCostume?.id, closeDetail],
  )

  return {
    // List
    costumes,
    filteredCostumes,
    isLoading,
    error,
    providerId,
    refetch: fetchCostumes,

    // Sort/filter
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,

    // Detail modal
    modalOpen,
    selectedCostume,
    detailLoading,
    openDetail,
    closeDetail,

    deletingId,
    removeCostume,
  }
}
