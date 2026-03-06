import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getMockShopPolicies, type ShopPolicy } from '../../mocks/shopPolicies.mock'
import { VI } from '@/shared/i18n/vi'

interface ShopPoliciesSectionProps {
  providerId?: number
}

export function ShopPoliciesSection({ providerId }: ShopPoliciesSectionProps) {
  const policies = getMockShopPolicies()

  return (
    <Card className="border-pink-200 bg-pink-50/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-semibold text-slate-900">
          {VI.provider.shop.policies.title}
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {policies.map((policy, index) => (
          <PolicyCard key={index} policy={policy} />
        ))}
      </div>
    </Card>
  )
}

function PolicyCard({ policy }: { policy: ShopPolicy }) {
  return (
    <div className="rounded-xl border border-pink-100 bg-white p-4">
      <h4 className="mb-2 font-semibold text-pink-600">{policy.title}</h4>
      <p className="whitespace-pre-line text-sm text-slate-600">{policy.content}</p>
    </div>
  )
}
