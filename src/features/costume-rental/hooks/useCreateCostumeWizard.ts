/**
 * useCreateCostumeWizard
 *
 * Manages all state for the 2-phase create-costume wizard.
 * Delegates API orchestration to costumeRental.service.
 */

import { useState } from 'react'
import { message } from 'antd'
import { submitPhase1, submitPhase2Batch } from '../services/costumeRental.service'
import { validateRentalOptions, validateAccessories } from '../services/validateCostumeConstraints'
import { VI } from '@/shared/i18n/vi'
import { getUserId } from '@/features/auth/services/tokenStorage'
import { getProviderByUserId } from '@/features/provider/api/provider.api'
import type {
  CreateCostumeBasicPayload,
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
} from '../types'

async function resolveProviderIdForCurrentUser(): Promise<number | null> {
  const userId = getUserId()
  if (!userId) return null
  try {
    const provider = await getProviderByUserId(userId)
    return provider?.id ?? null
  } catch {
    return null
  }
}

export interface UseCreateCostumeWizardReturn {
  phase: 1 | 2
  costumeId: number | null
  numberOfItems: number
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
  const [numberOfItems, setNumberOfItems] = useState<number>(1)
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
    const providerId = await resolveProviderIdForCurrentUser()
    if (providerId === null) {
      setPhase1Error('Khong tim thay provider profile. Vui long dang nhap lai.')
      return
    }
    setIsPhase1Loading(true)
    try {
      const result = await submitPhase1({ ...values, providerId })
      if (import.meta.env.DEV) {
        console.log('[useCreateCostumeWizard] Phase 1 done. costumeId =', result.id)
      }


      setCostumeId(result.id)
      setNumberOfItems(values.numberOfItems)
      setPhase(2)
    }catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tao trang phuc that bai.'
      setPhase1Error(msg)
    }finally {
      setIsPhase1Loading(false)
    }
  }

  const handlePhase2Submit = async () => {
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
      const roResult = validateRentalOptions(rentalOptions)
      if (!roResult.valid) {
        const msg = VI.costumeRental.rentalOptions[roResult.errorKey!.split('.').pop() as keyof typeof VI.costumeRental.rentalOptions] as string
        setPhase2Error(msg)
        message.error(msg)
        throw new Error(msg)
      }
      const accResult = validateAccessories(accessories, numberOfItems)
      if (!accResult.valid) {
        const msg = VI.costumeRental.accessories.reachedMaxItems
        setPhase2Error(msg)
        message.error(msg)
        throw new Error(msg)
      }
      await submitPhase2Batch(costumeId, { surcharges, accessories, rentalOptions })
    }catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Luu thong tin bo sung that bai.'
      setPhase2Error(msg)
      throw err
    } finally {
      setIsPhase2Loading(false)
    }
  }

  const addSurcharge = (item: SurchargeInput) => setSurcharges((p) => [...p, item])
  const updateSurcharge = (i: number, item: SurchargeInput) =>
    setSurcharges((p) => p.map((x, idx) => (idx === i ? item : x)))
  const removeSurcharge = (i: number) =>
    setSurcharges((p) => p.filter((_, idx) => idx !== i))

  const addAccessory = (item: AccessoryInput) => setAccessories((p) => [...p, item])
  const updateAccessory = (i: number, item: AccessoryInput) =>
    setAccessories((p) => p.map((x, idx) => (idx === i ? item : x)))
  const removeAccessory = (i: number) =>
    setAccessories((p) => p.filter((_, idx) => idx !== i))

  const addRentalOption = (item: RentalOptionInput) => setRentalOptions((p) => [...p, item])
  const updateRentalOption = (i: number, item: RentalOptionInput) =>
    setRentalOptions((p) => p.map((x, idx) => (idx === i ? item : x)))
  const removeRentalOption = (i: number) =>
    setRentalOptions((p) => p.filter((_, idx) => idx !== i))

  return {
    phase,
    costumeId,
    numberOfItems,
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
