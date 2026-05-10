import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import type { ChatPartner } from "../types"

interface ChatHeaderProps {
  partner: ChatPartner | null;
  loading: boolean;
  isConnected?: boolean;
}

function computeInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ChatHeader({ partner, loading, isConnected = true }: ChatHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      {loading ? (
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
          <div className="flex flex-col gap-0.5">
            <div className="h-4 w-24 rounded bg-slate-100 animate-pulse" />
            <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
          </div>
        </div>
      ) : partner ? (
        <div className="flex items-start gap-3">
          {/* Avatar with online status */}
          <div className="relative shrink-0">
            {partner.avatarUrl ? (
              <img
                src={partner.avatarUrl || undefined}
                alt={partner.fullName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-pink-200 text-sm font-semibold text-pink-600 shadow-sm ring-2 ring-white">
                {computeInitials(partner.fullName)}
              </div>
            )}
            {/* Online indicator */}
            <span className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
              isConnected ? "bg-green-400" : "bg-slate-300"
            )} />
          </div>

          {/* Name + status */}
          <div className="flex min-w-0 flex-col">
            <p className="truncate font-semibold leading-tight text-slate-800">
              {partner.fullName}
            </p>
            <p className="truncate text-xs leading-none text-slate-400">
              {isConnected ? VI.common.status.online : VI.common.status.offline}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100" />
          <div className="h-4 w-24 rounded bg-slate-100 animate-pulse" />
        </div>
      )}
    </div>
  )
}
