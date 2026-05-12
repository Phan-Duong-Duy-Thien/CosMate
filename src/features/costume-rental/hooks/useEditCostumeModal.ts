/**
 * useEditCostumeModal
 *
 * Manages all state for the Edit Costume modal.
 *
 * Data flow: Hook → Service → API → axiosInstance
 * - Fetches costume detail for prefill (GET /api/costumes/{id})
 * - Submits basic info update (PUT /api/costumes/{id})
 * - Submits surcharge update (PUT /api/surcharges/{id})
 * - Submits rental option update (PUT /api/rental-options/{id})
 * - Submits accessory create/update (POST/PUT /api/accessories)
 * - Calls onSuccess callback so the list page can refetch
 */

import { useState, useCallback, useRef } from 'react'
import { message } from 'antd'
import { generateCostumeDescriptionByAI, getCostumeById } from '../api/costumeRental.api'
import {
  updateCostumeBasic,
  updateSurcharge,
  updateRentalOption,
  createSurchargeService,
  createRentalOptionService,
  createAccessoryService,
  updateAccessoryService,
} from '../services/costumeRental.service'
import { canAddRentalOption, canAddAccessory } from '../services/validateCostumeConstraints'
import type {
  Costume,
  UpdateCostumeBasicInput,
  SurchargeUpdateInput,
  RentalOptionUpdateInput,
  SurchargeInput,
  RentalOptionInput,
  AccessoryInput,
  AccessoryUpdateInput,
} from '../types'
import { VI } from '@/shared/i18n/vi'
import { useCostumeImages } from './useCostumeImages'
import { useCostumeImageActions } from './useCostumeImageActions'

async function imageUrlToFile(url: string, filename: string): Promise<File | null> {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], filename, { type: blob.type || 'image/jpeg' })
  } catch {
    return null
  }
}

/** Read providerId from JWT payload – same pattern as useCreateCostumeWizard */
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

interface UseEditCostumeModalOptions {
  /** Called after a successful basic-info update so the list can refetch */
  onSuccess?: () => void
}

export function useEditCostumeModal({ onSuccess }: UseEditCostumeModalOptions = {}) {
  // ── Modal open/close ──────────────────────────────────────────────────────
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  // ── Detail / prefill ──────────────────────────────────────────────────────
  const [detail, setDetail] = useState<Costume | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const detailRequestIdRef = useRef(0)

  // ── Submit states ─────────────────────────────────────────────────────────
  const [basicSubmitting, setBasicSubmitting] = useState(false)
  const [surchargeSubmitting, setSurchargeSubmitting] = useState(false)
  const [rentalOptionSubmitting, setRentalOptionSubmitting] = useState(false)
  const [accessorySubmitting, setAccessorySubmitting] = useState(false)

  // ── Create/Edit modal states ─────────────────────────────────────────────
  const [createSurchargeModalOpen, setCreateSurchargeModalOpen] = useState(false)
  const [createRentalOptionModalOpen, setCreateRentalOptionModalOpen] = useState(false)
  const [createAccessoryModalOpen, setCreateAccessoryModalOpen] = useState(false)
  const [descriptionPrompt, setDescriptionPrompt] = useState('')
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

  const providerId = getProviderIdFromToken()

  /**
   * Open the modal and fetch detail for prefill.
   */
  const openModal = useCallback((costumeId: number) => {
    setEditingId(costumeId)
    setDetail(null)
    setOpen(true)

    const requestId = ++detailRequestIdRef.current
    setDetailLoading(true)

    getCostumeById(costumeId)
      .then((res) => {
        if (requestId === detailRequestIdRef.current) {
          setDetail(res.result)
        }
      })
      .catch((err) => {
        if (requestId === detailRequestIdRef.current) {
          message.error(
            err instanceof Error ? err.message : 'Không thể tải chi tiết trang phục.',
          )
        }
      })
      .finally(() => {
        if (requestId === detailRequestIdRef.current) {
          setDetailLoading(false)
        }
      })
  }, [])

  const closeModal = useCallback(() => {
    setOpen(false)
    setEditingId(null)
    setDetail(null)
    setDetailLoading(false)
    setDescriptionPrompt('')
    setIsGeneratingDescription(false)
  }, [])

  /**
   * Submit basic info update (PUT /api/costumes/{id}).
   * providerId is taken from JWT – never from form input.
   */
  const submitBasicInfo = useCallback(
    async (values: UpdateCostumeBasicInput) => {
      if (!editingId) return
      if (providerId === null) {
        message.error('Không tìm thấy providerId. Vui lòng đăng nhập lại.')
        return
      }
      setBasicSubmitting(true)
      try {
        await updateCostumeBasic(editingId, values, providerId)
        message.success('Cập nhật thông tin cơ bản thành công!')
        // Refresh detail so the form reflects the saved state
        const res = await getCostumeById(editingId)
        setDetail(res.result)
        // Notify list page to refetch
        onSuccess?.()
      }catch (err) {
        message.error(
          err instanceof Error ? err.message : 'Cập nhật thất bại. Vui lòng thử lại.',
        )
      } finally {
        setBasicSubmitting(false)
      }
    },
    [editingId, providerId, onSuccess],
  )

  /**
   * Submit surcharge update (PUT /api/surcharges/{id}).
   * Immediately fires on modal OK – no batch needed.
   */
  const submitSurchargeUpdate = useCallback(
    async (surchargeId: number, values: SurchargeUpdateInput) => {
      setSurchargeSubmitting(true)
      try {
        await updateSurcharge(surchargeId, values)
        message.success('Cập nhật phụ phí thành công!')
        // Refresh detail to reflect saved surcharge
        if (editingId) {
          const res = await getCostumeById(editingId)
          setDetail(res.result)
        }
      }catch (err) {
        message.error(
          err instanceof Error ? err.message : 'Cập nhật phụ phí thất bại.',
        )
      } finally {
        setSurchargeSubmitting(false)
      }
    },
    [editingId],
  )

  /**
   * Submit rental option update (PUT /api/rental-options/{id}).
   */
  const submitRentalOptionUpdate = useCallback(
    async (rentalOptionId: number, values: RentalOptionUpdateInput) => {
      setRentalOptionSubmitting(true)
      try {
        await updateRentalOption(rentalOptionId, values)
        message.success('Cập nhật gói thuê thành công!')
        if (editingId) {
          const res = await getCostumeById(editingId)
          setDetail(res.result)
        }
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : 'Cập nhật gói thuê thất bại.',
        )
      }finally {
        setRentalOptionSubmitting(false)
      }
    },
    [editingId],
  )

  /**
   * Create a new surcharge (POST /api/surcharges/costume/{costumeId}).
   */
  const handleCreateSurcharge = useCallback(
    async (values: SurchargeInput) => {
      if (!editingId) return
      setSurchargeSubmitting(true)
      try {
        const updatedDetail = await createSurchargeService(editingId, values)
        setDetail(updatedDetail)
        setCreateSurchargeModalOpen(false)
        message.success(VI.costumeRental.surcharges.createSuccess)
        onSuccess?.()
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : VI.costumeRental.surcharges.createError,
        )
      } finally {
        setSurchargeSubmitting(false)
      }
    },
    [editingId, onSuccess],
  )

  /**
   * Create a new rental option (POST /api/rental-options/costume/{costumeId}).
   */
  const handleCreateRentalOption = useCallback(
    async (values: RentalOptionInput) => {
      if (!editingId) return
      const currentCount = detail?.rentalOptions?.length ?? 0
      if (!canAddRentalOption(currentCount)) {
        message.error(VI.costumeRental.rentalOptions.maxFourReached)
        return
      }
      setRentalOptionSubmitting(true)
      try {
        const updatedDetail = await createRentalOptionService(editingId, values)
        setDetail(updatedDetail)
        setCreateRentalOptionModalOpen(false)
        message.success(VI.costumeRental.rentalOptions.createSuccess)
        onSuccess?.()
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : VI.costumeRental.rentalOptions.createError,
        )
      } finally {
        setRentalOptionSubmitting(false)
      }
    },
    [editingId, onSuccess],
  )

  /**
   * Create a new accessory (POST /api/accessories/costume/{costumeId}).
   */
  const handleCreateAccessory = useCallback(
    async (values: AccessoryInput) => {
      if (!editingId) return
      const currentCount = detail?.accessories?.length ?? 0
      const numberOfItems = detail?.numberOfItems ?? 1
      if (!canAddAccessory(currentCount, numberOfItems)) {
        message.error(VI.costumeRental.accessories.reachedMaxItems)
        return
      }
      setAccessorySubmitting(true)
      try {
        const updatedDetail = await createAccessoryService(editingId, values)
        setDetail(updatedDetail)
        setCreateAccessoryModalOpen(false)
        message.success(VI.costumeRental.accessories.createSuccess)
        onSuccess?.()
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : VI.costumeRental.accessories.createError,
        )
      } finally {
        setAccessorySubmitting(false)
      }
    },
    [editingId, onSuccess],
  )

  /**
   * Update an existing accessory (PUT /api/accessories/{id}).
   */
  const handleUpdateAccessory = useCallback(
    async (accessoryId: number, values: AccessoryUpdateInput) => {
      if (!editingId) return
      setAccessorySubmitting(true)
      try {
        const updatedDetail = await updateAccessoryService(accessoryId, values, editingId)
        setDetail(updatedDetail)
        message.success(VI.costumeRental.accessories.updateSuccess)
        onSuccess?.()
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : VI.costumeRental.accessories.updateError,
        )
      } finally {
        setAccessorySubmitting(false)
      }
    },
    [editingId, onSuccess],
  )

  // ── Image hooks ───────────────────────────────────────────────────────────
  const {
    mainImages,
    detailImages,
    allImages,
    loading: imagesLoading,
    error: imagesError,
    refetch: refetchImages,
  } = useCostumeImages(editingId)

  const imageHooks = useCostumeImageActions({
    costumeId: editingId,
    mainImages,
    refetch: refetchImages,
  })

  const onGenerateDescription = useCallback(async () => {
    if (!detail?.name?.trim()) {
      message.warning('Vui lòng nhập tên trang phục trước khi dùng AI.')
      return
    }
    const refUrl = mainImages[0]?.url ?? detailImages[0]?.url
    if (!refUrl) {
      message.warning('Cần có ít nhất một ảnh (tab Ảnh) để AI tham chiếu.')
      return
    }
    setIsGeneratingDescription(true)
    try {
      const file = await imageUrlToFile(refUrl, 'costume-ai-ref.jpg')
      if (!file) {
        message.error('Không tải được ảnh. Thử kiểm tra đường dẫn ảnh.')
        return
      }
      const ai = await generateCostumeDescriptionByAI(detail.name, [file], descriptionPrompt.trim())
      if (ai.trim()) {
        setDetail((prev) => (prev ? { ...prev, description: ai.trim() } : null))
        message.success('Đã tạo mô tả. Nhớ bấm cập nhật để lưu!')
      } else {
        message.warning('AI chưa trả về mô tả. Vui lòng thử lại.')
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Không thể tạo mô tả AI.')
    } finally {
      setIsGeneratingDescription(false)
    }
  }, [detail, mainImages, detailImages, descriptionPrompt])

  return {
    // Modal state
    open,
    editingId,
    openModal,
    closeModal,

    // Detail / prefill
    detail,
    detailLoading,
    providerId,

    // Submit handlers
    submitBasicInfo,
    basicSubmitting,
    submitSurchargeUpdate,
    surchargeSubmitting,
    submitRentalOptionUpdate,
    rentalOptionSubmitting,

    // Surcharge create modal
    createSurchargeModalOpen,
    setCreateSurchargeModalOpen,
    handleCreateSurcharge,

    // Rental option create modal
    createRentalOptionModalOpen,
    setCreateRentalOptionModalOpen,
    handleCreateRentalOption,

    // Accessory handlers
    accessorySubmitting,
    createAccessoryModalOpen,
    setCreateAccessoryModalOpen,
    handleCreateAccessory,
    handleUpdateAccessory,

    // AI description (EditCostumeModal)
    descriptionPrompt,
    setDescriptionPrompt,
    isGeneratingDescription,
    onGenerateDescription,

    // Image hooks
    mainImages,
    detailImages,
    allImages,
    imagesLoading,
    imagesError,
    refetchImages,
    ...imageHooks,
  }
}
