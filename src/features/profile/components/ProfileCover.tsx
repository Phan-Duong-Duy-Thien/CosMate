import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { VI } from "@/shared/i18n/vi"

interface ProfileCoverProps {
  displayName: string
  handle: string
  initials: string
  avatarUrl?: string | null
  coverImageUrl?: string | null
  onPreviewAvatar: () => void
  onPreviewCover: () => void
  onUploadCover: () => void
  onEditProfile: () => void
}

export function ProfileCover({
  displayName,
  handle,
  initials,
  avatarUrl,
  coverImageUrl,
  onPreviewAvatar,
  onPreviewCover,
  onUploadCover,
  onEditProfile,
}: ProfileCoverProps) {
  return (
    <Card className="relative overflow-hidden rounded-[1.5rem] border-[4px] border-indigo-950 bg-[#fffaf0] p-0 shadow-[10px_10px_0_0_rgba(30,27,75,0.3)]">
      <button
        type="button"
        aria-label={VI.profile.cover.coverPreviewTitle}
        onClick={onPreviewCover}
        className="block h-[200px] w-full cursor-zoom-in bg-gradient-to-r from-pink-200 via-violet-100 to-pink-200 text-left transition-opacity duration-200 hover:opacity-95 focus-visible:outline-none md:h-[280px]"
        style={
          coverImageUrl
            ? {
                backgroundImage: `url(${coverImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />
      <div className="pointer-events-none absolute left-5 top-[200px] z-10 -translate-y-1/2 md:left-8 md:top-[280px]">
        <button
          type="button"
          className="pointer-events-auto group shrink-0 rounded-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={onPreviewAvatar}
          aria-label={VI.profile.cover.avatarPreviewTitle}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-28 w-28 rounded-full border-[4px] border-indigo-950 bg-white object-cover transition-opacity group-hover:opacity-90 md:h-40 md:w-40"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-[4px] border-indigo-950 bg-pink-100 text-3xl font-bold text-indigo-900 md:h-40 md:w-40">
              {initials}
            </div>
          )}
        </button>
      </div>

      <div className="relative px-5 pb-2 pt-2 md:px-8 md:pb-3 md:pt-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 pl-[7.75rem] pt-1 text-left md:pl-44 md:pt-0">
            <p className="truncate text-2xl font-extrabold leading-tight text-indigo-950">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-[#d61f91]">{handle}</p>
            <span className="mt-1.5 inline-flex w-fit rounded-full border-2 border-indigo-950 bg-pink-100 px-2.5 py-0.5 text-xs font-extrabold text-indigo-900">
              {VI.profile.cover.accountCosplayer}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-xl border-[2px] border-indigo-950 bg-white font-bold text-indigo-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-50 active:scale-[0.98]"
              onClick={onUploadCover}
            >
              {VI.profile.cover.uploadCover}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-xl border-[2px] border-indigo-950 bg-white font-bold text-indigo-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink-50 active:scale-[0.98]"
              onClick={onEditProfile}
            >
              {VI.profile.cover.editProfile}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
