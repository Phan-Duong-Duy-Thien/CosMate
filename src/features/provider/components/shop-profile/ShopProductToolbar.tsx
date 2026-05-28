import { Search, ArrowUpDown } from 'lucide-react'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'
import type { SortOption, ProductFilterState } from '../../hooks/useShopProducts'
import { VI } from '@/shared/i18n/vi'

interface ShopProductToolbarProps {
  filterState: ProductFilterState
  onSearchChange: (search: string) => void
  onSortChange: (sort: SortOption) => void
  onMinPriceChange: (price: number | null) => void
  onMaxPriceChange: (price: number | null) => void
  onReset: () => void
}

export function ShopProductToolbar({
  filterState,
  onSearchChange,
  onSortChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}: ShopProductToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border-[3px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[6px_6px_0_0_rgba(30,27,75,0.35)]">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder={VI.provider.shop.products.searchPlaceholder}
          value={filterState.search}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sort & Price Filter */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <select
            value={filterState.sort}
            onChange={e => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
          >
            <option value="bestSelling">{VI.provider.shop.products.sort.bestSelling}</option>
            <option value="newest">{VI.provider.shop.products.sort.newest}</option>
          </select>
        </div>

        {/* Price Filter */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>{VI.provider.shop.products.filter.price}:</span>
          <input
            type="number"
            placeholder={VI.provider.shop.products.filter.minPrice}
            value={filterState.minPrice || ''}
            onChange={e => onMinPriceChange(e.target.value ? Number(e.target.value) : null)}
            className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-pink-400 focus:outline-none"
          />
          <span>-</span>
          <input
            type="number"
            placeholder={VI.provider.shop.products.filter.maxPrice}
            value={filterState.maxPrice || ''}
            onChange={e => onMaxPriceChange(e.target.value ? Number(e.target.value) : null)}
            className="w-24 rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-pink-400 focus:outline-none"
          />
          <span>VNĐ</span>
        </div>

        {/* Reset Button */}
        {(filterState.search || filterState.minPrice || filterState.maxPrice) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-pink-500 hover:text-pink-600"
          >
            Xóa lọc
          </Button>
        )}
      </div>
    </div>
  )
}
