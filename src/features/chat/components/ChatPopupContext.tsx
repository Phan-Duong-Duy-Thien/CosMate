import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface ChatPopupState {
  isOpen: boolean
  roomId: number | null
  partnerId: number | null
  partnerName: string | null
}

interface ChatPopupContextValue extends ChatPopupState {
  openChat: (roomId: number, partnerId: number, partnerName?: string) => void
  closeChat: () => void
}

const ChatPopupContext = createContext<ChatPopupContextValue | null>(null)

export function ChatPopupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChatPopupState>({
    isOpen: false,
    roomId: null,
    partnerId: null,
    partnerName: null,
  })

  const openChat = useCallback((roomId: number, partnerId: number, partnerName?: string) => {
    setState({ isOpen: true, roomId, partnerId, partnerName: partnerName ?? null })
  }, [])

  const closeChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }))
  }, [])

  return (
    <ChatPopupContext.Provider value={{ ...state, openChat, closeChat }}>
      {children}
    </ChatPopupContext.Provider>
  )
}

export function useChatPopup(): ChatPopupContextValue {
  const ctx = useContext(ChatPopupContext)
  if (!ctx) {
    throw new Error("useChatPopup must be used within ChatPopupProvider")
  }
  return ctx
}
