import * as React from "react"
import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import type { MockProfile } from "../types"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"

const BIO_MAX_LENGTH = 160

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialProfile: MockProfile
  onSave: (profile: MockProfile) => void
}

export function EditProfileModal({
  open,
  onOpenChange,
  initialProfile,
  onSave,
}: EditProfileModalProps) {
  const [draft, setDraft] = React.useState<MockProfile>(initialProfile)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [tagInput, setTagInput] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setDraft(initialProfile)
      setErrors({})
      setTagInput("")
    }
  }, [open, initialProfile])

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!draft.name?.trim()) next.displayName = "Display name is required"
    if (!draft.username?.trim()) next.username = VI.profile.validation.usernameRequired
    if (draft.bio && draft.bio.length > BIO_MAX_LENGTH)
      next.bio = `Bio must be ${BIO_MAX_LENGTH} characters or less`
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave(draft)
    onOpenChange(false)
  }

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "")
    if (!t || draft.tags.includes(t)) return
    setDraft((prev) => ({ ...prev, tags: [...prev.tags, t] }))
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setDraft((prev) => ({
      ...prev,
      tags: prev.tags.filter((x) => x !== tag),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg"
        onClose={() => onOpenChange(false)}
      >
        <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Display name <span className="text-pink-500">*</span>
            </label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
              placeholder="Display name"
              className={cn(errors.displayName && "border-pink-300")}
            />
            {errors.displayName && (
              <p className="mt-1 text-xs text-pink-600">{errors.displayName}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Username <span className="text-pink-500">*</span>
            </label>
            <Input
              value={draft.username}
              onChange={(e) =>
                setDraft((p) => ({ ...p, username: e.target.value }))
              }
              placeholder="@username"
              className={cn(errors.username && "border-pink-300")}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-pink-600">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Bio (max {BIO_MAX_LENGTH})
            </label>
            <textarea
              value={draft.bio}
              onChange={(e) =>
                setDraft((p) => ({ ...p, bio: e.target.value.slice(0, BIO_MAX_LENGTH) }))
              }
              placeholder="Short bio"
              rows={3}
              className={cn(
                "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200",
                errors.bio && "border-pink-300"
              )}
            />
            <p className="mt-1 text-right text-xs text-slate-400">
              {draft.bio.length}/{BIO_MAX_LENGTH}
            </p>
            {errors.bio && (
              <p className="mt-1 text-xs text-pink-600">{errors.bio}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Location
            </label>
            <Input
              value={draft.location}
              onChange={(e) =>
                setDraft((p) => ({ ...p, location: e.target.value }))
              }
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Instagram
            </label>
            <Input
              value={draft.social.instagram ?? ""}
              onChange={(e) =>
                setDraft((p) => ({
                  ...p,
                  social: { ...p.social, instagram: e.target.value || undefined },
                }))
              }
              placeholder="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Avatar URL
            </label>
            <div className="flex gap-3">
              <Input
                value={draft.avatarUrl}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, avatarUrl: e.target.value }))
                }
                placeholder="https://..."
                className="flex-1"
              />
              {draft.avatarUrl && (
                <img
                  src={draft.avatarUrl}
                  alt="Preview"
                  className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {draft.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full p-0.5 hover:bg-purple-200"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex gap-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder={VI.profile.placeholders.addTag}
                  className="w-28"
                />
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
