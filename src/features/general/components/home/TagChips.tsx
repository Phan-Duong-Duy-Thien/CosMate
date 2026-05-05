import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import type { TagKey } from "../../pages/home.types"

interface TagChip {
  key: TagKey
  label: string
}

interface TagChipsProps {
  tags: TagChip[]
  activeTag: TagKey
  onTagChange: (tag: TagKey) => void
}

export const TagChips = ({ tags, activeTag, onTagChange }: TagChipsProps) => (
  <section className="w-full pt-8 md:pt-10" data-reveal="true">
    <div className="rounded-2xl border border-pink-100/80 bg-gradient-to-br from-white via-pink-50/40 to-violet-50/30 p-4 shadow-sm md:p-5">
      <div className="mb-4 space-y-1 md:mb-5">
        <h3 className="text-base font-semibold text-slate-900 md:text-lg">
          {VI.general.home.browseByTheme}
        </h3>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          {VI.general.home.browseByThemeHint}
        </p>
      </div>
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 scrollbar-hide md:flex-wrap md:overflow-visible md:pb-0">
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
        {tags.map((tag) => {
          const isActive = tag.key === activeTag
          return (
            <Button
              key={tag.key}
              variant={isActive ? "soft" : "outline"}
              size="sm"
              className={cn(
                "shrink-0 rounded-full shadow-sm transition-all duration-200",
                isActive
                  ? "border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25 ring-2 ring-pink-300/50 ring-offset-2 ring-offset-pink-50/80 hover:from-pink-600 hover:to-rose-600"
                  : "border-slate-200/90 bg-white/90 text-slate-700 hover:border-pink-200 hover:bg-white hover:text-pink-700"
              )}
              onClick={() => onTagChange(tag.key)}
            >
              {tag.label}
            </Button>
          )
        })}
      </div>
    </div>
  </section>
)
