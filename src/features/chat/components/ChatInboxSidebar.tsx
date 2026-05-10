/**
 * Shared inbox sidebar: room list + user search (same behavior as cosplayer ChatPopup).
 */
import { useState, type ReactNode } from "react"
import { Search, X, User } from "lucide-react"
import { message } from "antd"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import type { ChatRoomListItem } from "../types"
import type { SearchUserResult } from "../services/user.service"
import { useUserSearch } from "../hooks/useUserSearch"
import { ChatRoomList } from "./ChatRoomList"

export type ChatInboxSidebarVariant = "compact" | "comfortable"

function computeInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export interface ChatInboxSidebarProps {
  variant: ChatInboxSidebarVariant
  /** Left side of header row (logo, title, etc.) */
  headerStart: ReactNode
  rooms: ChatRoomListItem[]
  roomsLoading: boolean
  activeRoomId: number | null
  onSelectRoom: (room: ChatRoomListItem) => void
  currentUserId: number | null
  onPickUser: (user: SearchUserResult) => Promise<void>
}

export function ChatInboxSidebar({
  variant,
  headerStart,
  rooms,
  roomsLoading,
  activeRoomId,
  onSelectRoom,
  currentUserId,
  onPickUser,
}: ChatInboxSidebarProps) {
  const [searchMode, setSearchMode] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const { users, loading: searchLoading } = useUserSearch(searchKeyword)

  const isCompact = variant === "compact"

  const handleSelectRoom = (room: ChatRoomListItem) => {
    setSearchMode(false)
    setSearchKeyword("")
    onSelectRoom(room)
  }

  const handleSelectUser = async (user: SearchUserResult) => {
    if (!currentUserId) {
      message.warning(VI.common.messages.chatNeedLogin)
      return
    }
    try {
      await onPickUser(user)
      setSearchMode(false)
      setSearchKeyword("")
    } catch {
      /* parent already showed toast */
    }
  }

  return (
    <div
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-slate-100",
        isCompact ? "w-[140px]" : "min-w-0 w-72",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center justify-between border-b border-slate-100",
          isCompact ? "px-2" : "px-4",
        )}
      >
        <div className="min-w-0 flex-1 overflow-hidden">{headerStart}</div>
        <button
          type="button"
          onClick={() => {
            setSearchMode(true)
            setSearchKeyword("")
          }}
          className={cn(
            "ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors",
            searchMode
              ? "bg-pink-100 text-pink-500"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
          )}
          aria-label={VI.common.messages.chatSearchAria}
        >
          <Search className={cn(isCompact ? "h-3.5 w-3.5" : "h-4 w-4")} />
        </button>
      </div>

      {searchMode && (
        <div className={cn("shrink-0 border-b border-slate-100", isCompact ? "p-2" : "p-3")}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={VI.common.messages.chatSearchPlaceholder}
              className={cn(
                "h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-8 pr-8 text-slate-700 placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:outline-none",
                isCompact ? "text-xs" : "text-sm",
              )}
            />
            {searchKeyword ? (
              <button
                type="button"
                onClick={() => setSearchKeyword("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={VI.common.actions.close}
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {searchMode ? (
          searchLoading ? (
            <div className={cn("flex flex-col gap-2", isCompact ? "p-2" : "p-3")}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-2 w-1/2 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className={cn("flex w-full flex-col gap-0.5", isCompact ? "p-1.5" : "p-2")}>
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => void handleSelectUser(user)}
                  className="group relative flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-pink-50"
                >
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-100 to-pink-200 text-[10px] font-semibold text-pink-600">
                        {computeInitials(user.fullName)}
                      </div>
                    )}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-100 bg-white px-2.5 py-1.5 text-xs text-slate-700 opacity-0 shadow-lg shadow-xl transition-opacity group-hover:opacity-100">
                      <span className="block font-medium">{user.fullName}</span>
                      <span className="block text-slate-400">@{user.username}</span>
                      <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-full rotate-45 border-b border-r border-slate-100 bg-white" />
                    </div>
                  </div>
                  <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <span className="truncate text-xs font-medium text-slate-700">{user.fullName}</span>
                    <span className="truncate text-[10px] text-slate-400">{user.role}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : searchKeyword.trim() ? (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-slate-400">
              <User className="h-6 w-6 text-slate-300" />
              <p className="text-xs">{VI.common.messages.chatNoUsersFound}</p>
            </div>
          ) : null
        ) : roomsLoading ? (
          <div className={cn("flex flex-col gap-2", isCompact ? "p-2" : "p-3")}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-slate-100" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ChatRoomList
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={handleSelectRoom}
          />
        )}
      </div>

      {searchMode ? (
        <div className={cn("shrink-0 border-t border-slate-100", isCompact ? "p-2" : "p-3")}>
          <button
            type="button"
            onClick={() => {
              setSearchMode(false)
              setSearchKeyword("")
            }}
            className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <X className="h-3 w-3" />
            {VI.common.messages.chatExitSearch}
          </button>
        </div>
      ) : null}
    </div>
  )
}
