/**
 * Provider portal top-up UI — aligned with subscription page styling.
 */
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Smartphone, type LucideIcon } from 'lucide-react';
import { Button, Input, Radio } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import { providerPortalUi as ui } from '../constants/providerPortalUi';
import { useWalletTopUp, type PaymentMethod } from '@/features/profile/hooks/useWalletTopUp';

const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  desc: string;
  Icon: LucideIcon;
}[] = [
  { value: 'MOMO', label: VI.wallet.momo, desc: VI.wallet.momoDesc, Icon: Smartphone },
  { value: 'VNPAY', label: VI.wallet.vnpay, desc: VI.wallet.vnpayDesc, Icon: Building2 },
];

export type ProviderWalletTopUpContentProps = {
  walletBase: string;
  redirectUrl?: string;
};

export function ProviderWalletTopUpContent({
  walletBase,
  redirectUrl,
}: ProviderWalletTopUpContentProps) {
  const navigate = useNavigate();
  const { amount, paymentMethod, loading, setAmount, setPaymentMethod, handleSubmit } =
    useWalletTopUp();

  const isSubmitDisabled = loading || !amount || !paymentMethod;

  const handleBack = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(walletBase);
  };

  return (
    <>
      <div className={ui.subtitleBar}>
        <p className={ui.subtitleText}>{VI.wallet.topUpDescription}</p>
        <Button
          size="large"
          icon={<ArrowLeft className="h-4 w-4" />}
          className={ui.defaultBtn}
          onClick={handleBack}
        >
          {VI.common.actions.back}
        </Button>
      </div>

      <div className={ui.heroCard}>
        <div className={ui.heroHeader}>
          <p className={ui.heroLabel}>{VI.wallet.topUpTitle}</p>
          <div className="mt-2 flex items-center gap-2.5">
            <span className={ui.iconWrap}>
              <PlusCircleOutlined style={{ fontSize: 20 }} />
            </span>
            <span className={ui.heroTitle}>{VI.wallet.topup}</span>
          </div>
        </div>

        <div className={ui.heroBody}>
          <div className={ui.formPanel}>
            <label htmlFor="provider-wallet-topup-amount" className={ui.fieldLabel}>
              {VI.wallet.amount}
            </label>
            <Input
              id="provider-wallet-topup-amount"
              type="number"
              min={1}
              size="large"
              placeholder={VI.wallet.amountPlaceholder}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="!mt-2"
            />
          </div>
        </div>
      </div>

      <section className={ui.sectionWrap}>
        <div className={ui.sectionTitle}>
          <h3 className={ui.sectionHeading}>{VI.wallet.paymentMethodLabel}</h3>
        </div>

        <Radio.Group
          className="flex w-full flex-col gap-3"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        >
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.Icon;
            return (
              <Radio.Button
                key={method.value}
                value={method.value}
                className="!h-auto !w-full !rounded-xl !border !border-cosmate-lavender-border !p-0 [&::before]:!hidden"
              >
                <div className="flex w-full items-center gap-3 px-4 py-3 text-left">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cosmate-pink/15 text-cosmate-pink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-cosmate-ink">{method.label}</span>
                    <span className="block text-xs text-cosmate-mauve">{method.desc}</span>
                  </span>
                </div>
              </Radio.Button>
            );
          })}
        </Radio.Group>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button size="large" className={ui.defaultBtn} onClick={handleBack}>
            {VI.common.actions.back}
          </Button>
          <Button
            type="primary"
            size="large"
            className={ui.primaryBtn}
            disabled={isSubmitDisabled}
            onClick={() => handleSubmit(redirectUrl)}
          >
            {loading ? VI.wallet.processing : VI.wallet.submit}
          </Button>
        </div>
      </section>
    </>
  );
}
