/**
 * WalletHubContent — shared wallet logic; cosplayer vs provider UI variants.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, History } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { cn } from '@/lib/utils';
import { VI } from '@/shared/i18n/vi';
import { ProviderWalletHubContent } from '@/features/provider/components/ProviderWalletHubContent';
import { useWallet } from '../hooks/useWallet';
import { getWalletTransactionTypeLabel } from '../utils/walletTransactionTypeLabel';
import {
  formatWalletCurrency,
  formatWalletDate,
  getWalletStatusColorClass,
  getWalletStatusLabel,
} from '../utils/walletDisplayUtils';

export type WalletHubContentProps = {
  walletBase: string;
  backPath: string;
  variant?: 'cosplayer' | 'provider';
};

function CosplayerTransactionList({
  loading,
  transactions,
}: {
  loading: boolean;
  transactions: ReturnType<typeof useWallet>['transactions'];
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-8 text-center text-sm text-muted-foreground">
        {VI.wallet.loading}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-cosmate-pink/25 bg-cosmate-soft-pink/15 px-4 py-8 text-center text-sm text-muted-foreground">
        {VI.wallet.noTransactions}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-3 shadow-sm transition-colors hover:border-cosmate-pink/20 sm:px-4"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {getWalletTransactionTypeLabel(transaction.type)}
            </p>
            <p className="text-xs text-muted-foreground">{formatWalletDate(transaction.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {formatWalletCurrency(transaction.amount)}
            </p>
            <span
              className={cn(
                'inline-block rounded px-2 py-0.5 text-xs font-medium',
                getWalletStatusColorClass(transaction.status),
              )}
            >
              {getWalletStatusLabel(transaction.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function WalletHubContent({
  walletBase,
  backPath,
  variant = 'cosplayer',
}: WalletHubContentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [clearingStalePaymentUrl, setClearingStalePaymentUrl] = useState(false);

  useEffect(() => {
    const rawUrl = location.pathname + location.search;
    const isStale =
      rawUrl.includes('partnerCode') ||
      rawUrl.includes('resultCode') ||
      rawUrl.includes('MOMO');
    if (isStale) {
      setClearingStalePaymentUrl(true);
      navigate(walletBase, { replace: true });
    }
  }, [location.pathname, location.search, walletBase, navigate]);

  const {
    walletInfo,
    transactions,
    loadingWallet,
    loadingTransactions,
    isTransactionsOpen,
    error,
    toggleTransactions,
    fetchTransactionsIfNeeded,
  } = useWallet();

  if (clearingStalePaymentUrl) {
    return null;
  }

  const handleToggleTransactions = () => {
    toggleTransactions();
    void fetchTransactionsIfNeeded();
  };

  if (variant === 'provider') {
    if (clearingStalePaymentUrl) {
      return null;
    }
    return (
      <section className="mx-auto w-full max-w-4xl">
        <ProviderWalletHubContent
          walletBase={walletBase}
          walletInfo={walletInfo}
          transactions={transactions}
          loadingWallet={loadingWallet}
          loadingTransactions={loadingTransactions}
          isTransactionsOpen={isTransactionsOpen}
          error={error}
          onToggleTransactions={handleToggleTransactions}
        />
      </section>
    );
  }

  const cardClass =
    'overflow-hidden rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.38)]';

  const shellClass =
    'home-anime flex min-h-0 flex-1 flex-col bg-transparent px-3 py-8 md:px-4 md:py-10';

  const innerMaxClass = 'mx-auto w-full max-w-3xl';

  return (
    <section className={shellClass}>
      <div className={innerMaxClass}>
        <Card className={cardClass}>
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {VI.wallet.title}
              </h1>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => navigate(backPath)}
              >
                {VI.common.actions.back}
              </Button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {loadingWallet && (
              <div className="mt-6 flex justify-center py-8">
                <p className="text-sm text-muted-foreground">{VI.wallet.loading}</p>
              </div>
            )}

            {walletInfo && !loadingWallet && (
              <>
                <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {VI.wallet.balance}
                  </p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                    {formatWalletCurrency(walletInfo.balance)}
                  </p>
                </div>
                {walletInfo.depositBalance > 0 && (
                  <div className="mt-3 rounded-2xl border border-cosmate-pink/25 bg-gradient-to-br from-cosmate-soft-pink/40 to-cosmate-lavender-surface/50 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cosmate-pink">
                      {VI.wallet.depositBalance}
                    </p>
                    <p className="mt-2 text-xl font-bold tabular-nums text-cosmate-pink sm:text-2xl">
                      {formatWalletCurrency(walletInfo.depositBalance)}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => navigate(`${walletBase}/withdraw`)}
                  >
                    {VI.wallet.withdraw}
                  </Button>
                  <Button
                    type="button"
                    variant="soft"
                    className="w-full rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-pink-500 to-fuchsia-600 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] hover:brightness-105 sm:w-auto"
                    onClick={() => navigate(`${walletBase}/topup`)}
                  >
                    {VI.wallet.topup}
                  </Button>
                </div>
              </>
            )}

            <div className="my-8 h-px w-full bg-indigo-950/15" aria-hidden />

            <div>
              <button
                type="button"
                onClick={handleToggleTransactions}
                aria-expanded={isTransactionsOpen}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left shadow-sm transition-all duration-200',
                  'hover:border-cosmate-pink/35 hover:bg-gradient-to-r hover:from-card hover:to-cosmate-soft-pink/30 hover:shadow-md',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2',
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cosmate-pink/25 bg-cosmate-soft-pink/45 text-cosmate-pink">
                  <History className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">
                  {isTransactionsOpen ? VI.wallet.hideTransactions : VI.wallet.viewTransactions}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform',
                    isTransactionsOpen && 'rotate-180',
                  )}
                />
              </button>

              {isTransactionsOpen && (
                <div className="mt-4 space-y-3 rounded-2xl border border-border/80 bg-muted/20 p-3 sm:p-4">
                  <CosplayerTransactionList
                    loading={loadingTransactions}
                    transactions={transactions}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
