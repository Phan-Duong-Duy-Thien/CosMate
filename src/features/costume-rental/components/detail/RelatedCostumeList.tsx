import type { CostumeItem } from "../../types"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"

interface RelatedCostumeListProps {
  items: CostumeItem[]
  onSelect: (costumeId: string) => void
}

export const RelatedCostumeList = ({ items, onSelect }: RelatedCostumeListProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Sản phẩm khác của shop</h3>
      <Button variant="link" size="sm" className="text-slate-500">
        Xem tất cả
      </Button>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2">
      {items.map((item) => (
        <Card
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(item.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              onSelect(item.id)
            }
          }}
          className="min-w-[180px] overflow-hidden border-slate-100 bg-white shadow-sm"
        >
          <img
            src={item.images[0]}
            alt={item.name}
            className="h-32 w-full object-cover"
          />
          <div className="space-y-1 p-3">
            <p className="line-clamp-2 text-sm font-semibold text-slate-800">
              {item.name}
            </p>
            {item.shopName?.trim() ? (
              <p className="truncate text-[11px] font-medium text-slate-500" title={item.shopName}>
                {item.shopName}
              </p>
            ) : null}
            <p className="text-[11px] font-medium text-slate-500">
              {item.priceMin.toLocaleString("vi-VN")} VND / ngày
            </p>
          </div>
        </Card>
      ))}
    </div>
  </div>
)
