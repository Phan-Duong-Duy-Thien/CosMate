import * as React from "react"

import { cn } from "@/lib/utils"

interface DualPriceRangeSliderProps {
  min: number
  max: number
  low: number
  high: number
  step?: number
  onChange: (low: number, high: number) => void
  className?: string
}

type ActiveThumb = "low" | "high" | null

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v

export function DualPriceRangeSlider({
  min,
  max,
  low,
  high,
  step = 10,
  onChange,
  className,
}: DualPriceRangeSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState<ActiveThumb>(null)

  const span = Math.max(max - min, 1)
  const lowPct = ((clamp(low, min, max) - min) / span) * 100
  const highPct = ((clamp(high, min, max) - min) / span) * 100

  const snap = React.useCallback(
    (raw: number) => {
      const stepped = Math.round((raw - min) / step) * step + min
      return clamp(stepped, min, max)
    },
    [min, max, step]
  )

  const valueFromClientX = React.useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return min
      const rect = track.getBoundingClientRect()
      if (rect.width <= 0) return min
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
      return snap(min + ratio * span)
    },
    [min, span, snap]
  )

  const startDrag = (thumb: "low" | "high") => (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setActive(thumb)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!active) return
    const next = valueFromClientX(event.clientX)
    if (active === "low") {
      onChange(Math.min(next, high), high)
    } else {
      onChange(low, Math.max(next, low))
    }
  }

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setActive(null)
  }

  const handleTrackPointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.target !== event.currentTarget) return
    const next = valueFromClientX(event.clientX)
    const distLow = Math.abs(next - low)
    const distHigh = Math.abs(next - high)
    if (distLow <= distHigh) {
      onChange(Math.min(next, high), high)
    } else {
      onChange(low, Math.max(next, low))
    }
  }

  const handleKey = (thumb: "low" | "high") => (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    const big = step * 10
    let delta = 0
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") delta = -step
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") delta = step
    else if (event.key === "PageDown") delta = -big
    else if (event.key === "PageUp") delta = big
    else if (event.key === "Home") {
      event.preventDefault()
      if (thumb === "low") onChange(min, high)
      else onChange(low, low)
      return
    } else if (event.key === "End") {
      event.preventDefault()
      if (thumb === "low") onChange(high, high)
      else onChange(low, max)
      return
    } else return

    event.preventDefault()
    if (thumb === "low") {
      onChange(clamp(low + delta, min, high), high)
    } else {
      onChange(low, clamp(high + delta, low, max))
    }
  }

  const thumbClass = (isActive: boolean) =>
    cn(
      "absolute top-1/2 z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-[2px] border-indigo-950 bg-white shadow-[2px_2px_0_0_rgba(30,27,75,0.45)] outline-none transition-transform",
      "hover:scale-110 focus-visible:ring-2 focus-visible:ring-pink-300",
      isActive && "scale-110 cursor-grabbing bg-pink-100"
    )

  return (
    <div className={cn("select-none space-y-3", className)}>
      <div className="px-2.5">
        <div
          ref={trackRef}
          className="relative h-6 cursor-pointer"
          onPointerDown={handleTrackPointerDown}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full border-2 border-indigo-950/25 bg-white"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500"
            style={{
              left: `${lowPct}%`,
              width: `${Math.max(highPct - lowPct, 0)}%`,
            }}
          />

          <button
            type="button"
            role="slider"
            aria-label="Giá tối thiểu"
            aria-valuemin={min}
            aria-valuemax={high}
            aria-valuenow={low}
            tabIndex={0}
            onPointerDown={startDrag("low")}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={handleKey("low")}
            style={{ left: `${lowPct}%` }}
            className={thumbClass(active === "low")}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-pink-500" />
          </button>

          <button
            type="button"
            role="slider"
            aria-label="Giá tối đa"
            aria-valuemin={low}
            aria-valuemax={max}
            aria-valuenow={high}
            tabIndex={0}
            onPointerDown={startDrag("high")}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={handleKey("high")}
            style={{ left: `${highPct}%` }}
            className={thumbClass(active === "high")}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-fuchsia-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PriceInput
          label="Giá tối thiểu"
          value={low}
          placeholder={min}
          onCommit={(v) => onChange(clamp(snap(v), min, high), high)}
        />
        <span className="text-xs font-bold text-indigo-950/40">—</span>
        <PriceInput
          label="Giá tối đa"
          value={high}
          placeholder={max}
          onCommit={(v) => onChange(low, clamp(snap(v), low, max))}
        />
      </div>
    </div>
  )
}

interface PriceInputProps {
  label: string
  value: number
  placeholder: number
  onCommit: (next: number) => void
}

function PriceInput({ label, value, placeholder, onCommit }: PriceInputProps) {
  const [draft, setDraft] = React.useState<string>(() => value.toLocaleString("vi-VN"))
  const [focused, setFocused] = React.useState(false)

  React.useEffect(() => {
    if (!focused) setDraft(value.toLocaleString("vi-VN"))
  }, [value, focused])

  const commit = () => {
    const digits = draft.replace(/\D/g, "")
    if (!digits) {
      onCommit(placeholder)
      return
    }
    onCommit(Number(digits))
  }

  return (
    <label className="flex flex-1 items-center gap-1 rounded-lg border-[2px] border-indigo-950/25 bg-white px-2 py-1 shadow-[2px_2px_0_0_rgba(30,27,75,0.12)] focus-within:border-indigo-950 focus-within:ring-2 focus-within:ring-pink-200">
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={draft}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "")
          if (!raw) {
            setDraft("")
            return
          }
          setDraft(Number(raw).toLocaleString("vi-VN"))
        }}
        onFocus={(e) => {
          setFocused(true)
          e.currentTarget.select()
        }}
        onBlur={() => {
          setFocused(false)
          commit()
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commit()
            e.currentTarget.blur()
          } else if (e.key === "Escape") {
            setDraft(value.toLocaleString("vi-VN"))
            e.currentTarget.blur()
          }
        }}
        className="w-full min-w-0 bg-transparent text-xs font-extrabold tabular-nums text-indigo-900 outline-none placeholder:font-semibold placeholder:text-slate-400"
        placeholder={placeholder.toLocaleString("vi-VN")}
      />
      <span aria-hidden className="shrink-0 text-[10px] font-bold text-indigo-950/55">
        đ
      </span>
    </label>
  )
}
