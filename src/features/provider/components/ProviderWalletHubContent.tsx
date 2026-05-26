/**
 * Provider portal wallet UI — aligned with /subscription page styling.
 */
import { useNavigate } from 'react-router-dom';
import { ChevronDown, History, Wallet as WalletIcon } from 'lucide-react';
import { Alert, Button, Spin, Tag } from 'antd';
import { PlusCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { VI } from '@/shared/i18n/vi';
import { providerPortalUi as ui } from '../constants/providerPortalUi';
import {
  formatWalletCurrency,
  formatWalletDate,
  getWalletStatusLabel,
} from '@/features/profile/utils/walletDisplayUtils';
import { getWalletTransactionTypeLabel } from '@/features/profile/utils/walletTransactionTypeLabel';
import type { WalletInfo, WalletTransaction } from '@/features/profile/types';

export type ProviderWalletHubContentProps = {
  walletBase: string;
  walletInfo: WalletInfo | null;
  transactions: WalletTransaction[];
  loadingWallet: boolean;
  loadingTransactions: boolean;
  isTransactionsOpen: boolean;
  error: string | null;
  onToggleTransactions: () => void;
};

export function ProviderWalletHubContent({
  walletBase,
  walletInfo,
  transactions,
  loadingWallet,
  loadingTransactions,
  isTransactionsOpen,
  error,
  onToggleTransactions,
}: ProviderWalletHubContentProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className={ui.subtitleBar}>
        <p className={ui.subtitleText}>{VI.wallet.pageSubtitle}</p>
      </div>

      {error && <Alert type="error" showIcon message={error} className="mb-4" />}

      {loadingWallet && (
        <div className={ui.loadingBox}>
          <Spin size="large" />
        </div>
      )}

      {walletInfo && !loadingWallet && (
        <div className={ui.heroCard}>
          <div className={ui.heroHeader}>
            <p className={ui.heroLabel}>{VI.wallet.statusHeroTitle}</p>
            <div className="mt-2 flex items-center gap-2.5">
              <span className={ui.iconWrap}>
                <WalletOutlined style={{ fontSize: 20 }} />
              </span>
              <span className={ui.heroTitle}>{VI.wallet.title}</span>
            </div>
          </div>

          <div className={ui.heroBody}>
            <div className={`grid gap-3 ${walletInfo.depositBalance > 0 ? 'sm:grid-cols-2' : ''}`}>
              <div className={ui.statCardPink}>
                <div className="mb-2 flex items-center gap-2 text-cosmate-mauve">
                  <WalletIcon className="h-4 w-4" />
                  <span className={ui.statLabel}>{VI.wallet.balance}</span>
                </div>
                <p className={ui.statValuePink}>{formatWalletCurrency(walletInfo.balance)}</p>
              </div>
              {walletInfo.depositBalance > 0 && (
                <div className={ui.statCardGreen}>
                  <p className="mb-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    {VI.wallet.depositBalance}
                  </p>
                  <p className={ui.statValueGreen}>{formatWalletCurrency(walletInfo.depositBalance)}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-cosmate-lavender-border/80 pt-5 sm:flex-row sm:justify-end">
              <Button size="large" className={ui.defaultBtn} onClick={() => navigate(`${walletBase}/withdraw`)}>
                {VI.wallet.withdraw}
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<PlusCircleOutlined />}
                className={ui.primaryBtn}
                onClick={() => navigate(`${walletBase}/topup`)}
              >
                {VI.wallet.topup}
              </Button>
            </div>
          </div>
        </div>
      )}

      <section className={ui.sectionWrap}>
        <div className={ui.sectionTitle}>
          <h3 className={ui.sectionHeading}>{VI.wallet.viewTransactions}</h3>
        </div>

        <button
          type="button"
          onClick={onToggleTransactions}
          aria-expanded={isTransactionsOpen}
          className={`mb-4 flex w-full items-center justify-between gap-3 ${ui.innerPanel} text-left transition-colors hover:bg-cosmate-lavender-surface/60`}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-cosmate-ink">
            <History className="h-4 w-4 text-cosmate-pink" />
            {isTransactionsOpen ? VI.wallet.hideTransactions : VI.wallet.viewTransactions}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-cosmate-mauve transition-transform ${isTransactionsOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isTransactionsOpen && (
          <>
            {loadingTransactions && (
              <div className={ui.emptyBox}>
                <Spin />
              </div>
            )}
            {!loadingTransactions && transactions.length === 0 && (
              <div className={ui.emptyBox}>{VI.wallet.noTransactions}</div>
            )}
            {!loadingTransactions && transactions.length > 0 && (
              <div className={ui.transactionList}>
                {transactions.map((transaction) => (
                  <div key={transaction.id} className={ui.transactionRow}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-cosmate-ink">
                        {getWalletTransactionTypeLabel(transaction.type)}
                      </p>
                      <p className="text-xs text-cosmate-mauve">
                        {formatWalletDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums text-cosmate-ink">
                        {formatWalletCurrency(transaction.amount)}
                      </p>
                      <Tag
                        className="!mt-1 !mr-0"
                        color={
                          transaction.status?.toUpperCase() === 'COMPLETED'
                            ? 'success'
                            : transaction.status?.toUpperCase() === 'FAILED'
                              ? 'error'
                              : 'warning'
                        }
                      >
                        {getWalletStatusLabel(transaction.status)}
                      </Tag>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
