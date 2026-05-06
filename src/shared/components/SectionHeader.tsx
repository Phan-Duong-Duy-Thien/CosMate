import * as React from "react"

import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  accent?: boolean
  action?: React.ReactNode
  className?: string
}

export const SectionHeader = ({
  title,
  description,
  icon,
  accent,
  action,
  className,
}: SectionHeaderProps) => (
  <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
    <div className="min-w-0 flex-1 space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        {accent && (
          <span className="h-6 w-1 shrink-0 rounded-full bg-pink-400" />
        )}
        {icon && <span className="shrink-0 text-yellow-400">{icon}</span>}
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      </div>
      {description ? (
        <p className="max-w-xl text-sm leading-relaxed text-slate-500">{description}</p>
      ) : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
)
