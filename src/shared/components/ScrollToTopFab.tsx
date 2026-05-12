import * as React from "react"
import { ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"

const SCROLL_THRESHOLD_PX = 280

/**
 * Floating “scroll to top” control (neobrutal sticker style).
 * Placed bottom-left so it does not overlap the chat panel (bottom-right).
 */
export function ScrollToTopFab() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD_PX)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label={VI.common.actions.scrollToTop}
      title={VI.common.actions.scrollToTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-sans text-white shadow-[6px_6px_0_0_#1e1b4b] transition-all duration-300 md:h-16 md:w-16",
        "hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#1e1b4b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 active:translate-y-0 active:shadow-[3px_3px_0_0_#1e1b4b] motion-safe:hover:-translate-y-0.5",
        "pointer-events-none scale-95 opacity-0",
        visible && "pointer-events-auto scale-100 opacity-100"
      )}
    >
      <ChevronUp className="h-7 w-7 shrink-0 md:h-8 md:w-8" strokeWidth={2.5} aria-hidden />
    </button>
  )
}
