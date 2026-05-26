/**
 * Provider portal withdraw UI — aligned with subscription page styling.
 */
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Input, Select } from 'antd';
import { BankOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import { providerPortalUi as ui } from '../constants/providerPortalUi';
import { useWithdraw } from '@/features/profile/hooks/useWithdraw';
import { BANK_LIST } from '@/shared/constants/bankList';

export type ProviderWalletWithdrawContentProps = {
  walletBase: string;
};

export function ProviderWalletWithdrawContent({ walletBase }: ProviderWalletWithdrawContentProps) {
  const navigate = useNavigate();
  const {
    amount,
    bankAccountNumber,
    bankName,
    loading,
    setAmount,
    setBankAccountNumber,
    setBankName,
    handleSubmit,
  } = useWithdraw();

  const isSubmitDisabled = loading || !amount || !bankAccountNumber || !bankName;
  const handleBack = () => navigate(walletBase);

  return (
    <>
      <div className={ui.subtitleBar}>
        <p className={ui.subtitleText}>{VI.wallet.withdrawDescription}</p>
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
          <p className={ui.heroLabel}>{VI.wallet.withdrawTitle}</p>
          <div className="mt-2 flex items-center gap-2.5">
            <span className={ui.iconWrap}>
              <BankOutlined style={{ fontSize: 20 }} />
            </span>
            <span className={ui.heroTitle}>{VI.wallet.withdraw}</span>
          </div>
        </div>

        <div className={`${ui.heroBody} space-y-4`}>
          <div className={ui.formPanel}>
            <label htmlFor="provider-wallet-withdraw-amount" className={ui.fieldLabel}>
              {VI.wallet.withdrawAmountLabel}
            </label>
            <Input
              id="provider-wallet-withdraw-amount"
              type="number"
              min={1}
              size="large"
              placeholder={VI.wallet.withdrawAmountPlaceholder}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="!mt-2"
            />
          </div>
        </div>
      </div>

      <section className={ui.sectionWrap}>
        <div className={ui.sectionTitle}>
          <h3 className={ui.sectionHeading}>{VI.wallet.withdrawBankAccountLabel}</h3>
          <p className={ui.sectionSubheading}>{VI.wallet.withdrawBankNameLabel}</p>
        </div>

        <div className="space-y-4">
          <div className={ui.formPanel}>
            <label htmlFor="provider-wallet-withdraw-account" className={ui.fieldLabel}>
              {VI.wallet.withdrawBankAccountLabel}
            </label>
            <Input
              id="provider-wallet-withdraw-account"
              size="large"
              placeholder={VI.wallet.withdrawBankAccountPlaceholder}
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              className="!mt-2"
            />
          </div>

          <div className={ui.formPanel}>
            <label htmlFor="provider-wallet-withdraw-bank" className={ui.fieldLabel}>
              {VI.wallet.withdrawBankNameLabel}
            </label>
            <Select
              id="provider-wallet-withdraw-bank"
              showSearch
              size="large"
              optionFilterProp="label"
              placeholder={VI.wallet.withdrawBankNamePlaceholder}
              value={bankName || undefined}
              onChange={(value) => setBankName(value)}
              className="!mt-2 w-full"
              options={BANK_LIST.map((bank) => ({ value: bank, label: bank }))}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button size="large" className={ui.defaultBtn} onClick={handleBack}>
            {VI.common.actions.back}
          </Button>
          <Button
            type="primary"
            size="large"
            className={ui.primaryBtn}
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            {loading ? VI.wallet.withdrawProcessing : VI.wallet.withdrawSubmit}
          </Button>
        </div>
      </section>
    </>
  );
}
