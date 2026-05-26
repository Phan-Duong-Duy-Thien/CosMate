import { Search, MapPin, DollarSign, Calendar, ChevronDown } from "lucide-react"

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
  "rounded-xl border-[3px] border-indigo-950 bg-[#fffbeb] p-1 shadow-[8px_8px_0_0_rgba(30,27,75,0.35)] font-semibold"

const menuItemClass =
  "cursor-pointer rounded-lg font-semibold text-indigo-950 focus:bg-pink-100 focus:text-indigo-950"

const triggerClass =
  "h-11 rounded-xl border-[3px] border-indigo-950 bg-white px-3 font-bold text-indigo-950 shadow-[4px_4px_0_0_rgba(30,27,75,0.22)] hover:bg-pink-50"

interface ListingFilterBarProps {
  className?: string
}

export function ListingFilterBar({ className }: ListingFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-stretch gap-3 rounded-[1.15rem] border-[4px] border-indigo-950 bg-[#fffbeb]/95 p-3 shadow-[8px_8px_0_0_rgba(30,27,75,0.32)] backdrop-blur-sm md:flex-row md:items-center md:gap-3 md:p-4",
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
          className="h-11 rounded-xl border-[3px] border-indigo-950/25 bg-white pl-10 pr-3 text-sm font-semibold text-indigo-950 shadow-[3px_3px_0_0_rgba(30,27,75,0.12)] placeholder:text-slate-500 focus:border-indigo-950 focus:ring-2 focus:ring-pink-300"
        />
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:justify-end">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={cn(triggerClass, "gap-2")}>
              <MapPin className="h-4 w-4 shrink-0 text-pink-600" />
              Khu vực
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={cn(menuContentClass, "w-52")}>
            <DropdownMenuItem className={menuItemClass}>Hà Nội</DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}>TP. Hồ Chí Minh</DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}>Đà Nẵng</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={cn(triggerClass, "gap-2")}>
              <DollarSign className="h-4 w-4 shrink-0 text-fuchsia-600" />
              Mức giá
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={cn(menuContentClass, "w-52")}>
            <DropdownMenuItem className={menuItemClass}>Dưới 500.000đ</DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}>500k – 1,5 triệu</DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}>Trên 1,5 triệu</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={cn(triggerClass, "gap-2")}>
              <Calendar className="h-4 w-4 shrink-0 text-emerald-700" />
              Lịch trống
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={cn(menuContentClass, "w-52")}>
            <DropdownMenuItem className={menuItemClass}>Cuối tuần này</DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}>Tuần tới</DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass}>Chọn ngày cụ thể</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 hidden h-8 w-[3px] bg-indigo-950/15 md:block" aria-hidden />

        <div className="flex min-w-[10rem] flex-1 items-center justify-end gap-2 text-xs md:flex-initial md:justify-start">
          <span className="font-extrabold uppercase tracking-wide text-indigo-800/65">
            Sắp xếp:
          </span>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(triggerClass, "inline-flex items-center gap-1 px-3 text-xs")}
              >
                Đề xuất
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={cn(menuContentClass, "w-56")}>
              <DropdownMenuItem className={menuItemClass}>Đề xuất</DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass}>Đánh giá cao nhất</DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass}>Giá: thấp → cao</DropdownMenuItem>
              <DropdownMenuItem className={menuItemClass}>Giá: cao → thấp</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
