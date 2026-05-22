import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  /** Tailwind z-index classes for overlay (e.g. above Ant Design Modal ~1000). */
  overlayClassName?: string
}

export const Dialog = ({ open, onOpenChange, children, overlayClassName }: DialogProps) => {
  React.useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        overlayClassName,
      )}
    >
      <button
        type="button"
        aria-label="Đóng"
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>,
    document.body
  )
}

export const DialogContent = ({
  className,
  children,
  onClose,
  closeClassName,
}: {
  className?: string
  children: React.ReactNode
  onClose?: () => void
  closeClassName?: string
}) => (
  <div
    role="dialog"
    aria-modal="true"
    className={cn(
      "relative z-10 w-full max-w-2xl rounded-3xl border border-cosmate-lavender-border bg-card p-6 shadow-xl",
      className
    )}
  >
    {onClose && (
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className={cn(
          "absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-cosmate-soft-pink/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/30",
          closeClassName,
        )}
      >
        <X className="h-4 w-4" />
      </button>
    )}
    {children}
  </div>
)
