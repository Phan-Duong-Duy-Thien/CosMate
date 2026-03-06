import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/Button"

export interface DropdownMenuItem {
  label: string
  onSelect?: () => void
}

export interface DropdownMenuProps {
  triggerLabel?: React.ReactNode
  triggerAriaLabel?: string
  items: DropdownMenuItem[]
  triggerIcon?: React.ReactNode
  className?: string
  triggerClassName?: string
  menuClassName?: string
}

export const DropdownMenu = ({
  triggerLabel = "",
  triggerAriaLabel,
  items,
  triggerIcon,
  className,
  triggerClassName,
  menuClassName,
}: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1 text-slate-700 hover:text-pink-600 hover:bg-pink-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200",
          triggerClassName
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={
          triggerAriaLabel ??
          (typeof triggerLabel === "string" ? triggerLabel : undefined)
        }
        onClick={() => setOpen((prev) => !prev)}
      >
        {triggerLabel}
        {triggerIcon}
      </Button>

      {open && (
        <div
          role="menu"
          className={cn(
            // position
            "absolute left-0 top-full mt-2 z-50",
            // sizing
            "min-w-[180px]",
            // visuals (pastel)
            "overflow-hidden rounded-xl border border-pink-100 bg-white/95 shadow-lg backdrop-blur-md",
            // subtle animation
            "origin-top-left animate-in fade-in zoom-in-95",
            menuClassName
          )}
        >
          <div className="py-2">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={cn(
                  "flex w-full items-center px-4 py-2 text-left text-sm",
                  "text-slate-700 hover:bg-pink-50 hover:text-pink-700",
                  "focus-visible:outline-none focus-visible:bg-pink-50"
                )}
                onClick={() => {
                  item.onSelect?.()
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}