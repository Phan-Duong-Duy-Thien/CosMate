interface TokenCostBadgeProps {
  cost: number
  className?: string
}

export function TokenCostBadge({ cost, className = "" }: TokenCostBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border-[2px] border-indigo-950 bg-pink-100 px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-indigo-950 shadow-[2px_2px_0_0_rgba(30,27,75,0.14)]",
        className,
      ].join(" ")}
    >
      - {cost} xu
    </span>
  )
}
