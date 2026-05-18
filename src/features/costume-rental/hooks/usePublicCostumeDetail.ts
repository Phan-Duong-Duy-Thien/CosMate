/**
 * usePublicCostumeDetail
 *
 * Fetches GET /api/costumes/{id} and manages all selection state
 * for the public costume detail / rent page.
 *
 * Data flow: Hook -> API -> axiosInstance
 * No JSX. No direct API calls from page or components.
 */

import { useState, useEffect, useCallback, useMemo } from "react"
import { getCostumeById } from "../api/costume.api"
import type { Costume, QuoteBreakdown } from "../types"
import { resolveCostumeImageUrl } from "../utils/resolveCostumeImageUrl"

export function resolveImageUrl(url: string): string {
  return resolveCostumeImageUrl(url)
}

export function usePublicCostumeDetail(costumeId: string | undefined) {
  const [costume, setCostume] = useState<Costume | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState(1)
  const [startDate, setStartDate] = useState("")
  const [selectedRentalOptionId, setSelectedRentalOptionId] = useState<number | null>(null)
  const [checkedOptionalIds, setCheckedOptionalIds] = useState<Set<number>>(new Set())

  const fetchDetail = useCallback(async () => {
    if (!costumeId) return
    const numId = Number(costumeId)
    if (isNaN(numId)) {
      setError("ID trang phuc khong hop le.")
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCostumeById(numId)
      setCostume(data)
      const firstOption = data.rentalOptions?.[0] ?? null
      setSelectedRentalOptionId(firstOption?.id ?? null)
      setCheckedOptionalIds(new Set())
      setDays(1)
      setStartDate("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong the tai chi tiet trang phuc.")
    } finally {
      setIsLoading(false)
    }
  }, [costumeId])

  useEffect(() => { fetchDetail() }, [fetchDetail])

  const resolvedImages = useMemo(
    () => (costume?.imageUrls ?? []).map(resolveImageUrl).filter(Boolean),
    [costume],
  )

  const toggleOptionalAccessory = useCallback((id: number) => {
    setCheckedOptionalIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }, [])

  const quote = useMemo<QuoteBreakdown>(() => {
    if (!costume) {
      return { rentalPrice: 0, accessoryTotal: 0, surchargesTotal: 0, rentalOptionPrice: 0, deposit: 0, laundryFee: 0, total: 0 }
    }
    const baseDaily = costume.pricePerDay ?? 0
    const deposit = costume.depositAmount ?? 0
    const requiredSum = (costume.accessories ?? []).filter((a) => a.isRequired).reduce((sum, a) => sum + (a.price ?? 0), 0)
    const optionalSum = (costume.accessories ?? []).filter((a) => !a.isRequired && checkedOptionalIds.has(a.id)).reduce((sum, a) => sum + (a.price ?? 0), 0)
    const accessoryTotal = requiredSum + optionalSum
    const surchargesTotal = (costume.surcharges ?? []).reduce((sum, s) => sum + (s.price ?? 0), 0)
    const rentalPrice = baseDaily * days
    const total = rentalPrice + deposit + accessoryTotal + surchargesTotal
    return { rentalPrice, accessoryTotal, surchargesTotal, rentalOptionPrice: 0, deposit, laundryFee: 0, total }
  }, [costume, days, checkedOptionalIds])

  return {
    costume, isLoading, error, resolvedImages,
    days, setDays, startDate, setStartDate,
    selectedRentalOptionId, setSelectedRentalOptionId,
    checkedOptionalIds, toggleOptionalAccessory,
    quote, refetch: fetchDetail,
  }
}
