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
  <div className="inline-flex rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-[#fbcfe8] to-[#c4b5fd] px-4 py-1.5 shadow-[4px_4px_0_0_#1e1b4b]">
    <h3 className="text-sm font-extrabold uppercase tracking-wide text-indigo-950">{title}</h3>
  </div>
)

export function ProductInfoSections({ details, description }: ProductInfoSectionsProps) {
  return (
    <div className="space-y-5">
      <div>
        <SectionTitle title={VI.costumeRental.detail.productDetailTitle} />
        <Card className="mt-2 rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)] md:p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {details.map((detail, index) => (
              <div
                key={index}
                className="rounded-xl border-[3px] border-indigo-950 bg-white px-3 py-2 shadow-[3px_3px_0_0_rgba(30,27,75,0.25)]"
              >
                <p className="label-caps text-xs font-semibold text-indigo-900/70">{detail.label}</p>
                <p className="mt-0.5 text-sm font-bold text-indigo-950">{detail.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <SectionTitle title={VI.costumeRental.detail.productDescriptionTitle} />
        <Card className="mt-2 rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-4 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)] md:p-5">
          <p className="whitespace-pre-line text-sm font-semibold leading-relaxed text-indigo-900/90">{description}</p>
        </Card>
      </div>
    </div>
  )
}
