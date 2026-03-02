import * as React from "react"
import { ChevronDown } from "lucide-react"
import type { SortOption } from "../types"
import { cn } from "@/lib/utils"

interface SortDropdownProps {
  value: SortOption
  options: { value: SortOption; label: string }[]
  onChange: (value: SortOption) => void
  label?: string
  className?: string
}

export function SortDropdown({
  value,
  options,
  onChange,
  label = "SORT BY",
  className,
}: SortDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [open])

  const currentLabel = options.find((o) => o.value === value)?.label ?? value

  return (
    <div className={cn("flex items-center gap-2", className)} ref={ref}>
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Sort by"
          aria-expanded={open}
          aria-haspopup="listbox"
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:border-purple-200 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-200"
        >
          {currentLabel}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <ul
            role="listbox"
            className="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            {options.map((opt) => (
              <li key={opt.value} role="option" aria-selected={value === opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm font-medium transition-colors",
                    value === opt.value
                      ? "bg-purple-50 text-purple-700"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
