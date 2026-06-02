import { useState, useEffect } from 'react'
import { ChevronDown, FileText, Loader2 } from 'lucide-react'
import { Card } from '@/shared/components/Card'
import { getMockShopPolicies, type ShopPolicy } from '../../mocks/shopPolicies.mock'
import { VI } from '@/shared/i18n/vi'
import { cn } from '@/lib/utils'
import { getCancellationPolicies, type CancellationPolicy } from '../../api/cancellationPolicy.api'

interface ShopPoliciesSectionProps {
  providerId?: number
}

export function ShopPoliciesSection({ providerId }: ShopPoliciesSectionProps) {
  const policies = getMockShopPolicies()
  const platformPolicies = policies.filter((p) => p.title !== "Hủy/Hoàn tiền")
  
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'platform' | 'shop'>('platform')
  const [shopPolicies, setShopPolicies] = useState<CancellationPolicy[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!providerId) return
    setLoading(true)
    getCancellationPolicies(providerId)
      .then(setShopPolicies)
      .catch((err) => console.error('[ShopPoliciesSection] load policies error:', err))
      .finally(() => setLoading(false))
  }, [providerId])

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
        {/* Tab selection */}
        <div className="mb-4 flex gap-6 border-b border-indigo-950/15 pb-2">
          <button
            type="button"
            className={cn(
              "pb-1 text-sm font-extrabold transition focus:outline-none",
              activeTab === 'platform'
                ? "border-b-2 border-pink-600 text-pink-600"
                : "text-indigo-950/60 hover:text-indigo-950"
            )}
            onClick={() => setActiveTab('platform')}
          >
            Quy định chung
          </button>
          <button
            type="button"
            className={cn(
              "pb-1 text-sm font-extrabold transition focus:outline-none",
              activeTab === 'shop'
                ? "border-b-2 border-pink-600 text-pink-600"
                : "text-indigo-950/60 hover:text-indigo-950"
            )}
            onClick={() => setActiveTab('shop')}
          >
            Chính sách hủy đơn của shop
          </button>
        </div>

        {activeTab === 'platform' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {platformPolicies.map((policy, index) => (
              <PolicyCard key={index} policy={policy} />
            ))}
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-pink-600" />
              </div>
            ) : shopPolicies.length === 0 ? (
              <div className="rounded-xl border-[3px] border-dashed border-indigo-950/20 bg-white p-6 text-center text-sm font-medium text-indigo-950/60">
                Shop chưa cấu hình chính sách hủy đơn riêng. Quy định chung của nền tảng sẽ được áp dụng.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shopPolicies.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border-[3px] border-indigo-950 bg-white p-4 shadow-[4px_4px_0_0_rgba(30,27,75,0.25)]"
                  >
                    <h4 className="mb-2 font-extrabold text-indigo-950">
                      Hủy trước từ {p.minHour}h đến {p.maxHour}h
                    </h4>
                    <p className="text-sm font-bold text-pink-600">
                      Hoàn trả {p.refundPercentage}% số tiền
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
