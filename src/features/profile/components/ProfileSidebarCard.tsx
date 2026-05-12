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
  if (normalized === "ACTIVE") return "bg-cosmate-success/15 text-cosmate-success"
  if (normalized === "INACTIVE") return "bg-muted text-muted-foreground"
  if (normalized === "BANNED") return "bg-destructive/10 text-destructive"
  return "bg-cosmate-soft-pink text-cosmate-pink"
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
    <div className="w-full shrink-0 rounded-2xl border border-border bg-card p-6 shadow-sm md:w-[320px] lg:w-[360px]">
      {actions && <div className="mb-4 flex flex-wrap gap-2">{actions}</div>}

      {loading ? (
        <div className="space-y-3">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
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
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-cosmate-soft-pink text-4xl font-bold text-cosmate-pink">
              {getInitials(name || username)}
            </div>
          )}

          <h1 className="mt-4 text-xl font-bold text-foreground">{name}</h1>
          <p className="text-sm text-cosmate-pink">{username}</p>

          {(email || phone || status) && (
            <div className="mt-3 space-y-2">
              {email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0 text-cosmate-pink" />
                  <span>{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0 text-cosmate-pink" />
                  <span>{phone}</span>
                </div>
              )}
              {status && <Badge className={getStatusBadgeClass(status)}>{status}</Badge>}
            </div>
          )}

          {bio && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{bio}</p>}
        </>
      )}

      {error && !loading && (
        <p className="mt-3 text-sm text-destructive">{error}</p>
      )}

      <div className="mt-4 rounded-xl border border-border bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <CalendarCheck className="h-4 w-4 text-cosmate-pink" />
          <span>
            <strong>{stats.bookings}</strong> Made
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-foreground">
          <Star className="h-4 w-4 text-cosmate-warning" />
          <span>
            <strong>{stats.rating}</strong> Photographer Review
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 shrink-0 text-cosmate-pink" />
        <span>{location}</span>
      </div>
      {social.instagram && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Instagram className="h-4 w-4 shrink-0 text-cosmate-pink" />
          <span>{social.instagram}</span>
        </div>
      )}
      <div className="my-4 h-px bg-border" />
      <TagChips tags={tags} />
    </div>
  )
}
