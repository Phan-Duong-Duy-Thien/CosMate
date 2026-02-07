import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/Button"

export interface DropdownMenuItem {
  label: string
  onSelect?: () => void
}

export interface DropdownMenuProps {
  triggerLabel?: string
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
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn("gap-1 text-slate-700 hover:text-pink-600", triggerClassName)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerAriaLabel ?? triggerLabel}
        onClick={() => setOpen((prev) => !prev)}
      >
        {triggerLabel}
        {triggerIcon}
      </Button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute left-0 top-11 z-50 min-w-44 rounded-xl border border-slate-100 bg-white p-2 shadow-lg",
            menuClassName
          )}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200"
              onClick={() => {
                item.onSelect?.()
                setOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
