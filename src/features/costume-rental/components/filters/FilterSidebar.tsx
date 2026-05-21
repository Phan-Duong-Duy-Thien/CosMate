import * as React from "react"

import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import { cn } from "@/lib/utils"
import type { FilterState, RegionKey } from "../../types"
import { DualPriceRangeSlider } from "./DualPriceRangeSlider"

const ratingOptions = [
  { label: "Từ 4.0 sao", value: 4.0 },
  { label: "Từ 4.5 sao", value: 4.5 },
  { label: "Từ 4.8 sao", value: 4.8 },
]

interface FilterSidebarProps {
  filters: FilterState
  regions: { key: RegionKey; label: string }[]
  brands: string[]
  priceBounds: { min: number; max: number }
  resultCount: number
  onUpdate: (next: Partial<FilterState>) => void
  onReset: () => void
}

const toggleFromList = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

export const FilterSidebar = ({
  filters,
  regions,
  brands,
  priceBounds,
  resultCount,
  onUpdate,
  onReset,
}: FilterSidebarProps) => {
  const { min: boundMin, max: boundMax } = priceBounds

  const rawLow = filters.priceMin ?? boundMin
  const rawHigh = filters.priceMax ?? boundMax
  let displayLow = Math.min(Math.max(rawLow, boundMin), boundMax)
  let displayHigh = Math.min(Math.max(rawHigh, boundMin), boundMax)
  if (displayHigh < displayLow) displayHigh = displayLow

  const handlePriceRange = (low: number, high: number) => {
    const nextMin = low <= boundMin ? null : low
    const nextMax = high >= boundMax ? null : high
    onUpdate({ priceMin: nextMin, priceMax: nextMax })
  }

  return (
    <aside className="h-auto w-full self-start rounded-[1.2rem] border-[4px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[9px_9px_0_0_rgba(30,27,75,0.25)] backdrop-blur lg:sticky lg:top-[84px]">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-indigo-950">
          Bộ lọc
        </h2>
        <span className="rounded-full border-2 border-indigo-950 bg-pink-100 px-2.5 py-0.5 text-xs font-bold text-indigo-900">
          {resultCount} kết quả
        </span>
      </div>

      <div className="mt-4 space-y-5 text-sm">
        <div className="space-y-3">
          <p className="font-extrabold text-indigo-900">Từ khóa</p>
          <Input
            placeholder="Tên nhân vật, tên shop, tên trang phục…"
            value={filters.keyword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onUpdate({ keyword: event.target.value })
            }
          />
        </div>

        <div className="space-y-3">
          <p className="font-extrabold text-indigo-900">Khu vực</p>
          <div className="space-y-2">
            {regions.map((region) => (
              <label
                key={region.key}
                className="flex items-center gap-2 text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={filters.regionKeys.includes(region.key)}
                  onChange={() =>
                    onUpdate({
                      regionKeys: toggleFromList(filters.regionKeys, region.key),
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-pink-500 focus-visible:ring-pink-200"
                />
                <span>{region.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-extrabold text-indigo-900">Thương hiệu</p>
          <div className="grid grid-cols-1 gap-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={filters.brandKeys.includes(brand)}
                  onChange={() =>
                    onUpdate({
                      brandKeys: toggleFromList(filters.brandKeys, brand),
                    })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-pink-500 focus-visible:ring-pink-200"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-extrabold text-indigo-900">Theo đánh giá</p>
          <div className="space-y-2">
            {ratingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-slate-600"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === option.value}
                  onChange={() => onUpdate({ minRating: option.value })}
                  className="h-4 w-4 text-pink-500 focus-visible:ring-pink-200"
                />
                <span>{option.label}</span>
              </label>
            ))}
            <button
              type="button"
              onClick={() => onUpdate({ minRating: null })}
              className="text-xs font-semibold text-slate-500 hover:text-pink-500"
            >
              Bỏ chọn
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-extrabold text-indigo-900">Khoảng giá</p>
          <DualPriceRangeSlider
            min={boundMin}
            max={boundMax}
            low={displayLow}
            high={displayHigh}
            step={boundMax >= 1_000_000 ? 50_000 : boundMax >= 100_000 ? 10_000 : 1_000}
            onChange={handlePriceRange}
          />
        </div>

        <div className="space-y-3">
          <p className="font-extrabold text-indigo-900">Tùy chọn thêm</p>
          <div className="space-y-2">
            {[
              {
                label: "Có phụ kiện",
                checked: filters.hasAccessories,
                key: "hasAccessories",
              },
              {
                label: "Còn hàng",
                checked: filters.onlyAvailable,
                key: "onlyAvailable",
              },
              
            ].map((toggle) => (
              <label
                key={toggle.key}
                className="flex items-center gap-2 text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={toggle.checked}
                  onChange={() =>
                    onUpdate({ [toggle.key]: !toggle.checked } as Partial<FilterState>)
                  }
                  className="h-4 w-4 rounded border-slate-300 text-pink-500 focus-visible:ring-pink-200"
                />
                <span>{toggle.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onReset}
          className="w-full rounded-xl border-[3px] border-indigo-950 bg-white font-bold text-indigo-900 hover:bg-indigo-50"
        >
          Reset bộ lọc
        </Button>
      </div>
    </aside>
  )
}
