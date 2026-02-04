import * as React from "react"

import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import { cn } from "@/lib/utils"
import type { FilterState, RegionKey, TagKey } from "../../types"

const ratingOptions = [
  { label: "Từ 4.0 sao", value: 4.0 },
  { label: "Từ 4.5 sao", value: 4.5 },
  { label: "Từ 4.8 sao", value: 4.8 },
]

interface FilterSidebarProps {
  filters: FilterState
  regions: { key: RegionKey; label: string }[]
  brands: string[]
  tags: { key: TagKey; label: string }[]
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
  tags,
  resultCount,
  onUpdate,
  onReset,
}: FilterSidebarProps) => {
  const [minInput, setMinInput] = React.useState(
    filters.priceMin?.toString() ?? ""
  )
  const [maxInput, setMaxInput] = React.useState(
    filters.priceMax?.toString() ?? ""
  )

  React.useEffect(() => {
    setMinInput(filters.priceMin?.toString() ?? "")
    setMaxInput(filters.priceMax?.toString() ?? "")
  }, [filters.priceMin, filters.priceMax])

  const handleApplyPrice = () => {
    const nextMin = minInput ? Number(minInput) : null
    const nextMax = maxInput ? Number(maxInput) : null
    onUpdate({
      priceMin: Number.isNaN(nextMin) ? null : nextMin,
      priceMax: Number.isNaN(nextMax) ? null : nextMax,
    })
  }

  return (
    <aside className="w-full rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase text-slate-500">
          Bộ lọc tìm kiếm
        </h2>
        <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
          {resultCount} kết quả
        </span>
      </div>

      <div className="mt-5 space-y-6 text-sm">
        <div className="space-y-3">
          <p className="font-semibold text-slate-700">Từ khóa</p>
          <Input
            placeholder="Tên nhân vật, tên shop, tên trang phục…"
            value={filters.keyword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onUpdate({ keyword: event.target.value })
            }
          />
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-700">Khu vực</p>
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
          <p className="font-semibold text-slate-700">Thương hiệu</p>
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
          <p className="font-semibold text-slate-700">Theo đánh giá</p>
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
              className="text-xs text-slate-400 hover:text-pink-500"
            >
              Bỏ chọn
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-700">Khoảng giá (nghìn VND)</p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Min"
              value={minInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setMinInput(event.target.value)
              }
              className="h-9"
            />
            <span className="text-slate-400">-</span>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Max"
              value={maxInput}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setMaxInput(event.target.value)
              }
              className="h-9"
            />
            <Button
              variant="soft"
              size="sm"
              className="whitespace-nowrap"
              onClick={handleApplyPrice}
            >
              Áp dụng
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-700">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = filters.tagKeys.includes(tag.key)
              return (
                <Button
                  key={tag.key}
                  type="button"
                  variant={isActive ? "soft" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full border-pink-100",
                    isActive
                      ? "bg-pink-100 text-pink-700"
                      : "bg-white text-slate-600"
                  )}
                  onClick={() =>
                    onUpdate({
                      tagKeys: toggleFromList(filters.tagKeys, tag.key),
                    })
                  }
                >
                  {tag.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-slate-700">Tùy chọn thêm</p>
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
              {
                label: "Bán chạy",
                checked: filters.onlyBestSeller,
                key: "onlyBestSeller",
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

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onReset}
          className="w-full rounded-full border-pink-100 text-slate-600"
        >
          Reset bộ lọc
        </Button>
      </div>
    </aside>
  )
}
