import { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCancellationPolicies, type CancellationPolicy } from '@/features/provider/api/cancellationPolicy.api';
import { GUIDELINES_RULES_SECTIONS } from '@/features/general/constants/guidelinesRulesContent';
import { VI } from '@/shared/i18n/vi';

interface CheckoutForcePolicyModalProps {
  open: boolean;
  providerId?: number;
  onAccept: () => void;
}

function getI18nValue(path: string): string {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== 'object' || !(part in acc)) {
      return path;
    }
    return (acc as Record<string, unknown>)[part];
  }, VI) as string;
}

export function CheckoutForcePolicyModal({ open, providerId, onAccept }: CheckoutForcePolicyModalProps) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [shopPolicies, setShopPolicies] = useState<CancellationPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!providerId) return;
    setLoading(true);
    getCancellationPolicies(providerId)
      .then(setShopPolicies)
      .catch((err) => console.error('[CheckoutForcePolicyModal] load policies error:', err))
      .finally(() => setLoading(false));
  }, [providerId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const difference = target.scrollHeight - target.scrollTop;
    // Set to true if within 25px of the bottom
    if (difference - target.clientHeight < 25) {
      setHasReadToBottom(true);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-cosmate-ink font-extrabold text-lg">
          <ShieldCheck className="h-5 w-5 text-cosmate-pink animate-pulse" />
          Điều khoản dịch vụ & Chính sách hủy hàng
        </div>
      }
      open={open}
      footer={null}
      closable={false}
      maskClosable={false}
      keyboard={false}
      width={700}
      className="force-policy-modal"
    >
      <div className="space-y-4 pt-2">
        <p className="text-xs font-semibold text-muted-foreground bg-muted p-2.5 rounded-lg border border-border">
          ⚠️ <strong>Lưu ý quan trọng:</strong> Bạn phải cuộn xuống dưới cùng để đọc hết quy định trước khi có thể bấm nút "Tôi đã đọc và đồng ý".
        </p>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[50vh] overflow-y-auto space-y-5 border-[3px] border-cosmate-ink bg-cosmate-surface-warm p-4 rounded-2xl shadow-[inset_4px_4px_0_0_rgba(30,27,75,0.08)]"
        >
          {/* Platform General Rules */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-cosmate-pink border-b border-cosmate-ink/10 pb-1 mb-3">
              1. Quy định chung của CosMate
            </h3>
            <div className="space-y-3">
              {GUIDELINES_RULES_SECTIONS.map((section) => (
                <div key={section.id} className="text-xs space-y-1 bg-card p-3 rounded-xl border-2 border-cosmate-ink/10">
                  <h4 className="font-bold text-cosmate-ink">{getI18nValue(section.cardMainKey)}</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1 pl-1">
                    {section.guides.slice(0, 3).map((guideKey, index) => (
                      <li key={index} className="text-muted-foreground text-xs list-none flex items-start gap-1">
                        <span className="text-cosmate-pink">✿</span>
                        <span>{getI18nValue(guideKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Shop-specific Cancellation Rules */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-cosmate-pink border-b border-cosmate-ink/10 pb-1 mb-3">
              2. Chính sách hủy đơn hàng của Shop
            </h3>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-cosmate-pink" />
              </div>
            ) : shopPolicies.length === 0 ? (
              <p className="text-xs text-muted-foreground italic bg-card p-3 rounded-xl border border-cosmate-ink/10">
                Shop chưa cấu hình chính sách hủy đơn riêng. Quy định chung của nền tảng sẽ được áp dụng khi xảy ra hủy đơn.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-cosmate-ink/80 font-medium">
                  Tỷ lệ hoàn trả tiền cọc/tiền thuê tương ứng với thời gian hủy đơn trước giờ nhận đồ:
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {shopPolicies.map((p, idx) => (
                    <div key={idx} className="bg-card p-3 rounded-xl border-2 border-cosmate-ink/10 shadow-[3px_3px_0_0_rgba(30,27,75,0.05)]">
                      <p className="text-xs font-bold text-cosmate-ink">
                        Hủy trước từ {p.minHoursBefore}h đến {p.maxHoursBefore}h
                      </p>
                      <p className="text-xs font-extrabold text-cosmate-pink mt-0.5">
                        Hoàn trả {100 - p.penaltyValue}% số tiền
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-border">
          <Button
            size="lg"
            disabled={!hasReadToBottom}
            onClick={onAccept}
            className="w-full rounded-xl border-[3px] border-cosmate-ink font-extrabold text-primary-foreground shadow-[5px_5px_0_0_var(--cosmate-ink)] disabled:opacity-40 disabled:cursor-not-allowed transition hover:brightness-110"
            /* dynamic gradient — not expressible via a single token class; inline justified */
            style={{ background: 'var(--gradient-confirm-btn)' }}
          >
            {hasReadToBottom ? "Tôi đã đọc và đồng ý" : "Vui lòng cuộn xuống hết để đồng ý"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
