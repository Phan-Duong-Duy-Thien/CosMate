import { useCallback, useEffect, useState } from "react"
import type { AdminUserProfile } from "@/features/admin/types"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { getUserProfile } from "@/features/admin/services/adminUsers.service"
import { useUserProfile as useHeaderUserProfile } from "@/app/providers/UserProfileProvider"
import { VI } from "@/shared/i18n/vi"
import * as userProfileService from "../services/userProfile.service"

type StatusTone = "active" | "inactive" | "banned" | "default"

function getInitials(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "U"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

function getStatusTone(status?: string): StatusTone {
  const normalized = status?.toUpperCase()
  if (normalized === "ACTIVE") return "active"
  if (normalized === "INACTIVE") return "inactive"
  if (normalized === "BANNED") return "banned"
  return "default"
}

export function useUserProfile() {
  const [profile, setProfile] = useState<AdminUserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const userId = getUserId()
  const { setUserProfile } = useHeaderUserProfile()

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null)
      setError(VI.common.permission.goLogin)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await getUserProfile(userId)
      setProfile(result)
      // Sync to header context
      setUserProfile({
        avatarUrl: result.avatarUrl,
        fullName: result.fullName,
      })
    } catch {
      setError(VI.common.status.error)
    } finally {
      setLoading(false)
    }
  }, [userId, setUserProfile])

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

  const uploadAvatar = useCallback(
    async (file: File): Promise<boolean> => {
      if (!userId) {
        setError(VI.profile.messages.loginRequired)
        return false
      }

      try {
        setUploadingAvatar(true)
        setError(null)
        const updatedProfile = await userProfileService.uploadAvatar(userId, file)
        setProfile(updatedProfile)
        // Sync to header context
        setUserProfile({ avatarUrl: updatedProfile.avatarUrl })
        return true
      } catch {
        setError(VI.profile.messages.uploadAvatarFailed)
        return false
      } finally {
        setUploadingAvatar(false)
      }
    },
    [userId, setUserProfile]
  )

  return {
    profile,
    displayName:
      profile?.fullName?.trim() && profile.fullName.trim().length > 0
        ? profile.fullName.trim()
        : profile?.username ?? "",
    handle: profile?.username ? `@${profile.username}` : "",
    initials: getInitials(
      (profile?.fullName?.trim() && profile.fullName.trim()) || profile?.username || "User"
    ),
    statusTone: getStatusTone(profile?.status),
    loading,
    uploadingAvatar,
    error,
    userId,
    refetch: fetchProfile,
    uploadAvatar,
    setProfile,
  }
}
