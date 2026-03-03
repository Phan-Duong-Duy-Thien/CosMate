import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
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
    <Card className="relative overflow-hidden border-transparent bg-white/95 p-0 shadow-[0_16px_48px_rgba(170,150,255,0.2)]">
      <button
        type="button"
        aria-label={VI.profile.cover.coverPreviewTitle}
        onClick={onPreviewCover}
        className="block h-[200px] w-full cursor-zoom-in bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 text-left transition-opacity duration-200 hover:opacity-95 focus-visible:outline-none md:h-[280px]"
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
          className="pointer-events-auto group shrink-0 rounded-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 focus-visible:ring-offset-2"
          onClick={onPreviewAvatar}
          aria-label={VI.profile.cover.avatarPreviewTitle}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-28 w-28 rounded-full border border-white object-cover shadow-lg transition-opacity group-hover:opacity-90 md:h-40 md:w-40"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white bg-pink-100 text-3xl font-bold text-pink-700 shadow-lg md:h-40 md:w-40">
              {initials}
            </div>
          )}
        </button>
      </div>

      <div className="relative px-5 pb-2 pt-2 md:px-8 md:pb-3 md:pt-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 pl-[7.75rem] pt-1 text-left md:pl-44 md:pt-0">
            <p className="truncate text-2xl font-semibold leading-tight text-slate-900">
              {displayName}
            </p>
            <p className="mt-0.5 truncate text-sm text-purple-600">{handle}</p>
            <Badge className="mt-1.5 bg-purple-100 text-purple-700">
              {VI.profile.cover.accountCosplayer}
            </Badge>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              onClick={onUploadCover}
            >
              {VI.profile.cover.uploadCover}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
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
