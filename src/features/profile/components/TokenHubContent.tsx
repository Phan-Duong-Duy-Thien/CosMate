import { useNavigate } from 'react-router-dom';
import { ChevronDown, History } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Card } from '@/shared/components/Card';
import { cn } from '@/lib/utils';
import { VI } from '@/shared/i18n/vi';
import { getUserId } from '@/features/auth/services/tokenStorage';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAiTokenPurchaseHistory } from '../hooks/useAiTokenPurchaseHistory';
import { BuyTokenPlansSection } from './BuyTokenPlansSection';
import { notifyTokenChanged } from '@/shared/sync/dataSync';
import { DEFAULT_COSPLAYER_WALLET_TOPUP_REDIRECT } from '../utils/tokenRoutes';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getStatusColor(status: string): string {
  const normalized = status?.toUpperCase();
  if (normalized === 'COMPLETED' || normalized === 'SUCCESS' || normalized === 'PAID') {
    return 'bg-cosmate-success/15 text-cosmate-success';
  }
  if (normalized === 'FAILED' || normalized === 'CANCELLED' || normalized === 'CANCELED') {
    return 'bg-destructive/10 text-destructive';
  }
  if (normalized === 'PENDING' || normalized === 'PROCESSING') {
    return 'bg-cosmate-warning/15 text-cosmate-warning';
  }
  return 'bg-muted text-muted-foreground';
}

function getStatusLabel(status: string): string {
  const normalized = status?.toUpperCase();
  if (normalized === 'COMPLETED' || normalized === 'SUCCESS' || normalized === 'PAID') {
    return VI.wallet.statusCompleted;
  }
  if (normalized === 'FAILED' || normalized === 'CANCELLED' || normalized === 'CANCELED') {
    return VI.wallet.statusFailed;
  }
  if (normalized === 'PENDING' || normalized === 'PROCESSING') {
    return VI.wallet.statusPending;
  }
  return status || '—';
}

export type TokenHubContentProps = {
  backPath: string;
  walletTopUpRedirect?: string;
  variant?: 'cosplayer' | 'provider';
};

export function TokenHubContent({
  backPath,
  walletTopUpRedirect = DEFAULT_COSPLAYER_WALLET_TOPUP_REDIRECT,
  variant = 'cosplayer',
}: TokenHubContentProps) {
  const navigate = useNavigate();
  const userId = getUserId();
  const { profile, loading: loadingProfile, error: profileError, refetch } = useUserProfile();
  const {
    purchases,
    loading: loadingPurchases,
    error: purchasesError,
    isHistoryOpen,
    toggleHistory,
    fetchPurchasesIfNeeded,
  } = useAiTokenPurchaseHistory(userId);

  const handleToggleHistory = () => {
    toggleHistory();
    fetchPurchasesIfNeeded();
  };

  const tokenBalance = profile?.numberOfToken ?? 0;
  const isCosplayer = variant === 'cosplayer';
  const cardClass = isCosplayer
    ? 'overflow-hidden rounded-3xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[10px_10px_0_0_rgba(30,27,75,0.38)]'
    : 'overflow-hidden rounded-xl border border-border bg-card shadow-sm';

  const content = (
    <div className={isCosplayer ? 'mx-auto w-full max-w-3xl space-y-4' : 'mx-auto w-full max-w-4xl space-y-4'}>
      <Card className={cardClass}>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h1
              className={cn(
                'font-bold tracking-tight text-foreground',
                isCosplayer ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              )}
            >
              {VI.profile.token.hubTitle}
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

          {profileError && (
            <div className="mt-4 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
              {profileError}
            </div>
          )}

          {loadingProfile ? (
            <div className="mt-4 text-sm text-muted-foreground">{VI.profile.token.loading}</div>
          ) : (
            <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-card to-muted/40 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {VI.profile.token.balance}
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-[#d61f91] sm:text-3xl">
                {tokenBalance.toLocaleString('vi-VN')}
              </p>
            </div>
          )}

          <div
            className={cn('my-8 h-px w-full', isCosplayer ? 'bg-indigo-950/15' : 'bg-border')}
            aria-hidden
          />

          <BuyTokenPlansSection
            walletTopUpRedirect={walletTopUpRedirect}
            onPurchaseSuccess={() => {
              void refetch();
              notifyTokenChanged();
            }}
          />
        </div>
      </Card>

      <Card className={cardClass}>
        <div className="p-6 sm:p-8">
          {purchasesError && (
            <div className="mb-4 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
              {purchasesError}
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleHistory}
            aria-expanded={isHistoryOpen}
            className={cn(
              'group flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left shadow-sm transition-all duration-200',
              'hover:border-cosmate-pink/35 hover:bg-gradient-to-r hover:from-card hover:to-cosmate-soft-pink/30 hover:shadow-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmate-pink/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            )}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cosmate-pink/25 bg-cosmate-soft-pink/45 text-cosmate-pink transition-colors group-hover:border-cosmate-pink/40 group-hover:bg-cosmate-soft-pink/70"
              aria-hidden
            >
              <History className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">
                {isHistoryOpen ? VI.profile.token.hideHistory : VI.profile.token.viewHistory}
              </span>
            </span>
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-all duration-200',
                'group-hover:border-cosmate-pink/30 group-hover:bg-cosmate-soft-pink/40 group-hover:text-cosmate-pink',
                isHistoryOpen && 'border-cosmate-pink/35 bg-cosmate-soft-pink/50 text-cosmate-pink'
              )}
              aria-hidden
            >
              <ChevronDown
                className={cn('h-4 w-4 transition-transform duration-200', isHistoryOpen && 'rotate-180')}
              />
            </span>
          </button>

          {isHistoryOpen && (
            <div className="mt-4 space-y-3 rounded-2xl border border-border/80 bg-muted/20 p-3 sm:p-4">
              {loadingPurchases ? (
                <div className="rounded-xl border border-dashed border-border bg-card/60 px-4 py-8 text-center text-sm text-muted-foreground">
                  {VI.profile.token.loading}
                </div>
              ) : purchases.length === 0 ? (
                <div className="rounded-xl border border-dashed border-cosmate-pink/25 bg-cosmate-soft-pink/15 px-4 py-8 text-center text-sm text-muted-foreground">
                  {VI.profile.token.noPurchases}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-3 shadow-sm transition-colors hover:border-cosmate-pink/20 sm:px-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          +{purchase.tokensAdded.toLocaleString('vi-VN')} token
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(purchase.purchaseDate)}
                        </p>
                        {purchase.transactionId ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {VI.profile.token.transactionId}: {purchase.transactionId}
                          </p>
                        ) : null}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium text-foreground">
                          {formatCurrency(purchase.priceAtPurchase)}
                        </p>
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${getStatusColor(
                            purchase.status
                          )}`}
                        >
                          {getStatusLabel(purchase.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  if (isCosplayer) {
    return (
      <section className="home-anime min-h-[calc(100vh-64px)] bg-transparent px-3 py-8 md:px-4 md:py-10">
        {content}
      </section>
    );
  }

  return content;
}
