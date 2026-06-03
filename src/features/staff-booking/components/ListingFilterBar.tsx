import type { ReactNode } from "react"
import { Search, MapPin, ChevronDown } from "lucide-react"

import { Input } from "@/features/staff-booking/components/ui/input"
import { Button } from "@/features/staff-booking/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/features/staff-booking/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const menuContentClass =
  "z-[200] rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] p-1 shadow-[8px_8px_0_0_rgba(30,27,75,0.35)] font-semibold"

const menuItemClass =
  "cursor-pointer rounded-lg font-semibold text-indigo-950 focus:bg-pink-100 focus:text-indigo-950"

const triggerClass =
  "h-11 rounded-xl border-[3px] border-indigo-950 bg-white px-3 font-bold text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.22)] hover:bg-pink-50"

/** Anchor for filter dropdowns: relative + non-portaled menu sits under trigger */
const filterDropdownWrap = "relative z-[200] inline-flex shrink-0"

interface ListingFilterBarProps {
  className?: string
  search: string
  onSearchChange: (search: string) => void
  selectedCity: string
  onCityChange: (city: string) => void
  selectedSort: string
  onSortChange: (sort: string) => void
}

function FilterDropdown({
  trigger,
  children,
  align = "start",
  contentClassName,
}: {
  trigger: ReactNode
  children: ReactNode
  align?: "start" | "end" | "center"
  contentClassName?: string
}) {
  return (
    <DropdownMenu modal={false}>
      <div className={filterDropdownWrap}>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          portal={false}
          side="bottom"
          align={align}
          sideOffset={8}
          className={cn(menuContentClass, contentClassName)}
        >
          {children}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  )
}

export function ListingFilterBar({
  className,
  search,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedSort,
  onSortChange,
}: ListingFilterBarProps) {
  return (
    <div
      className={cn(
        "relative z-30 flex flex-col items-stretch gap-3 overflow-visible rounded-[1.15rem] border-[4px] border-indigo-950 bg-[#fffbeb]/95 p-3 shadow-[8px_8px_0_0_rgba(30,27,75,0.32)] backdrop-blur-sm md:flex-row md:items-center md:gap-3 md:p-4",
        className
      )}
    >
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-950/55"
          aria-hidden
        />
        <Input
          placeholder="Tìm theo tên hoặc phong cách..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 rounded-xl border-[3px] border-indigo-950/25 bg-white pl-10 pr-3 text-sm font-semibold text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.12)] placeholder:text-slate-500 focus:border-indigo-950 focus:ring-2 focus:ring-pink-300"
        />
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
        <FilterDropdown
          contentClassName="w-52"
          trigger={
            <Button variant="outline" className={cn(triggerClass, "gap-2")}>
              <MapPin className="h-4 w-4 shrink-0 text-pink-600" />
              {selectedCity || "Khu vực"}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
            </Button>
          }
        >
          <DropdownMenuItem className={menuItemClass} onClick={() => onCityChange("")}>
            Tất cả khu vực
          </DropdownMenuItem>
          <DropdownMenuItem className={menuItemClass} onClick={() => onCityChange("Hà Nội")}>
            Hà Nội
          </DropdownMenuItem>
          <DropdownMenuItem
            className={menuItemClass}
            onClick={() => onCityChange("TP. Hồ Chí Minh")}
          >
            TP. Hồ Chí Minh
          </DropdownMenuItem>
          <DropdownMenuItem className={menuItemClass} onClick={() => onCityChange("Đà Nẵng")}>
            Đà Nẵng
          </DropdownMenuItem>
        </FilterDropdown>

        <div className="mx-1 hidden h-8 w-[3px] bg-indigo-950/15 md:block" aria-hidden />

        <div className="flex min-w-[10rem] flex-1 items-center justify-end gap-2 text-xs md:flex-initial md:justify-start">
          <span className="font-extrabold uppercase tracking-wide text-indigo-800/65">
            Sắp xếp:
          </span>
          <FilterDropdown
            align="end"
            contentClassName="w-56"
            trigger={
              <button
                type="button"
                className={cn(triggerClass, "inline-flex items-center gap-1 px-3 text-xs")}
              >
                {selectedSort}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            }
          >
            <DropdownMenuItem className={menuItemClass} onClick={() => onSortChange("Đề xuất")}>
              Đề xuất
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => onSortChange("Đánh giá cao nhất")}
            >
              Đánh giá cao nhất
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => onSortChange("Giá: thấp → cao")}
            >
              Giá: thấp → cao
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => onSortChange("Giá: cao → thấp")}
            >
              Giá: cao → thấp
            </DropdownMenuItem>
          </FilterDropdown>
        </div>
      </div>
    </div>
  )
}
