import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Spin, Empty, Alert } from 'antd';
import type { TableProps } from 'antd';
import { Check, Wallet } from 'lucide-react';
import { PaymentBrandLogo } from '@/shared/components/payment/PaymentBrandLogo';
import { Button } from '@/shared/components/Button';
import { cn } from '@/lib/utils';
import { VI } from '@/shared/i18n/vi';
import { PROFILE_MODAL_UI } from '../constants/profileUi';
import { useAiTokenPlansCatalog } from '../hooks/useAiTokenPlansCatalog';
import { usePurchaseAiToken } from '../hooks/usePurchaseAiToken';
import { useWallet } from '../hooks/useWallet';
import type { AiTokenPlan, TokenPaymentMethod } from '../types';

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

type PaymentMethodOption = {
  value: TokenPaymentMethod;
  label: string;
  desc: string;
  color: string;
  bgColor: string;
  logoWrapClass: string;
  isWallet?: boolean;
};

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    value: 'WALLET',
    label: VI.profile.token.walletPay,
    desc: VI.profile.token.walletPayDesc,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50/90',
    logoWrapClass: 'border-amber-300/50 bg-white',
    isWallet: true,
  },
  {
    value: 'MOMO',
    label: VI.wallet.momo,
    desc: VI.wallet.momoDesc,
    color: 'text-cosmate-pink',
    bgColor: 'bg-cosmate-soft-pink/55',
    logoWrapClass: 'border-cosmate-pink/25 bg-white',
  },
  {
    value: 'VNPAY',
    label: VI.wallet.vnpay,
    desc: VI.wallet.vnpayDesc,
    color: 'text-cosmate-ink',
    bgColor: 'bg-cosmate-lavender-surface/90',
    logoWrapClass: 'border-cosmate-lavender-border bg-white',
  },
];

type BuyTokenPlansSectionProps = {
  walletTopUpRedirect?: string;
  onPurchaseSuccess?: () => void;
};

export function BuyTokenPlansSection(props?: BuyTokenPlansSectionProps) {
  const {
    walletTopUpRedirect = '/profile/wallet/topup?redirect=/profile/token',
    onPurchaseSuccess,
  } = props ?? {};
  const navigate = useNavigate();
  const { plans, loading, error } = useAiTokenPlansCatalog();
  const { purchase, purchasingPlanId } = usePurchaseAiToken({ onWalletSuccess: onPurchaseSuccess });
  const { walletInfo, loadingWallet } = useWallet();
  const [paymentMethod, setPaymentMethod] = useState<TokenPaymentMethod | null>(null);

  const walletBalance = walletInfo?.balance ?? null;

  const isWalletInsufficientForPlan = useMemo(() => {
    return (planPrice: number) =>
      paymentMethod === 'WALLET' &&
      walletBalance !== null &&
      walletBalance < planPrice;
  }, [paymentMethod, walletBalance]);

  const handleBuy = (plan: AiTokenPlan) => {
    if (!paymentMethod) return;
    if (isWalletInsufficientForPlan(plan.price)) return;
    void purchase(plan.id, paymentMethod);
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
        const insufficient = isWalletInsufficientForPlan(record.price);
        return (
          <Button
            type="button"
            size="sm"
            className={PROFILE_MODAL_UI.btnPrimary}
            disabled={
              !paymentMethod ||
              isLoading ||
              purchasingPlanId !== null ||
              insufficient
            }
            onClick={() => handleBuy(record)}
          >
            {isLoading ? '...' : VI.profile.token.buy}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-base font-extrabold text-indigo-950">{VI.profile.token.buySectionTitle}</h2>

      <section className={PROFILE_MODAL_UI.section}>
        <p className={PROFILE_MODAL_UI.sectionTitle}>{VI.profile.token.selectPayment}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method.value;
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
                    'flex h-10 min-w-[4.75rem] shrink-0 items-center justify-center rounded-lg border px-2',
                    selected ? method.logoWrapClass : 'border-indigo-950/15 bg-white'
                  )}
                >
                  {method.isWallet ? (
                    <Wallet className="h-5 w-5 text-amber-600" aria-hidden />
                  ) : (
                    <PaymentBrandLogo brand={method.value} className="h-6 max-w-[4.25rem]" />
                  )}
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

        {paymentMethod === 'WALLET' && (
          <div className="mt-4">
            {loadingWallet ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-pink-300 border-t-pink-500" />
              </div>
            ) : walletBalance !== null && walletBalance >= 0 ? (
              <div className="rounded-xl border-[2px] border-green-300 bg-linear-to-r from-green-50 to-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Wallet className="h-5 w-5 text-green-700" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">
                      {VI.wallet.checkoutValidation.payWithWalletNote}
                    </p>
                    <p className="text-lg font-bold text-green-700">{formatVnd(walletBalance)}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
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

      {paymentMethod === 'WALLET' &&
        plans.some((p) => isWalletInsufficientForPlan(p.price)) &&
        walletBalance !== null && (
          <div className="rounded-xl border-[2px] border-amber-300 bg-linear-to-r from-amber-50 to-orange-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg">
                ⚠️
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm font-semibold leading-tight text-amber-800">
                  {VI.wallet.checkoutValidation.insufficientTitle}
                </p>
                <p className="text-xs text-amber-700">
                  {VI.profile.token.walletInsufficient} — {VI.wallet.checkoutValidation.balanceLabel}:{' '}
                  <span className="font-semibold">{formatVnd(walletBalance)}</span>
                </p>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-xl border-[2px] border-amber-800 bg-amber-500 text-white hover:bg-amber-600"
                    onClick={() => navigate(walletTopUpRedirect)}
                  >
                    {VI.wallet.checkoutValidation.topUpCta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
