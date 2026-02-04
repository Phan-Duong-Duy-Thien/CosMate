import type { ReactNode } from "react"
import { MapPin, Instagram, Star, CalendarCheck } from "lucide-react"
import { TagChips } from "./TagChips"
import type { MockProfile } from "../types"

interface ProfileSidebarCardProps {
  profile: MockProfile
  actions?: ReactNode
}

export function ProfileSidebarCard({ profile, actions }: ProfileSidebarCardProps) {
  const { name, username, bio, avatarUrl, stats, location, social, tags } =
    profile
  return (
    <div className="w-full shrink-0 rounded-2xl bg-white p-6 shadow-sm md:w-[320px] lg:w-[360px]">
      {actions && <div className="mb-4 flex flex-wrap gap-2">{actions}</div>}
      <img
        src={avatarUrl}
        alt={name}
        className="aspect-square w-full rounded-2xl object-cover"
      />
      <h1 className="mt-4 text-xl font-bold text-slate-900">{name}</h1>
      <p className="text-sm text-purple-600">{username}</p>
      {bio && (
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{bio}</p>
      )}
      <div className="mt-4 rounded-xl bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <CalendarCheck className="h-4 w-4 text-purple-500" />
          <span>
            <strong>{stats.bookings}</strong> Made
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
          <Star className="h-4 w-4 text-amber-500" />
          <span>
            <strong>{stats.rating}</strong> Photographer Review
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <MapPin className="h-4 w-4 shrink-0 text-purple-500" />
        <span>{location}</span>
      </div>
      {social.instagram && (
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <Instagram className="h-4 w-4 shrink-0 text-purple-500" />
          <span>{social.instagram}</span>
        </div>
      )}
      <div className="my-4 h-px bg-slate-200" />
      <TagChips tags={tags} />
    </div>
  )
}
