import { useState } from 'react';
import { Table, Spin, Empty, Alert } from 'antd';
import type { TableProps } from 'antd';
import { Building2, Check, Smartphone, X, type LucideIcon } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/components/Dialog';
import { Button } from '@/shared/components/Button';
import { cn } from '@/lib/utils';
import { VI } from '@/shared/i18n/vi';
import { PROFILE_MODAL_UI } from '../constants/profileUi';
import { useAiTokenPlansCatalog } from '../hooks/useAiTokenPlansCatalog';
import { usePurchaseAiToken } from '../hooks/usePurchaseAiToken';
import type { AiTokenPlan, TokenPaymentMethod } from '../types';

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

interface BuyTokenPlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BuyTokenPlansModal({ open, onOpenChange }: BuyTokenPlansModalProps) {
  const { plans, loading, error } = useAiTokenPlansCatalog(open);
  const { purchase, purchasingPlanId } = usePurchaseAiToken();
  const [paymentMethod, setPaymentMethod] = useState<TokenPaymentMethod | null>(null);

  const paymentMethods: {
    value: TokenPaymentMethod;
    label: string;
    desc: string;
    Icon: LucideIcon;
    color: string;
    bgColor: string;
    iconWrapClass: string;
  }[] = [
    {
      value: 'MOMO',
      label: VI.wallet.momo,
      desc: VI.wallet.momoDesc,
      Icon: Smartphone,
      color: 'text-cosmate-pink',
      bgColor: 'bg-cosmate-soft-pink/55',
      iconWrapClass: 'border-cosmate-pink/30 bg-cosmate-soft-pink/50 text-cosmate-pink',
    },
    {
      value: 'VNPAY',
      label: VI.wallet.vnpay,
      desc: VI.wallet.vnpayDesc,
      Icon: Building2,
      color: 'text-cosmate-ink',
      bgColor: 'bg-cosmate-lavender-surface/90',
      iconWrapClass: 'border-cosmate-lavender-border bg-cosmate-lavender-surface/80 text-cosmate-ink',
    },
  ];

  const handleBuy = (planId: number) => {
    if (!paymentMethod) return;
    void purchase(planId, paymentMethod);
  };

  const columns: TableProps<AiTokenPlan>['columns'] = [
    {
      title: VI.profile.token.columns.name,
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: VI.profile.token.columns.price,
      dataIndex: 'price',
      key: 'price',
      width: 130,
      render: (value: number) => formatVnd(value),
    },
    {
      title: VI.profile.token.columns.numberOfToken,
      dataIndex: 'numberOfToken',
      key: 'numberOfToken',
      width: 110,
      align: 'right',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: VI.profile.token.columns.description,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '—',
    },
    {
      title: VI.profile.token.columns.actions,
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_: unknown, record: AiTokenPlan) => {
        const isLoading = purchasingPlanId === record.id;
        return (
          <Button
            type="button"
            size="sm"
            className={PROFILE_MODAL_UI.btnPrimary}
            disabled={!paymentMethod || isLoading || purchasingPlanId !== null}
            onClick={() => handleBuy(record.id)}
          >
            {isLoading ? '...' : VI.profile.token.buy}
          </Button>
        );
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(PROFILE_MODAL_UI.content, 'relative max-w-3xl')}>
        <button
          type="button"
          aria-label={VI.common.actions.cancel}
          className={PROFILE_MODAL_UI.closeBtn}
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className={PROFILE_MODAL_UI.title}>{VI.profile.token.buyModalTitle}</h2>

        <div className="mt-4 space-y-4">
          <section className={PROFILE_MODAL_UI.section}>
            <p className={PROFILE_MODAL_UI.sectionTitle}>{VI.profile.token.selectPayment}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {paymentMethods.map((method) => {
                const selected = paymentMethod === method.value;
                const Icon = method.Icon;
                return (
                  <label
                    key={method.value}
                    className={cn(
                      'group relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all',
                      selected
                        ? cn('border-cosmate-pink/55', method.bgColor)
                        : 'border-indigo-950/20 bg-white hover:border-cosmate-pink/35'
                    )}
                  >
                    <input
                      type="radio"
                      name="tokenPaymentMethod"
                      value={method.value}
                      checked={selected}
                      onChange={() => setPaymentMethod(method.value)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
                        selected ? method.iconWrapClass : 'border-indigo-950/15 bg-muted/40'
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block text-sm font-bold',
                          selected ? method.color : 'text-indigo-950'
                        )}
                      >
                        {method.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-indigo-900/60">{method.desc}</span>
                    </span>
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0 text-cosmate-pink" strokeWidth={3} />
                    ) : null}
                  </label>
                );
              })}
            </div>
            {!paymentMethod && (
              <p className="mt-2 text-xs font-medium text-indigo-900/55">
                {VI.wallet.selectPaymentMethod}
              </p>
            )}
          </section>

          {error ? <Alert type="error" message={error} showIcon /> : null}

          <Spin spinning={loading}>
            <Table<AiTokenPlan>
              columns={columns}
              dataSource={plans}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 560 }}
              locale={{
                emptyText: (
                  <Empty
                    description={VI.profile.token.buyModalEmpty}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
            />
          </Spin>
        </div>

        <div className={cn(PROFILE_MODAL_UI.footerActions, 'mt-4')}>
          <Button
            type="button"
            className={PROFILE_MODAL_UI.btnCancel}
            onClick={() => onOpenChange(false)}
          >
            {VI.common.actions.cancel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
