import { useState } from 'react'
import { ChevronDown, FileText } from 'lucide-react'
import { Card } from '@/shared/components/Card'
import { getMockShopPolicies, type ShopPolicy } from '../../mocks/shopPolicies.mock'
import { VI } from '@/shared/i18n/vi'
import { cn } from '@/lib/utils'

interface ShopPoliciesSectionProps {
  providerId?: number
}

export function ShopPoliciesSection({ providerId }: ShopPoliciesSectionProps) {
  const policies = getMockShopPolicies()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] p-5 shadow-[8px_8px_0_0_rgba(30,27,75,0.5)]">
      <button
        type="button"
        className="mb-4 flex w-full items-center justify-between gap-2 text-left"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={VI.provider.shop.policies.title}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-950" />
          <h3 className="text-lg font-extrabold text-indigo-950">
            {VI.provider.shop.policies.title}
          </h3>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-indigo-950 transition-transform duration-300 ease-in-out',
            isOpen && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy, index) => (
            <PolicyCard key={index} policy={policy} />
          ))}
        </div>
      </div>
    </Card>
  )
}

function PolicyCard({ policy }: { policy: ShopPolicy }) {
  return (
    <div className="rounded-xl border-[3px] border-indigo-950 bg-white p-4 shadow-[4px_4px_0_0_rgba(30,27,75,0.25)]">
      <h4 className="mb-2 font-extrabold text-indigo-950">{policy.title}</h4>
      <p className="whitespace-pre-line text-sm font-medium text-indigo-900/80">{policy.content}</p>
    </div>
  )
}
