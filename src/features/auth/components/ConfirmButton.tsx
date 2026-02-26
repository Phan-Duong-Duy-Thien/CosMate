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
          ? "bg-[linear-gradient(90deg,#C4B5FD_0%,#F9A8D4_100%)] text-white shadow-md shadow-purple-200 hover:bg-[linear-gradient(90deg,#A78BFA_0%,#F472B6_100%)]"
          : undefined,
        className
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {loading ? VI.common.status.loadingEllipsis : label}
    </Button>
  )
}
