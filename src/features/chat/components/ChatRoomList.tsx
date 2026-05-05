import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRoomTime } from "@/lib/datetime"
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
              "group/sidebar-btn flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors overflow-hidden",
              isActive ? "bg-pink-50" : "hover:bg-slate-50"
            )}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {room.partnerAvatar ? (
                <img
                  src={room.partnerAvatar || undefined}
                  alt={room.partnerName || "Partner"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-pink-200 text-[10px] font-semibold text-pink-600">
                  {computeInitials(room.partnerName)}
                </div>
              )}
              {/* Hover tooltip — shows when ANY part of the button is hovered */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-100 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-lg opacity-0 shadow-xl transition-opacity group-hover/sidebar-btn:opacity-100">
                <span className="block font-medium">{room.partnerName || "Unknown"}</span>
                <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-full rotate-45 border-b border-r border-slate-100 bg-white" />
              </div>
            </div>

            {/* Text — w-0 min-w-0 forces flex item to shrink, enabling truncate */}
            <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden">
              <span
                className={cn(
                  "block truncate text-xs",
                  isActive ? "font-semibold text-pink-600" : "font-medium text-slate-700"
                )}
              >
                {room.partnerName || "Unknown"}
              </span>
              {room.lastMessageAt && (
                <span className="block truncate text-[10px] leading-tight text-slate-400">
                  {formatRoomTime(room.lastMessageAt)}
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
