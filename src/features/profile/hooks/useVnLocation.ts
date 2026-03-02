import { useEffect, useState } from "react"
import { VI } from "@/shared/i18n/vi"
import type { Province, District } from "../types"
import * as vnLocationApi from "../api/vnLocation.api"

export function useVnLocation() {
  const [provinceCode, setProvinceCode] = useState<number | null>(null)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true)
        setError(null)
        const data = await vnLocationApi.fetchProvinces()
        setProvinces(data)
      } catch {
        setError(VI.profile.address.messages.saveError)
      } finally {
        setLoadingProvinces(false)
      }
    }

    void loadProvinces()
  }, [])

  useEffect(() => {
    const loadDistricts = async () => {
      if (provinceCode == null) {
        setDistricts([])
        return
      }

      try {
        setLoadingDistricts(true)
        setError(null)
        const data = await vnLocationApi.fetchDistricts(provinceCode)
        setDistricts(data)
      } catch {
        setError(VI.profile.address.messages.saveError)
      } finally {
        setLoadingDistricts(false)
      }
    }

    void loadDistricts()
  }, [provinceCode])

  return {
    provinceCode,
    setProvinceCode,
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
    error,
  }
}
