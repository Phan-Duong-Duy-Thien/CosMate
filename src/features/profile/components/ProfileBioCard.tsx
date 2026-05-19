import { useEffect, useState } from "react"
import { PenLine } from "lucide-react"
import { Button } from "@/shared/components/Button"
import { VI } from "@/shared/i18n/vi"
import { ProfileNeoCard } from "./ProfileNeoCard"
import { PROFILE_CARD_UI } from "../constants/profileUi"

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
    <ProfileNeoCard
      title={VI.profile.bio.title}
      icon={PenLine}
      footer={
        isEditing ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={PROFILE_CARD_UI.action}
              onClick={handleCancel}
            >
              {VI.profile.bio.cancel}
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-xl border-[2px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-bold text-white hover:brightness-110"
              onClick={handleSave}
            >
              {VI.profile.bio.save}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={PROFILE_CARD_UI.action}
            onClick={handleEdit}
          >
            {VI.profile.bio.edit}
          </Button>
        )
      }
    >
      {isEditing ? (
        <textarea
          value={draftBio}
          onChange={(event) => setDraftBio(event.target.value)}
          placeholder={VI.profile.bio.placeholder}
          className="min-h-28 w-full rounded-2xl border-[2px] border-indigo-950/20 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        />
      ) : (
        <p className="min-h-16 whitespace-pre-wrap rounded-2xl border-[2px] border-indigo-950/15 bg-white px-4 py-3 text-sm font-medium text-slate-600">
          {bio || VI.profile.bio.placeholder}
        </p>
      )}
    </ProfileNeoCard>
  )
}
