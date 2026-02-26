import { Button } from "@/shared/components/Button"
import { cn } from "@/lib/utils"
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
  <section className="mx-auto w-full max-w-6xl px-4 pt-6" data-reveal="true">
    <div className="flex flex-wrap items-center gap-3">
      {tags.map((tag) => {
        const isActive = tag.key === activeTag
        return (
          <Button
            key={tag.key}
            variant={isActive ? "soft" : "outline"}
            size="sm"
            className={cn(
              "rounded-full border-pink-100",
              isActive
                ? "bg-pink-100 text-pink-700"
                : "bg-white text-slate-600"
            )}
            onClick={() => onTagChange(tag.key)}
          >
            {tag.label}
          </Button>
        )
      })}
    </div>
  </section>
)
