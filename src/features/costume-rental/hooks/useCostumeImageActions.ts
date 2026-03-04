/**
 * useCostumeImageActions
 *
 * Exposes upload/replace/delete actions with per-action loading states.
 * All business rules (MAIN deletion guard, replace order) are enforced here.
 */

import { useState, useCallback } from 'react'
import { message } from 'antd'
import { deleteCostumeImage, uploadCostumeImage } from '../api/costumeImages.api'
import { replaceMain, replaceDetail } from '../services/costumeImages.service'
import { VI } from '@/shared/i18n/vi'
import type { CostumeImage } from '../api/costumeImages.api'

interface UseCostumeImageActionsOptions {
  costumeId: number | null
  mainImages: CostumeImage[]
  refetch: () => void
}

export function useCostumeImageActions({
  costumeId,
  mainImages,
  refetch,
}: UseCostumeImageActionsOptions) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [replacing, setReplacing] = useState<number | null>(null)

  /** Delete a DETAIL image */
  const deleteDetail = useCallback(
    async (imageId: number) => {
      setDeleting(imageId)
      try {
        await deleteCostumeImage(imageId)
        refetch()
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : VI.costumeRental.images.deleteError,
        )
      } finally {
        setDeleting(null)
      }
    },
    [refetch],
  )

  /**
   * Replace MAIN image.
   * Uploads new MAIN first, then deletes old MAIN on success.
   */
  const handleReplaceMain = useCallback(
    async (oldMainImageId: number, newFile: File) => {
      if (!costumeId) return
      setReplacing(oldMainImageId)
      try {
        await replaceMain(costumeId, oldMainImageId, newFile)
        refetch()
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : VI.costumeRental.images.uploadError,
        )
      } finally {
        setReplacing(null)
      }
    },
    [costumeId, refetch],
  )

  /**
   * Replace a DETAIL image.
   * Deletes old, then uploads new.
   */
  const handleReplaceDetail = useCallback(
    async (oldImageId: number, newFile: File) => {
      if (!costumeId) return
      setReplacing(oldImageId)
      try {
        await replaceDetail(costumeId, oldImageId, newFile)
        refetch()
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : VI.costumeRental.images.uploadError,
        )
      } finally {
        setReplacing(null)
      }
    },
    [costumeId, refetch],
  )

  /** Add a new DETAIL image */
  const addDetail = useCallback(
    async (file: File) => {
      if (!costumeId) return
      setUploading(true)
      try {
        await uploadCostumeImage(costumeId, 'DETAIL', file)
        refetch()
      } catch (err) {
        message.error(
          err instanceof Error ? err.message : VI.costumeRental.images.uploadError,
        )
      } finally {
        setUploading(false)
      }
    },
    [costumeId, refetch],
  )

  /** Whether deleting MAIN is allowed (only if more than 1 MAIN exists) */
  const canDeleteMain = mainImages.length > 1

  return {
    uploading,
    deleting,
    replacing,
    canDeleteMain,
    deleteDetail,
    handleReplaceMain,
    handleReplaceDetail,
    addDetail,
  }
}
