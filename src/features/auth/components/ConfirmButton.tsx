import { Loader2 } from "lucide-react"

import { Button } from "@/shared/components/Button"
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
      variant={isGradient ? "soft" : "outline"}
      className={cn(
        "w-full rounded-xl border-[3px] border-indigo-950 font-extrabold shadow-[5px_5px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#1e1b4b] focus-visible:ring-4 focus-visible:ring-pink-300 active:translate-y-0 active:shadow-[3px_3px_0_0_#1e1b4b] motion-safe:hover:-translate-y-0.5",
        isGradient &&
          "border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:brightness-105",
        !isGradient && "bg-[#fffbeb] text-indigo-950 hover:bg-pink-100",
        className
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {loading ? VI.common.status.loadingEllipsis : label}
    </Button>
  )
}
