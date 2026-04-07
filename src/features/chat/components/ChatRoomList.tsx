import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatRoomListItem } from "../types"

interface ChatRoomListProps {
  rooms: ChatRoomListItem[];
  activeRoomId: number | null;
  onSelectRoom: (room: ChatRoomListItem) => void;
}

function computeInitials(fullName: string | null | undefined): string {
  if (!fullName) return "?"
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const oneDay = 24 * 60 * 60 * 1000
  if (diff < oneDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  if (diff < 7 * oneDay) {
    return date.toLocaleDateString([], { weekday: "short" })
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

export function ChatRoomList({ rooms, activeRoomId, onSelectRoom }: ChatRoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-slate-400">
        <MessageCircle className="h-8 w-8 text-slate-300" />
        <p className="text-xs">No conversations yet</p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-0.5 p-1.5">
      {rooms.map((room) => {
        const isActive = room.roomId === activeRoomId
        return (
          <button
            key={room.roomId}
            type="button"
            onClick={() => onSelectRoom(room)}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors overflow-hidden",
              isActive ? "bg-pink-50" : "hover:bg-slate-50"
            )}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {room.partnerAvatar ? (
                <img
                  src={room.partnerAvatar || undefined}
                  alt={room.partnerName || "Partner"}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-pink-200 text-xs font-semibold text-pink-600">
                  {computeInitials(room.partnerName)}
                </div>
              )}
            </div>

            {/* Text — w-0 min-w-0 forces flex item to shrink, enabling truncate */}
            <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden">
              <span
                className={cn(
                  "block truncate text-sm",
                  isActive ? "font-semibold text-pink-600" : "font-medium text-slate-700"
                )}
              >
                {room.partnerName || "Unknown"}
              </span>
              {room.lastMessageAt && (
                <span className="block truncate text-[10px] leading-tight text-slate-400">
                  {formatTime(room.lastMessageAt)}
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
