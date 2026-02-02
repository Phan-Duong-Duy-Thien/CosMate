import * as React from "react"

import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  icon?: React.ReactNode
  accent?: boolean
  action?: React.ReactNode
  className?: string
}

export const SectionHeader = ({
  title,
  icon,
  accent,
  action,
  className,
}: SectionHeaderProps) => (
  <div className={cn("flex flex-wrap items-center justify-between gap-4", className)}>
    <div className="flex items-center gap-3">
      {accent && (
        <span className="h-10 w-1 rounded-full bg-gradient-to-b from-pink-400 to-purple-400" />
      )}
      {icon && <span className="text-yellow-400">{icon}</span>}
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
    </div>
    {action}
  </div>
)
