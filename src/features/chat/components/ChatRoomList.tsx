import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRoomTime } from "@/lib/datetime"
import type { ChatRoomListItem } from "../types"
import { CHAT_UI } from "../constants/chatUi"

interface ChatRoomListProps {
  rooms: ChatRoomListItem[];
  activeRoomId: number | null;
  onSelectRoom: (room: ChatRoomListItem) => void;
  /** Compact sidebar: native title only (avoids tooltip clipped by overflow) */
  showHoverTooltip?: boolean;
  theme?: "user" | "provider";
}

function computeInitials(fullName: string | null | undefined): string {
  if (!fullName) return "?"
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ChatRoomList({
  rooms,
  activeRoomId,
  onSelectRoom,
  showHoverTooltip = true,
  theme = "user",
}: ChatRoomListProps) {
  const isProvider = theme === "provider"

  if (rooms.length === 0) {
    return (
      <div className={cn(isProvider ? "flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-slate-400" : CHAT_UI.emptyInbox)}>
        <MessageCircle className={cn("h-8 w-8", isProvider ? "text-slate-300" : CHAT_UI.emptyIcon)} />
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
            title={!showHoverTooltip ? room.partnerName || "Unknown" : undefined}
            onClick={() => onSelectRoom(room)}
            className={cn(
              CHAT_UI.roomRow,
              isActive
                ? (isProvider ? CHAT_UI.providerRoomRowActive : CHAT_UI.roomRowActive)
                : (isProvider ? CHAT_UI.providerRoomRowHover : CHAT_UI.roomRowHover),
            )}
          >
            <div className="relative shrink-0">
              {room.partnerAvatar ? (
                <img
                  src={room.partnerAvatar || undefined}
                  alt={room.partnerName || "Partner"}
                  className={CHAT_UI.avatarSm}
                />
              ) : (
                <div className={isProvider ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[10px] font-extrabold text-[#7C3AED]" : CHAT_UI.avatarFallbackSm}>
                  {computeInitials(room.partnerName)}
                </div>
              )}
              {showHoverTooltip ? (
                <div className={cn(CHAT_UI.tooltip, isProvider && "border-slate-200 bg-white shadow-sm shadow-slate-100 font-normal")}>
                  <span className="block font-medium">{room.partnerName || "Unknown"}</span>
                  <div className={cn(CHAT_UI.tooltipArrow, isProvider && "border-b border-r border-slate-200 bg-white")} />
                </div>
              ) : null}
            </div>

            <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden">
              <span
                className={cn(
                  "block truncate text-xs",
                  isProvider
                    ? (isActive ? "font-bold text-slate-800" : "font-medium text-slate-500")
                    : (isActive ? CHAT_UI.roomNameActive : CHAT_UI.roomNameIdle),
                )}
              >
                {room.partnerName || "Unknown"}
              </span>
              {room.lastMessageAt && (
                <span className={isProvider ? "block truncate text-[10px] font-medium leading-tight text-slate-400" : CHAT_UI.roomTime}>
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
