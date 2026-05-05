import { Card } from "@/components/ui/card"
import { VI } from "@/shared/i18n/vi"

interface ProductInfoSectionsProps {
  details: {
    label: string
    value: string
  }[]
  description: string
}

const SectionTitle = ({ title }: { title: string }) => (
  <div className="inline-flex rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-200 to-violet-200 px-4 py-1.5 shadow-[4px_4px_0_0_rgba(30,27,75,0.35)]">
    <h3 className="text-sm font-extrabold text-indigo-950">{title}</h3>
  </div>
)

export function ProductInfoSections({ details, description }: ProductInfoSectionsProps) {
  return (
    <div className="space-y-5">
      <div>
        <SectionTitle title={VI.costumeRental.detail.productDetailTitle} />
        <Card className="mt-2 rounded-[1.2rem] border-[3px] border-indigo-950/20 bg-white p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {details.map((detail, index) => (
              <div
                key={index}
                className="rounded-lg border border-indigo-950/10 bg-[#fffbeb]/50 px-3 py-2"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700/65">{detail.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-indigo-950">{detail.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <SectionTitle title={VI.costumeRental.detail.productDescriptionTitle} />
        <Card className="mt-2 rounded-[1.2rem] border-[3px] border-indigo-950/20 bg-white p-4 md:p-5">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{description}</p>
        </Card>
      </div>
    </div>
  )
}
