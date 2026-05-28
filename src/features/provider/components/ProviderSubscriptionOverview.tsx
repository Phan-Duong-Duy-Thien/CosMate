/**
 * ProviderSubscriptionOverview — styled status card + progress (subscriptions-info API).
 */
import { Alert, Progress, Spin } from 'antd';
import { CalendarOutlined, CrownOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import type { ProviderSubscriptionInfo } from '../types';

const LOW_DAYS_THRESHOLD = 30;

interface ProviderSubscriptionOverviewProps {
  info: ProviderSubscriptionInfo | null;
  loading: boolean;
  error: string | null;
}

function formatDays(value: number): string {
  return `${value.toLocaleString('vi-VN')} ${VI.provider.subscription.daysSuffix}`;
}

export function ProviderSubscriptionOverview({
  info,
  loading,
  error,
}: ProviderSubscriptionOverviewProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-cosmate-lavender-border bg-gradient-to-br from-cosmate-soft-pink/40 to-cosmate-lavender-surface py-16">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" showIcon message={error} />;
  }

  if (!info) {
    return <Alert type="info" showIcon message={VI.provider.subscription.empty} />;
  }

  const stackedExtraDays = Math.max(0, info.totalRemainingDays - info.currentDaysRemaining);
  const progressPercent = Math.min(
    100,
    Math.round((info.currentDaysRemaining / Math.max(info.totalRemainingDays, 1)) * 100),
  );
  const showLowDaysWarning = info.currentDaysRemaining <= LOW_DAYS_THRESHOLD;

  return (
    <div className="space-y-3">
      {showLowDaysWarning && (
        <Alert type="warning" showIcon message={VI.provider.subscription.lowDaysWarning} />
      )}

      <div className="overflow-hidden rounded-2xl border border-cosmate-lavender-border bg-gradient-to-br from-cosmate-soft-pink/50 via-card to-cosmate-lavender-surface/80 shadow-[0_4px_24px_color-mix(in_oklch,var(--cosmate-pink)_12%,transparent)]">
        <div className="border-b border-cosmate-lavender-border/80 bg-gradient-to-r from-cosmate-pink/10 to-cosmate-lavender-surface/60 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-cosmate-mauve">
            {VI.provider.subscription.statusHeroTitle}
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cosmate-pink/15 text-cosmate-pink">
              <CrownOutlined style={{ fontSize: 20 }} />
            </span>
            <span className="text-xl font-bold text-cosmate-ink sm:text-2xl">{info.currentPlanName}</span>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-cosmate-lavender-border bg-card/90 p-4 shadow-sm backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-cosmate-mauve">
                <CalendarOutlined />
                <span className="text-sm font-medium">
                  {VI.provider.subscription.currentDaysRemaining}
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums text-primary sm:text-3xl">
                {info.currentDaysRemaining.toLocaleString('vi-VN')}
                <span className="ml-1.5 text-base font-semibold text-cosmate-mauve">
                  {VI.provider.subscription.daysSuffix}
                </span>
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-card p-4 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/30">
              <div className="mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <FieldTimeOutlined />
                <span className="text-sm font-medium">
                  {VI.provider.subscription.totalRemainingDays}
                </span>
              </div>
              <p className="text-2xl font-bold tabular-nums text-cosmate-success sm:text-3xl">
                {info.totalRemainingDays.toLocaleString('vi-VN')}
                <span className="ml-1.5 text-base font-semibold text-emerald-700/80 dark:text-emerald-400/90">
                  {VI.provider.subscription.daysSuffix}
                </span>
              </p>
              {stackedExtraDays > 0 && (
                <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {VI.provider.subscription.stackedDaysBadge.replace(
                    '{count}',
                    stackedExtraDays.toLocaleString('vi-VN'),
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-cosmate-lavender-border/80 bg-cosmate-lavender-surface/40 px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-cosmate-ink">{VI.provider.subscription.progressLabel}</span>
              <span className="font-bold tabular-nums text-cosmate-pink">{progressPercent}%</span>
            </div>
            <Progress
              percent={progressPercent}
              showInfo={false}
              strokeColor={{
                '0%': 'var(--cosmate-pink)',
                '100%': 'var(--cosmate-lavender)',
              }}
              trailColor="color-mix(in oklch, var(--cosmate-lavender-border) 70%, transparent)"
              size={['100%', 10]}
              className="[&_.ant-progress-bg]:!rounded-full [&_.ant-progress-inner]:!rounded-full"
            />
            <p className="mt-2 text-xs leading-relaxed text-cosmate-mauve">
              {formatDays(info.currentDaysRemaining)} / {formatDays(info.totalRemainingDays)}
              {stackedExtraDays > 0 && ` · ${VI.provider.subscription.stackedDaysHint}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
