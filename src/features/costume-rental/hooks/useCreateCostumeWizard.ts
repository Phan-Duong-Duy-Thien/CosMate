/**
 * useCreateCostumeWizard
 *
 * Manages all state for the 2-phase create-costume wizard.
 * Delegates API orchestration to costumeRental.service.
 */

import { useState } from 'react'
import { message } from 'antd'
import { submitPhase1, submitPhase2Batch } from '../services/costumeRental.service'
import type {
  CreateCostumeBasicPayload,
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
} from '../types'

interface JwtPayload {
  providerId?: number
  [key: string]: unknown
}

/** Decode JWT payload without a library dependency */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as JwtPayload
  }catch {
    return null
  }
}

function getProviderIdFromToken(): number | null {
  const token = localStorage.getItem('cosmate_access_token')
  if (!token) return null
  const payload = decodeJwtPayload(token)
  return payload?.providerId ?? null
}

export interface UseCreateCostumeWizardReturn {
  phase: 1 | 2
  costumeId: number | null
  isPhase1Loading: boolean
  isPhase2Loading: boolean
  phase1Error: string | null
  phase2Error: string | null
  surcharges: SurchargeInput[]
  accessories: AccessoryInput[]
  rentalOptions: RentalOptionInput[]
  handlePhase1Submit: (
    values: Omit<CreateCostumeBasicPayload, 'providerId'> & { imageFiles: File[] },
  ) => Promise<void>
  addSurcharge: (item: SurchargeInput) => void
  updateSurcharge: (index: number, item: SurchargeInput) => void
  removeSurcharge: (index: number) => void
  addAccessory: (item: AccessoryInput) => void
  updateAccessory: (index: number, item: AccessoryInput) => void
  removeAccessory: (index: number) => void
  addRentalOption: (item: RentalOptionInput) => void
  updateRentalOption: (index: number, item: RentalOptionInput) => void
  removeRentalOption: (index: number) => void
  handlePhase2Submit: () => Promise<void>
}

export function useCreateCostumeWizard(): UseCreateCostumeWizardReturn {
  const [phase, setPhase] = useState<1 | 2>(1)
  const [costumeId, setCostumeId] = useState<number | null>(null)
  const [isPhase1Loading, setIsPhase1Loading] = useState(false)
  const [isPhase2Loading, setIsPhase2Loading] = useState(false)
  const [phase1Error, setPhase1Error] = useState<string | null>(null)
  const [phase2Error, setPhase2Error] = useState<string | null>(null)

  const [surcharges, setSurcharges] = useState<SurchargeInput[]>([])
  const [accessories, setAccessories] = useState<AccessoryInput[]>([])
  const [rentalOptions, setRentalOptions] = useState<RentalOptionInput[]>([])

  const handlePhase1Submit = async (
    values: Omit<CreateCostumeBasicPayload, 'providerId'> & { imageFiles: File[] },
  ) => {
    setPhase1Error(null)
    const providerId = getProviderIdFromToken()
    if (providerId === null) {
      setPhase1Error('Khong tim thay providerId trong token. Vui long dang nhap lai.')
      return
    }
    setIsPhase1Loading(true)
    try {
      const result = await submitPhase1({ ...values, providerId })
      if (import.meta.env.DEV) {
        console.log('[useCreateCostumeWizard] Phase 1 done. costumeId =', result.id)
      }
      setCostumeId(result.id)
      setPhase(2)
    }catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tao trang phuc that bai.'
      setPhase1Error(msg)
    }finally {
      setIsPhase1Loading(false)
    }
  }

  const handlePhase2Submit = async () => {
    // Guard: costumeId must be set by Phase 1 before Phase 2 can run
    if (costumeId === null || typeof costumeId !== 'number') {
      const errMsg = 'Thieu costumeId. Vui long hoan thanh buoc 1 truoc.'
      setPhase2Error(errMsg)
      message.error(errMsg)
      throw new Error(errMsg)
    }

    if (import.meta.env.DEV) {
      console.log('[useCreateCostumeWizard] Phase 2 submit. costumeId =', costumeId)
    }

    setPhase2Error(null)
    setIsPhase2Loading(true)
    try {
      await submitPhase2Batch(costumeId, { surcharges, accessories, rentalOptions })
    }catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Luu thong tin bo sung that bai.'
      setPhase2Error(msg)
      throw err
    } finally {
      setIsPhase2Loading(false)
    }
  }

  // Surcharge list helpers
  const addSurcharge = (item: SurchargeInput) => setSurcharges((p) => [...p, item])
  const updateSurcharge = (i: number, item: SurchargeInput) =>
    setSurcharges((p) => p.map((x, idx) => (idx === i ? item : x)))
  const removeSurcharge = (i: number) =>
    setSurcharges((p) => p.filter((_, idx) => idx !== i))

  // Accessory list helpers
  const addAccessory = (item: AccessoryInput) => setAccessories((p) => [...p, item])
  const updateAccessory = (i: number, item: AccessoryInput) =>
    setAccessories((p) => p.map((x, idx) => (idx === i ? item : x)))
  const removeAccessory = (i: number) =>
    setAccessories((p) => p.filter((_, idx) => idx !== i))

  // Rental option list helpers
  const addRentalOption = (item: RentalOptionInput) => setRentalOptions((p) => [...p, item])
  const updateRentalOption = (i: number, item: RentalOptionInput) =>
    setRentalOptions((p) => p.map((x, idx) => (idx === i ? item : x)))
  const removeRentalOption = (i: number) =>
    setRentalOptions((p) => p.filter((_, idx) => idx !== i))

  return {
    phase,
    costumeId,
    isPhase1Loading,
    isPhase2Loading,
    phase1Error,
    phase2Error,
    surcharges,
    accessories,
    rentalOptions,
    handlePhase1Submit,
    addSurcharge,
    updateSurcharge,
    removeSurcharge,
    addAccessory,
    updateAccessory,
    removeAccessory,
    addRentalOption,
    updateRentalOption,
    removeRentalOption,
    handlePhase2Submit,
  }
}
