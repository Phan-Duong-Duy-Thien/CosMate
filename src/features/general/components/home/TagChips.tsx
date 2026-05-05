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
    <div className="relative overflow-hidden rounded-[1.35rem] border-[5px] border-indigo-950 bg-gradient-to-br from-[#fef9c3] via-[#fce7f3] to-[#dbeafe] p-5 shadow-[12px_12px_0_0_rgba(30,27,75,0.85)] md:rounded-[1.65rem] md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-[4px] border-indigo-950/15 bg-white/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-8 h-16 w-16 rotate-12 rounded-lg border-[3px] border-indigo-950/10 bg-pink-300/30"
      />

      <div className="relative mb-5 space-y-2 md:mb-6">
        <h3 className="text-lg font-extrabold tracking-tight text-indigo-950 md:text-xl">
          <span className="bg-gradient-to-r from-violet-700 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            ★ {VI.general.home.browseByTheme}
          </span>
        </h3>
        <p className="max-w-2xl text-sm font-semibold leading-relaxed text-indigo-900/85">
          {VI.general.home.browseByThemeHint}
        </p>
      </div>

      <div className="relative -mx-1 flex gap-3 overflow-x-auto pb-1 scrollbar-hide md:flex-wrap md:overflow-visible md:pb-0">
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
                "shrink-0 rounded-xl border-[3px] font-extrabold transition-all duration-200",
                isActive
                  ? "border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-[6px_6px_0_0_#1e1b4b] hover:from-pink-600 hover:to-fuchsia-700"
                  : "border-indigo-950 bg-white text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.45)] hover:-translate-y-0.5 hover:bg-[#fffbeb] hover:shadow-[6px_6px_0_0_rgba(30,27,75,0.55)]"
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
