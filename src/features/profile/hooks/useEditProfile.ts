import { useEffect, useMemo, useState } from "react"
import type { AdminUserProfile } from "@/features/admin/types"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { useUserProfile as useHeaderUserProfile } from "@/app/providers/UserProfileProvider"
import { VI } from "@/shared/i18n/vi"
import { notifyProfileChanged } from "@/shared/sync/dataSync"
import * as userProfileService from "../services/userProfile.service"
import type { UpdateUserProfilePayload } from "../types"

interface UseEditProfileOptions {
  initialProfile: AdminUserProfile | null
  onProfileUpdated?: (profile: AdminUserProfile) => void
}

const PHONE_REGEX = /^\+?[0-9]{9,15}$/

export function useEditProfile({
  initialProfile,
  onProfileUpdated,
}: UseEditProfileOptions) {
  const userId = getUserId()
  const { setUserProfile } = useHeaderUserProfile()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string
    phone?: string
  }>({})

  useEffect(() => {
    setFullName(initialProfile?.fullName ?? "")
    setPhone(initialProfile?.phone ?? "")
    setFieldErrors({})
    setError(null)
    setSuccess(null)
  }, [initialProfile])

  const isMissingUserId = useMemo(() => !userId, [userId])

  const validate = (): boolean => {
    const nextErrors: { fullName?: string; phone?: string } = {}
    if (!fullName.trim()) {
      nextErrors.fullName = VI.profile.validation.fullNameRequired
    }
    if (!phone.trim()) {
      nextErrors.phone = VI.profile.validation.phoneRequired
    } else if (!PHONE_REGEX.test(phone.trim())) {
      nextErrors.phone = VI.profile.validation.phoneInvalid
    }
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmitBasicInfo = async (): Promise<boolean> => {
    if (isMissingUserId) {
      setError(VI.profile.messages.loginRequired)
      return false
    }
    if (!validate()) return false

    const payload: UpdateUserProfilePayload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
    }

    try {
      setUpdatingProfile(true)
      setError(null)
      const updatedProfile = await userProfileService.updateProfile(userId, payload)
      onProfileUpdated?.(updatedProfile)
      setUserProfile({ fullName: updatedProfile.fullName })
      notifyProfileChanged()
      setSuccess(VI.profile.editModal.updateSuccess)
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : VI.profile.messages.updateFailed
      )
      return false
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handleAvatarUpload = async (file: File | null): Promise<boolean> => {
    if (isMissingUserId) {
      setError(VI.profile.messages.loginRequired)
      return false
    }
    if (!file) return false

    try {
      setUploadingAvatar(true)
      setError(null)
      const updatedProfile = await userProfileService.uploadAvatar(userId, file)
      onProfileUpdated?.(updatedProfile)
      setUserProfile({ avatarUrl: updatedProfile.avatarUrl })
      notifyProfileChanged()
      setSuccess(VI.profile.editModal.uploadAvatarSuccess)
      return true
    } catch (err) {
      setError(
        err instanceof Error ? err.message : VI.profile.messages.uploadAvatarFailed
      )
      return false
    } finally {
      setUploadingAvatar(false)
    }
  }

  return {
    fullName,
    setFullName,
    phone,
    setPhone,
    updatingProfile,
    uploadingAvatar,
    fieldErrors,
    error,
    success,
    handleSubmitBasicInfo,
    handleAvatarUpload,
  }
}
