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
    <div className="space-y-6">
      {/* Product Details Section */}
      <div>
        <div className="inline-block rounded-xl border-2 border-[#FDCCD7] bg-white px-3 py-1.5">
          <h3 className="text-base font-bold tracking-wide text-slate-800 text-center">
            {VI.costumeRental.detail.productDetailTitle}
          </h3>
        </div>
        <Card className="mt-3 rounded-xl border border-pink-100 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {details.map((detail, index) => (
              <div key={index}>
                <p className="text-xs uppercase tracking-wide text-slate-400">{detail.label}</p>
                <p className="mt-1 text-sm text-slate-700">{detail.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Product Description Section */}
      <div>
        <div className="inline-block rounded-xl border-2 border-[#FDCCD7] bg-white px-3 py-1.5">
          <h3 className="text-base font-bold tracking-wide text-slate-800 text-center">
            {VI.costumeRental.detail.productDescriptionTitle}
          </h3>
        </div>
        <Card className="mt-3 rounded-xl border border-pink-100 bg-white p-5">
          <p className="whitespace-pre-line text-sm text-slate-600">{description}</p>
        </Card>
      </div>
    </div>
  )
}
