/**
 * useCreateCostumeWizard
 *
 * Manages all state for the 2-phase create-costume wizard.
 * Delegates API orchestration to costumeRental.service.
 */

import { useState } from 'react'
import { message } from 'antd'
import axios from 'axios'
import {
  submitPhase1,
  createSurchargeService,
  createAccessoryService,
  updateAccessoryService,
} from '../services/costumeRental.service'
import {
  getCostumeById,
  updateSurcharge as updateSurchargeApi,
  deleteSurcharge,
  deleteAccessory,
} from '../api/costumeRental.api'
import { validateAccessories } from '../services/validateCostumeConstraints'
import { VI } from '@/shared/i18n/vi'
import { getUserId } from '@/features/auth/services/tokenStorage'
import { getProviderByUserId } from '@/features/provider/api/provider.api'
import type {
  CreateCostumeBasicPayload,
  SurchargeInput,
  AccessoryInput,
  RentalOptionInput,
  CostumeSurcharge,
  CostumeAccessory,
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
  surcharges: CostumeSurcharge[]
  accessories: CostumeAccessory[]
  rentalOptions: RentalOptionInput[]
  handlePhase1Submit: (
    values: Omit<CreateCostumeBasicPayload, 'providerId'> & { imageFiles: File[] },
  ) => Promise<void>
  addSurcharge: (item: SurchargeInput) => Promise<void>
  updateSurcharge: (id: number, item: SurchargeInput) => Promise<void>
  removeSurcharge: (id: number) => Promise<void>
  addAccessory: (item: AccessoryInput) => Promise<void>
  updateAccessory: (id: number, item: AccessoryInput) => Promise<void>
  removeAccessory: (id: number) => Promise<void>
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

  const [surcharges, setSurcharges] = useState<CostumeSurcharge[]>([])
  const [accessories, setAccessories] = useState<CostumeAccessory[]>([])
  const [rentalOptions, setRentalOptions] = useState<RentalOptionInput[]>([])

  const syncCostumeState = async (id: number) => {
    try {
      const res = await getCostumeById(id)
      setSurcharges(res.result.surcharges ?? [])
      setAccessories(res.result.accessories ?? [])
    } catch (err) {
      console.error('Failed to sync costume supplementary data:', err)
    }
  }

  const handlePhase1Submit = async (
    values: Omit<CreateCostumeBasicPayload, 'providerId'> & { imageFiles: File[] },
  ) => {
    setPhase1Error(null)
    const providerId = await resolveProviderIdForCurrentUser()
    if (providerId === null) {
      setPhase1Error('Không tìm thấy provider profile. Vui lòng đăng nhập lại.')
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
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : 'Tạo trang phục thất bại.'
      const responseMessage = axios.isAxiosError(err)
        ? ((err.response?.data as { message?: string } | undefined)?.message ?? '')
        : ''
      const combinedMessage = `${rawMessage} ${responseMessage}`.trim()
      const normalized =
        combinedMessage.includes('vi phạm tiêu chuẩn cộng đồng') ||
        combinedMessage.includes('Read timed out') ||
        combinedMessage.includes('Lỗi kiểm duyệt ảnh')
          ? 'Ảnh của bạn vi phạm tiêu chuẩn cộng đồng, xin hãy dùng ảnh khác'
          : rawMessage
      setPhase1Error(normalized)
      throw new Error(normalized)
    } finally {
      setIsPhase1Loading(false)
    }
  }

  const handlePhase2Submit = async () => {
    if (costumeId === null || typeof costumeId !== 'number') {
      const errMsg = 'Thiếu costumeId. Vui lòng hoàn thành bước 1 trước.'
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
      const accResult = validateAccessories(accessories, numberOfItems)
      if (!accResult.valid) {
        const msg = VI.costumeRental.accessories.reachedMaxItems
        setPhase2Error(msg)
        message.error(msg)
        throw new Error(msg)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lưu thông tin bổ sung thất bại.'
      setPhase2Error(msg)
      throw err
    } finally {
      setIsPhase2Loading(false)
    }
  }

  const addSurcharge = async (item: SurchargeInput) => {
    if (!costumeId) return
    setIsPhase2Loading(true)
    try {
      const updatedCostume = await createSurchargeService(costumeId, item)
      setSurcharges(updatedCostume.surcharges ?? [])
      message.success('Thêm phụ phí thành công!')
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Thêm phụ phí thất bại.')
    } finally {
      setIsPhase2Loading(false)
    }
  }

  const updateSurcharge = async (id: number, item: SurchargeInput) => {
    if (!costumeId) return
    setIsPhase2Loading(true)
    try {
      await updateSurchargeApi(id, item)
      message.success('Cập nhật phụ phí thành công!')
      await syncCostumeState(costumeId)
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Cập nhật phụ phí thất bại.')
    } finally {
      setIsPhase2Loading(false)
    }
  }

  const removeSurcharge = async (id: number) => {
    if (!costumeId) return
    setIsPhase2Loading(true)
    try {
      await deleteSurcharge(id)
      message.success('Xóa phụ phí thành công!')
      await syncCostumeState(costumeId)
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Xóa phụ phí thất bại.')
    } finally {
      setIsPhase2Loading(false)
    }
  }

  const addAccessory = async (item: AccessoryInput) => {
    if (!costumeId) return
    setIsPhase2Loading(true)
    try {
      const updatedCostume = await createAccessoryService(costumeId, item)
      setAccessories(updatedCostume.accessories ?? [])
      message.success('Thêm phụ kiện thành công!')
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Thêm phụ kiện thất bại.')
    } finally {
      setIsPhase2Loading(false)
    }
  }

  const updateAccessory = async (id: number, item: AccessoryInput) => {
    if (!costumeId) return
    setIsPhase2Loading(true)
    try {
      await updateAccessoryService(id, item, costumeId)
      message.success('Cập nhật phụ kiện thành công!')
      await syncCostumeState(costumeId)
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Cập nhật phụ kiện thất bại.')
    } finally {
      setIsPhase2Loading(false)
    }
  }

  const removeAccessory = async (id: number) => {
    if (!costumeId) return
    setIsPhase2Loading(true)
    try {
      await deleteAccessory(id)
      message.success('Xóa phụ kiện thành công!')
      await syncCostumeState(costumeId)
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Xóa phụ kiện thất bại.')
    } finally {
      setIsPhase2Loading(false)
    }
  }

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
