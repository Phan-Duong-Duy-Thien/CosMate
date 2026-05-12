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
    <Card className="rounded-2xl border-[3px] border-indigo-950/20 bg-white/85 p-5 shadow-[5px_5px_0_0_rgba(30,27,75,0.14)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-extrabold text-indigo-950">{VI.profile.bio.title}</h2>
        {!isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-lg border border-transparent text-sm font-bold text-[#d61f91] decoration-1 underline-offset-2 hover:bg-pink-50 hover:underline"
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
            className="min-h-28 w-full rounded-2xl border-[2px] border-indigo-950/20 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" className="rounded-xl border-[2px] border-indigo-950 bg-white font-bold text-indigo-900 hover:bg-pink-50" onClick={handleCancel}>
              {VI.profile.bio.cancel}
            </Button>
            <Button type="button" size="sm" className="rounded-xl border-[2px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-bold text-white hover:brightness-110" onClick={handleSave}>
              {VI.profile.bio.save}
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 min-h-16 whitespace-pre-wrap rounded-2xl border-[2px] border-indigo-950/15 bg-white px-4 py-3 text-sm font-medium text-slate-600">
          {bio || VI.profile.bio.placeholder}
        </p>
      )}
    </Card>
  )
}
