import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VI } from "@/shared/i18n/vi"
import { cn } from "@/lib/utils"

type ConfirmButtonProps = {
  label: string
  type?: "button" | "submit"
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  variant?: "primaryGradient" | "default"
}

export function ConfirmButton({
  label,
  type = "button",
  loading = false,
  disabled = false,
  onClick,
  className,
  variant = "primaryGradient",
}: ConfirmButtonProps) {
  const isDisabled = disabled || loading
  const isGradient = variant === "primaryGradient"

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-full rounded-full",
        isGradient
          ? "border-2 border-cosmate-pink/45 bg-[image:var(--gradient-confirm-btn)] bg-[length:100%_100%] text-primary-foreground shadow-md shadow-cosmate-pink/15 hover:border-cosmate-pink/60 hover:bg-[image:var(--gradient-confirm-btn-hover)] hover:shadow-cosmate-pink/25"
          : undefined,
        className
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {loading ? VI.common.status.loadingEllipsis : label}
    </Button>
  )
}
