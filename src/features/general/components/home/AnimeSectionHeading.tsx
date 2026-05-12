import { Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

export interface AnimeSectionHeadingProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function AnimeSectionHeading({
  title,
  description,
  icon,
  action,
  className,
}: AnimeSectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-[3px] border-indigo-950 bg-gradient-to-br from-amber-300 via-orange-400 to-pink-400 text-indigo-950 shadow-[5px_5px_0_0_#1e1b4b]">
            {icon ?? <Sparkles className="h-5 w-5" aria-hidden />}
          </span>
          <h2 className="text-[1.35rem] font-extrabold leading-tight tracking-tight text-indigo-950 md:text-[1.75rem] font-sans">
            <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              「 {title} 」
            </span>
          </h2>
        </div>
        {description ? (
          <p className="max-w-xl rounded-2xl border-[3px] border-indigo-950 bg-[#fffbeb] px-4 py-3 text-sm font-semibold leading-relaxed text-indigo-950 shadow-[6px_6px_0_0_rgba(30,27,75,0.75)] font-sans">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 pt-1">{action}</div> : null}
    </div>
  )
}
