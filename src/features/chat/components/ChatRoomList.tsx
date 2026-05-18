import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatRoomTime } from "@/lib/datetime"
import type { ChatRoomListItem } from "../types"
import { CHAT_UI } from "../constants/chatUi"

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
      <div className={CHAT_UI.emptyInbox}>
        <MessageCircle className={cn("h-8 w-8", CHAT_UI.emptyIcon)} />
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
              CHAT_UI.roomRow,
              isActive ? CHAT_UI.roomRowActive : CHAT_UI.roomRowHover,
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
                <div className={CHAT_UI.avatarFallbackSm}>
                  {computeInitials(room.partnerName)}
                </div>
              )}
              <div className={CHAT_UI.tooltip}>
                <span className="block font-medium">{room.partnerName || "Unknown"}</span>
                <div className={CHAT_UI.tooltipArrow} />
              </div>
            </div>

            <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden">
              <span
                className={cn(
                  "block truncate text-xs",
                  isActive ? CHAT_UI.roomNameActive : CHAT_UI.roomNameIdle,
                )}
              >
                {room.partnerName || "Unknown"}
              </span>
              {room.lastMessageAt && (
                <span className={CHAT_UI.roomTime}>
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
