import { useEffect, useState } from "react"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { VI } from "@/shared/i18n/vi"

const PROFILE_BIO_STORAGE_KEY = "cosmate.profile.bio"

export function ProfileBioCard() {
  const [bio, setBio] = useState("")
  const [draftBio, setDraftBio] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PROFILE_BIO_STORAGE_KEY) ?? ""
      setBio(stored)
      setDraftBio(stored)
    } catch {
      setBio("")
      setDraftBio("")
    }
  }, [])

  const handleEdit = () => {
    setDraftBio(bio)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setDraftBio(bio)
    setIsEditing(false)
  }

  const handleSave = () => {
    const nextBio = draftBio.trim()
    setBio(nextBio)
    try {
      window.localStorage.setItem(PROFILE_BIO_STORAGE_KEY, nextBio)
    } catch {
      // Keep UI working even if storage is unavailable.
    }
    setIsEditing(false)
  }

  return (
    <Card className="border-rose-200/80 bg-gradient-to-br from-white to-pink-100/45 p-5 shadow-[0_10px_30px_rgba(244,114,182,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-900">{VI.profile.bio.title}</h2>
        {!isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="decoration-1 underline-offset-2 hover:underline"
            onClick={handleEdit}
          >
            {VI.profile.bio.edit}
          </Button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-3">
          <textarea
            value={draftBio}
            onChange={(event) => setDraftBio(event.target.value)}
            placeholder={VI.profile.bio.placeholder}
            className="min-h-28 w-full rounded-2xl border border-fuchsia-200 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200 focus-visible:ring-offset-2"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              {VI.profile.bio.cancel}
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              {VI.profile.bio.save}
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 min-h-16 whitespace-pre-wrap rounded-2xl border border-fuchsia-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
          {bio || VI.profile.bio.placeholder}
        </p>
      )}
    </Card>
  )
}
