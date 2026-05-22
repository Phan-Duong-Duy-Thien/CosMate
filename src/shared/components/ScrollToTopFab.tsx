import * as React from "react"
import { MessageOutlined } from "@ant-design/icons"
import { ChevronUp } from "lucide-react"

import { useChatPopup } from "@/features/chat/components/ChatPopupContext"
import { isAuthenticated } from "@/features/auth/utils/authStorage"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"

const SCROLL_THRESHOLD_PX = 280

const FAB_BASE =
  "fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-sans text-white shadow-[6px_6px_0_0_#1e1b4b] transition-all duration-300 md:h-16 md:w-16 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#1e1b4b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 active:translate-y-0 active:shadow-[3px_3px_0_0_#1e1b4b] motion-safe:hover:-translate-y-0.5"

/**
 * Neo-brutal FAB stack (bottom-right): chat toggle below, scroll-to-top above.
 */
export function ScrollToTopFab() {
  const [scrollVisible, setScrollVisible] = React.useState(false)
  const { isOpen: chatOpen, toggleChat } = useChatPopup()
  const loggedIn = isAuthenticated()

  React.useEffect(() => {
    const onScroll = () => setScrollVisible(window.scrollY > SCROLL_THRESHOLD_PX)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {loggedIn ? (
        <button
          type="button"
          aria-label={chatOpen ? VI.common.actions.close : VI.common.railChatCta}
          title={chatOpen ? VI.common.actions.close : VI.common.railChatCta}
          onClick={toggleChat}
          className={cn(FAB_BASE, "bottom-6", chatOpen && "ring-4 ring-pink-300/80")}
        >
          <MessageOutlined className="text-[26px] md:text-[30px]" aria-hidden />
        </button>
      ) : null}

      <button
        type="button"
        aria-label={VI.common.actions.scrollToTop}
        title={VI.common.actions.scrollToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          FAB_BASE,
          "bottom-24",
          "pointer-events-none scale-95 opacity-0",
          scrollVisible && "pointer-events-auto scale-100 opacity-100"
        )}
      >
        <ChevronUp className="h-7 w-7 shrink-0 md:h-8 md:w-8" strokeWidth={2.5} aria-hidden />
      </button>
    </>
  )
}
