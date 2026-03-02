import * as React from "react"
import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import type { AdminUserProfile } from "@/features/admin/types"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { useEditProfile } from "../hooks/useEditProfile"

type EditProfileTab = "basic" | "address"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: AdminUserProfile | null
  onProfileUpdated: (profile: AdminUserProfile) => void
}

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = React.useState<EditProfileTab>("basic")
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)

  const {
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
  } = useEditProfile({
    initialProfile: profile,
    onProfileUpdated,
  })

  React.useEffect(() => {
    if (open) {
      setActiveTab("basic")
      setAvatarFile(null)
    }
  }, [open])

  const previewUrl = React.useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile)
    return profile?.avatarUrl ?? null
  }, [avatarFile, profile?.avatarUrl])

  React.useEffect(() => {
    return () => {
      if (avatarFile) {
        URL.revokeObjectURL(previewUrl ?? "")
      }
    }
  }, [avatarFile, previewUrl])

  const initials = React.useMemo(() => {
    const source = (profile?.fullName?.trim() || profile?.username || "U").trim()
    const parts = source.split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "U"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }, [profile?.fullName, profile?.username])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl"
        onClose={() => onOpenChange(false)}
      >
        <h2 className="text-xl font-bold text-slate-900">
          {VI.profile.editModal.title}
        </h2>

        <div className="mt-4 flex gap-2 rounded-xl bg-slate-50 p-1">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === "basic"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
            onClick={() => setActiveTab("basic")}
          >
            {VI.profile.editModal.tabs.basicInfo}
          </button>
          <button
            type="button"
            className="flex-1 cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-slate-400"
            disabled
          >
            {VI.profile.editModal.tabs.address}
          </button>
        </div>

        {activeTab === "basic" ? (
          <div className="mt-5 space-y-5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-medium text-slate-700">
                {VI.profile.avatar}
              </p>
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={VI.profile.avatar}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-700">
                    {initials}
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-pink-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-pink-700 hover:file:bg-pink-200"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!avatarFile || uploadingAvatar}
                    onClick={() => handleAvatarUpload(avatarFile)}
                  >
                    {uploadingAvatar
                      ? VI.profile.editModal.uploading
                      : VI.profile.editModal.uploadAvatar}
                  </Button>
                </div>
              </div>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                void handleSubmitBasicInfo()
              }}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {VI.profile.fullName} <span className="text-pink-500">*</span>
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={VI.profile.placeholders.fullName}
                  className={cn(fieldErrors.fullName && "border-pink-300")}
                />
                {fieldErrors.fullName && (
                  <p className="mt-1 text-xs text-pink-600">{fieldErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {VI.profile.phone} <span className="text-pink-500">*</span>
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={VI.profile.placeholders.phone}
                  className={cn(fieldErrors.phone && "border-pink-300")}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-pink-600">{fieldErrors.phone}</p>
                )}
              </div>

              {error && (
                <p className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  {VI.common.actions.cancel}
                </Button>
                <Button type="submit" size="sm" disabled={updatingProfile}>
                  {updatingProfile
                    ? VI.common.status.loading
                    : VI.profile.editModal.saveBasicInfo}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            {VI.profile.editModal.addressPlaceholder}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
