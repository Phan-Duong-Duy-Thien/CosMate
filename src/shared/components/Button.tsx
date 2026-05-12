import * as React from "react"

import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "ghost" | "outline" | "soft" | "link"
type ButtonSize = "sm" | "md" | "lg" | "pill"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-cosmate-soft-pink text-foreground hover:bg-cosmate-pink/35 focus-visible:ring-cosmate-pink/50",
  ghost:
    "bg-transparent hover:bg-cosmate-soft-pink/50 text-foreground",
  outline:
    "border-2 border-cosmate-soft-pink bg-transparent hover:bg-cosmate-soft-pink text-foreground",
  soft:
    "bg-cosmate-rose-tag-bg text-cosmate-rose-tag-text hover:bg-cosmate-pink/25",
  link:
    "bg-transparent text-cosmate-pink hover:text-cosmate-pink/80 decoration-1 underline-offset-2 hover:underline",
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  pill: "h-11 px-6 rounded-full text-sm",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
)

Button.displayName = "Button"
