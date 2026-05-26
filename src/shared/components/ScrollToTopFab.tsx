import * as React from "react"
import { createPortal } from "react-dom"
import { useLocation } from "react-router-dom"
import { MessageOutlined } from "@ant-design/icons"
import { ChevronUp } from "lucide-react"

import { useChatPopup } from "@/features/chat/components/ChatPopupContext"
import { isAuthenticated } from "@/features/auth/utils/authStorage"
import { isDashboardShellPath } from "@/app/layouts/dashboardShellPaths"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"

const SCROLL_THRESHOLD_PX = 280
const DASHBOARD_SCROLL_SELECTOR = "[data-cosmate-dashboard-scroll]"

const FAB_BUTTON =
  "pointer-events-auto flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-sans text-white shadow-[6px_6px_0_0_#1e1b4b] transition-all duration-300 md:h-16 md:w-16 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#1e1b4b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 active:translate-y-0 active:shadow-[3px_3px_0_0_#1e1b4b] motion-safe:hover:-translate-y-0.5"

/**
 * Floating action stack (portal → body): chat + scroll-to-top.
 * Overlay only — does not participate in page layout on any route.
 */
export function ScrollToTopFab() {
  const location = useLocation()
  const [scrollVisible, setScrollVisible] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const { isOpen: chatOpen, toggleChat } = useChatPopup()
  const loggedIn = isAuthenticated()
  const useDashboardScroll = isDashboardShellPath(location.pathname)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const updateVisibility = (scrollTop: number) => {
      setScrollVisible(scrollTop > SCROLL_THRESHOLD_PX)
    }

    if (!useDashboardScroll) {
      const onScroll = () => updateVisibility(window.scrollY)
      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }

    let el: HTMLElement | null = null
    let rafId = 0
    let cancelled = false

    const onScroll = () => {
      if (el) updateVisibility(el.scrollTop)
    }

    const bind = () => {
      if (cancelled) return
      el = document.querySelector(DASHBOARD_SCROLL_SELECTOR) as HTMLElement | null
      if (!el) {
        rafId = requestAnimationFrame(bind)
        return
      }
      onScroll()
      el.addEventListener("scroll", onScroll, { passive: true })
    }

    bind()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      el?.removeEventListener("scroll", onScroll)
    }
  }, [useDashboardScroll, location.pathname])

  const handleScrollToTop = () => {
    if (useDashboardScroll) {
      const el = document.querySelector(DASHBOARD_SCROLL_SELECTOR) as HTMLElement | null
      el?.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!mounted) return null

  const stack = (
    <div
      id="cosmate-floating-actions"
      className="pointer-events-none fixed bottom-6 right-6 z-100 flex flex-col-reverse items-center gap-3"
      aria-live="polite"
    >
      {loggedIn ? (
        <button
          type="button"
          aria-label={chatOpen ? VI.common.actions.close : VI.common.railChatCta}
          title={chatOpen ? VI.common.actions.close : VI.common.railChatCta}
          onClick={toggleChat}
          className={cn(FAB_BUTTON, chatOpen && "ring-4 ring-pink-300/80")}
        >
          <MessageOutlined className="text-[26px] md:text-[30px]" aria-hidden />
        </button>
      ) : null}

      <button
        type="button"
        aria-label={VI.common.actions.scrollToTop}
        title={VI.common.actions.scrollToTop}
        onClick={handleScrollToTop}
        className={cn(
          FAB_BUTTON,
          "pointer-events-none scale-95 opacity-0",
          scrollVisible && "pointer-events-auto scale-100 opacity-100",
        )}
      >
        <ChevronUp className="h-7 w-7 shrink-0 md:h-8 md:w-8" strokeWidth={2.5} aria-hidden />
      </button>
    </div>
  )

  return createPortal(stack, document.body)
}
