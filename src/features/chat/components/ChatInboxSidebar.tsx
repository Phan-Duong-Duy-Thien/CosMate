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
import { CHAT_UI } from "../constants/chatUi"

export type ChatInboxSidebarVariant = "compact" | "comfortable"

function computeInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export interface ChatInboxSidebarProps {
  variant: ChatInboxSidebarVariant
  theme?: "user" | "provider"
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
  theme = "user",
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
  const isProvider = theme === "provider"

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
        isProvider ? CHAT_UI.providerSidebar : CHAT_UI.sidebar,
        isProvider ? CHAT_UI.providerSidebarBorder : CHAT_UI.sidebarBorder,
        isCompact ? CHAT_UI.sidebarCompact : CHAT_UI.sidebarComfortable,
        "shrink-0",
      )}
    >
      <div
        className={cn(
          isProvider ? CHAT_UI.providerSidebarHeader : CHAT_UI.sidebarHeader,
          isCompact ? CHAT_UI.sidebarHeaderCompact : CHAT_UI.sidebarHeaderComfortable,
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
            "ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all",
            searchMode
              ? (isProvider ? "border border-violet-200 bg-violet-50 text-[#7C3AED]" : CHAT_UI.searchActive)
              : (isProvider ? "text-slate-400 hover:bg-slate-50 hover:text-slate-600" : CHAT_UI.searchIdle),
          )}
          aria-label={VI.common.messages.chatSearchAria}
        >
          <Search className={cn(isCompact ? "h-3.5 w-3.5" : "h-4 w-4")} />
        </button>
      </div>

      {searchMode && (
        <div
          className={cn(
            "shrink-0",
            isProvider ? CHAT_UI.providerSidebarDivider : CHAT_UI.sidebarDivider,
            isCompact ? CHAT_UI.sidebarSearchPadCompact : CHAT_UI.sidebarSearchPadComfortable,
          )}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={VI.common.messages.chatSearchPlaceholder}
              className={cn(
                isProvider
                  ? "w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-slate-800 placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-100"
                  : CHAT_UI.pillSearch,
                isCompact ? "h-8 pl-7 text-xs" : "h-9 pl-8 text-sm",
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

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible">
        {searchMode ? (
          searchLoading ? (
            <div className={cn("flex flex-col gap-2", isCompact ? "p-2" : "p-3")}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn("h-8 w-8 shrink-0", CHAT_UI.skeleton)} />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
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
                  title={isCompact ? `${user.fullName} (@${user.username})` : undefined}
                  onClick={() => void handleSelectUser(user)}
                  className={cn(
                    "group relative flex w-full items-center gap-2 rounded-xl border-2 border-transparent px-2 py-2 text-left transition-all",
                    isProvider ? "hover:bg-slate-50" : CHAT_UI.userRowHover,
                  )}
                >
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className={CHAT_UI.avatarSm}
                      />
                    ) : (
                      <div className={isProvider ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[10px] font-extrabold text-[#7C3AED]" : CHAT_UI.avatarFallbackSm}>
                        {computeInitials(user.fullName)}
                      </div>
                    )}
                    {!isCompact ? (
                      <div className={cn(CHAT_UI.tooltip, isProvider && "border-slate-200 bg-white shadow-sm shadow-slate-100 font-normal", "group-hover:opacity-100")}>
                        <span className="block font-medium">{user.fullName}</span>
                        <span className={isProvider ? "block font-normal text-slate-400" : CHAT_UI.tooltipSub}>@{user.username}</span>
                        <div className={cn(CHAT_UI.tooltipArrow, isProvider && "border-b border-r border-slate-200 bg-white")} />
                      </div>
                    ) : null}
                  </div>
                  <div className="flex w-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <span className={cn("truncate text-xs font-bold", isProvider ? "text-slate-800" : "text-indigo-950")}>{user.fullName}</span>
                    <span className={cn("truncate text-[10px] font-semibold", isProvider ? "text-slate-400" : "text-indigo-900/55")}>{user.role}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : searchKeyword.trim() ? (
            <div className={cn(CHAT_UI.emptyInbox, "p-4")}>
              <User className={cn("h-6 w-6", CHAT_UI.emptyIcon)} />
              <p className="text-xs">{VI.common.messages.chatNoUsersFound}</p>
            </div>
          ) : null
        ) : roomsLoading ? (
          <div className={cn("flex flex-col gap-2", isCompact ? "p-2" : "p-3")}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={cn("h-8 w-8 shrink-0", CHAT_UI.skeleton)} />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ChatRoomList
            rooms={rooms}
            activeRoomId={activeRoomId}
            onSelectRoom={handleSelectRoom}
            showHoverTooltip={!isCompact}
            theme={theme}
          />
        )}
      </div>

      {searchMode ? (
        <div
          className={cn(
            "shrink-0",
            isProvider ? "border-t border-slate-100 p-3" : "border-t-[2px] border-indigo-950/15",
            isCompact ? CHAT_UI.sidebarSearchPadCompact : CHAT_UI.sidebarSearchPadComfortable,
          )}
        >
          <button
            type="button"
            onClick={() => {
              setSearchMode(false)
              setSearchKeyword("")
            }}
            className={isProvider ? "flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700" : CHAT_UI.sidebarFooterBtn}
          >
            <X className="h-3 w-3" />
            {VI.common.messages.chatExitSearch}
          </button>
        </div>
      ) : null}
    </div>
  )
}
