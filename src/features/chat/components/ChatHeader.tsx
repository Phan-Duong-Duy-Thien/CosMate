import { cn } from "@/lib/utils"
import type { ChatPartner } from "../types"

interface ChatHeaderProps {
  partner: ChatPartner | null;
  loading: boolean;
}

function computeInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ChatHeader({ partner, loading }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3">
      {loading ? (
        <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse" />
      ) : partner ? (
        <>
          {partner.avatarUrl ? (
            <img
              src={partner.avatarUrl}
              alt={partner.fullName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-sm font-medium text-pink-600">
              {computeInitials(partner.fullName)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 truncate">
              {partner.fullName}
            </p>
          </div>
        </>
      ) : (
        <div className="h-10 w-10 rounded-full bg-slate-100" />
      )}
    </div>
  )
}
