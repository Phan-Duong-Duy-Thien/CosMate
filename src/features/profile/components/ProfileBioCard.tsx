import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
    <Card className="border-cosmate-pink/25 bg-gradient-to-br from-card to-cosmate-soft-pink/40 p-5 shadow-md shadow-cosmate-pink/10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">{VI.profile.bio.title}</h2>
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
            className="min-h-28 w-full rounded-2xl border border-cosmate-pink/30 bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
        <p className="mt-3 min-h-16 whitespace-pre-wrap rounded-2xl border border-cosmate-pink/30 bg-background/90 px-4 py-3 text-sm text-muted-foreground">
          {bio || VI.profile.bio.placeholder}
        </p>
      )}
    </Card>
  )
}
