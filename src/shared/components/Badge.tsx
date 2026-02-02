import * as React from "react"

import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700",
        className
      )}
      {...props}
    />
  )
)

Badge.displayName = "Badge"
