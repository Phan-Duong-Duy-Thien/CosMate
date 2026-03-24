import { Card } from "@/components/ui/card"
import { VI } from "@/shared/i18n/vi"

interface ProductInfoSectionsProps {
  details: {
    label: string
    value: string
  }[]
  description: string
}

export function ProductInfoSections({ details, description }: ProductInfoSectionsProps) {
  return (
    <div className="space-y-4">
      {/* Product Details Section */}
      <div>
        <div className="inline-block rounded-lg border-2 border-pink-200 px-4 py-1.5">
          <h3 className="text-sm font-semibold text-slate-800">
            {VI.costumeRental.detail.productDetailTitle}
          </h3>
        </div>
        <Card className="mt-2 rounded-xl border border-pink-100 bg-white p-4">
          <div className="grid gap-2 md:grid-cols-2">
            {details.map((detail, index) => (
              <div key={index}>
                <p className="text-xs text-slate-400">{detail.label}</p>
                <p className="text-sm font-medium text-slate-700">{detail.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Product Description Section */}
      <div>
        <div className="inline-block rounded-lg border-2 border-pink-200 px-4 py-1.5">
          <h3 className="text-sm font-semibold text-slate-800">
            {VI.costumeRental.detail.productDescriptionTitle}
          </h3>
        </div>
        <Card className="mt-2 rounded-xl border border-pink-100 bg-white p-4">
          <p className="whitespace-pre-line text-sm text-slate-600">{description}</p>
        </Card>
      </div>
    </div>
  )
}
