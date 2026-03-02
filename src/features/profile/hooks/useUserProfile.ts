import { useCallback, useEffect, useState } from "react"
import type { AdminUserProfile } from "@/features/admin/types"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { getUserProfile } from "@/features/admin/services/adminUsers.service"
import { VI } from "@/shared/i18n/vi"

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
  const [error, setError] = useState<string | null>(null)
  const userId = getUserId()

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
    } catch {
      setError(VI.common.status.error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

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
    error,
    userId,
    refetch: fetchProfile,
    setProfile,
  }
}
