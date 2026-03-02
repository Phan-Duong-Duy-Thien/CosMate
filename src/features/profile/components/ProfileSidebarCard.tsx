import type { ReactNode } from "react"
import { MapPin, Instagram, Star, CalendarCheck, Mail, Phone } from "lucide-react"
import { TagChips } from "./TagChips"
import { Badge } from "@/shared/components/Badge"
import type { MockProfile } from "../types"

interface ProfileSidebarCardProps {
  profile: MockProfile
  actions?: ReactNode
  loading?: boolean
  error?: string | null
}

function getInitials(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "U"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

function getStatusBadgeClass(status?: string): string {
  const normalized = status?.toUpperCase()
  if (normalized === "ACTIVE") return "bg-emerald-100 text-emerald-700"
  if (normalized === "INACTIVE") return "bg-slate-100 text-slate-700"
  if (normalized === "BANNED") return "bg-rose-100 text-rose-700"
  return "bg-purple-100 text-purple-700"
}

export function ProfileSidebarCard({
  profile,
  actions,
  loading = false,
  error = null,
}: ProfileSidebarCardProps) {
  const { name, username, bio, avatarUrl, stats, location, social, tags, email, phone, status } =
    profile

  return (
    <div className="w-full shrink-0 rounded-2xl bg-white p-6 shadow-sm md:w-[320px] lg:w-[360px]">
      {actions && <div className="mb-4 flex flex-wrap gap-2">{actions}</div>}

      {loading ? (
        <div className="space-y-3">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        </div>
      ) : (
        <>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-purple-100 text-4xl font-bold text-purple-700">
              {getInitials(name || username)}
            </div>
          )}

          <h1 className="mt-4 text-xl font-bold text-slate-900">{name}</h1>
          <p className="text-sm text-purple-600">{username}</p>

          {(email || phone || status) && (
            <div className="mt-3 space-y-2">
              {email && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4 shrink-0 text-purple-500" />
                  <span>{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4 shrink-0 text-purple-500" />
                  <span>{phone}</span>
                </div>
              )}
              {status && <Badge className={getStatusBadgeClass(status)}>{status}</Badge>}
            </div>
          )}

          {bio && <p className="mt-2 line-clamp-3 text-sm text-slate-600">{bio}</p>}
        </>
      )}

      {error && !loading && (
        <p className="mt-3 text-sm text-rose-600">{error}</p>
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
