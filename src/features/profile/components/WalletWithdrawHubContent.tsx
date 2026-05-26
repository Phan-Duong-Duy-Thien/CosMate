import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Select } from 'antd';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { Input } from '@/shared/components/Input';
import { cn } from '@/lib/utils';
import { VI } from '@/shared/i18n/vi';
import { ProviderWalletWithdrawContent } from '@/features/provider/components/ProviderWalletWithdrawContent';
import { useWithdraw } from '../hooks/useWithdraw';
import { BANK_LIST } from '@/shared/constants/bankList';

const cosplayerInputClass = cn(
  'mt-2 h-12 rounded-2xl border-border bg-background text-base font-medium text-foreground shadow-sm',
  'placeholder:text-muted-foreground/80',
  'focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2',
);

export type WalletWithdrawHubContentProps = {
  walletBase: string;
  variant?: 'cosplayer' | 'provider';
};

export function WalletWithdrawHubContent({
  walletBase,
  variant = 'cosplayer',
}: WalletWithdrawHubContentProps) {
  const navigate = useNavigate();

  if (variant === 'provider') {
    return (
      <section className="mx-auto w-full max-w-4xl py-2">
        <ProviderWalletWithdrawContent walletBase={walletBase} />
      </section>
    );
  }

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
    <section className="home-anime min-h-[calc(100vh-64px)] bg-transparent px-3 py-8 md:px-4 md:py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="overflow-hidden rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.38)]">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Button
                type="button"
                variant="ghost"
                className="mt-0.5 h-10 w-10 shrink-0 rounded-xl border-[2px] border-transparent p-0 text-indigo-900/70 hover:border-indigo-950/20 hover:bg-pink-100 hover:text-indigo-950"
                onClick={handleBack}
                aria-label={VI.common.actions.back}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {VI.wallet.withdrawTitle}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {VI.wallet.withdrawDescription}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <label
                  htmlFor="wallet-withdraw-amount"
                  className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {VI.wallet.withdrawAmountLabel}
                </label>
                <Input
                  id="wallet-withdraw-amount"
                  type="number"
                  min={1}
                  placeholder={VI.wallet.withdrawAmountPlaceholder}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cosplayerInputClass}
                />
              </div>

              <div className="h-px w-full bg-indigo-950/15" aria-hidden />

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="wallet-withdraw-account"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {VI.wallet.withdrawBankAccountLabel}
                  </label>
                  <Input
                    id="wallet-withdraw-account"
                    type="text"
                    placeholder={VI.wallet.withdrawBankAccountPlaceholder}
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className={cosplayerInputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="wallet-withdraw-bank"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {VI.wallet.withdrawBankNameLabel}
                  </label>
                  <div className="[&_.ant-select-selector]:!min-h-12 [&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!border-border">
                    <Select
                      id="wallet-withdraw-bank"
                      showSearch
                      optionFilterProp="label"
                      placeholder={VI.wallet.withdrawBankNamePlaceholder}
                      value={bankName || undefined}
                      onChange={(value) => setBankName(value)}
                      className="w-full"
                      options={BANK_LIST.map((bank) => ({ value: bank, label: bank }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleBack}>
                  {VI.common.actions.back}
                </Button>
                <Button
                  type="button"
                  variant="soft"
                  className="w-full min-w-[9rem] rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-105 sm:w-auto"
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit}
                >
                  {loading ? VI.wallet.withdrawProcessing : VI.wallet.withdrawSubmit}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
