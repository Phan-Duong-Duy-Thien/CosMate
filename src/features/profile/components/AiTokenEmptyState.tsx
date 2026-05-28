import { useNavigate } from 'react-router-dom';
import { Coins, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import { VI } from '@/shared/i18n/vi';

export type AiTokenEmptyStateProps = {
  cost: number;
  balance: number | null;
  tokenHubPath: string;
  featureLabel?: string;
  message?: string | null;
  compact?: boolean;
  className?: string;
};

const CTA_CLASSNAME =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-[3px] border-indigo-950 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 px-5 font-extrabold text-white shadow-[5px_5px_0_0_#1e1b4b] transition hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[6px_6px_0_0_#1e1b4b] active:translate-y-px active:shadow-[3px_3px_0_0_#1e1b4b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/80';

export function AiTokenEmptyState({
  cost,
  balance,
  tokenHubPath,
  featureLabel,
  message,
  compact = false,
  className,
}: AiTokenEmptyStateProps) {
  const navigate = useNavigate();

  const detail =
    message ??
    (balance !== null && featureLabel
      ? VI.profile.token.insufficientDetail(featureLabel, cost, balance)
      : VI.profile.token.insufficient);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border-[3px] border-amber-500 bg-gradient-to-br from-amber-50 via-[#fffbeb] to-orange-100 text-amber-950',
        'shadow-[8px_8px_0_0_rgba(217,119,6,0.28)] ring-2 ring-amber-400/50 ring-offset-2 ring-offset-[#fffbeb]',
        compact ? 'p-3' : 'p-4 sm:p-5',
        className,
      )}
      role="alert"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-amber-300/35 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber-400 via-orange-500 to-rose-500"
      />

      <div
        className={cn(
          'relative flex gap-3 pl-2',
          compact ? 'flex-row items-center' : 'flex-col sm:flex-row sm:items-center',
        )}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <span
            className={cn(
              'flex shrink-0 items-center justify-center rounded-xl border-2 border-amber-600/80 bg-amber-100 shadow-[3px_3px_0_0_rgba(180,83,9,0.25)]',
              compact ? 'h-9 w-9' : 'h-11 w-11',
            )}
            aria-hidden
          >
            <Coins className={cn('text-amber-700', compact ? 'h-4 w-4' : 'h-5 w-5')} />
          </span>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className={cn('font-extrabold tracking-tight text-indigo-950', compact ? 'text-sm' : 'text-base')}>
              {VI.profile.token.emptyTitle}
            </p>
            <p className={cn('text-amber-950/90', compact ? 'text-xs' : 'text-sm')}>{detail}</p>
            {featureLabel && !compact && (
              <p className="text-xs font-semibold text-amber-800/75">
                {VI.profile.token.costPerUse(featureLabel, cost)}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          className={cn(CTA_CLASSNAME, compact ? 'h-9 px-4 text-xs' : 'h-11 text-sm')}
          onClick={() => navigate(tokenHubPath)}
        >
          <Sparkles className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden />
          {VI.profile.token.buyMoreCta}
        </button>
      </div>
    </div>
  );
}
