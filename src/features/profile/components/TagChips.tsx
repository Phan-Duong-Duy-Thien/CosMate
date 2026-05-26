import type { ReactNode } from "react"

interface TagChipsProps {
  tags: string[]
  renderTag?: (tag: string) => ReactNode
}

export function TagChips({ tags, renderTag }: TagChipsProps) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) =>
        renderTag ? (
          renderTag(tag)
        ) : (
          <span
            key={tag}
            className="rounded-full bg-cosmate-soft-pink/70 px-3 py-1 text-xs font-medium text-cosmate-pink"
          >
            #{tag}
          </span>
        )
      )}
    </div>
  )
}
