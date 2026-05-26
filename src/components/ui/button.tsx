import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-0 bg-primary text-primary-foreground shadow-sm ring-0 hover:bg-primary/90",
        /** CosMate brand — use on dashboard toolbars & primary CTAs */
        cosmate:
          "border-0 bg-cosmate-soft-pink text-foreground shadow-none ring-0 hover:bg-cosmate-pink/35 focus-visible:ring-cosmate-pink/40",
        cosmateOutline:
          "border-0 bg-background text-foreground shadow-none ring-1 ring-inset ring-cosmate-pink/22 hover:bg-cosmate-soft-pink/40 hover:ring-cosmate-pink/32 focus-visible:ring-cosmate-pink/35",
        outline:
          "border-0 bg-background text-foreground shadow-none ring-1 ring-inset ring-border/55 hover:bg-accent hover:ring-border/80 focus-visible:ring-ring/35",
        ghost: "border-0 text-foreground ring-0 hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
