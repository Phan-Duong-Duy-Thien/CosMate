import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import {
  Bell,
  Trash2,
  Mail,
  MailOpen,
  ShoppingBag,
  MessageCircle,
  Wallet,
  Crown,
  Sparkles,
  Coins,
} from 'lucide-react';
import { DashboardLayout } from '@/app/layouts/DashboardLayout';
import type { DashboardSidebarItem } from '@/app/layouts/DashboardLayout';
import {
  providerSidebarItems,
  photographSidebarItems,
  eventStaffSidebarItems,
} from '@/features/provider/constants/sidebar';
import { providerNotificationUi } from '@/features/provider/constants/providerNotificationUi';
import { useNotifications } from '@/features/notification/hooks/useNotifications';
import { useNotificationInteractions } from '@/features/notification/hooks/useNotificationInteractions';
import { NotificationContentPreview } from '@/features/notification/components/NotificationContentPreview';
import { VI } from '@/shared/i18n/vi';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '@/features/notification/types';
import {
  type ProviderNotificationTab,
  filterProviderNotificationsByTab,
  formatSendAt,
  getTypeLabel,
  pickInitialProviderTab,
  providerTabCounts,
  providerTypeBadgeClasses,
} from '@/features/notification/utils/notificationList';
import {
  getProviderMessagesPath,
  getProviderOrdersPath,
  getProviderSubscriptionPath,
  getProviderWalletPath,
} from '@/features/profile/utils/tokenRoutes';

function ProviderNotificationsQuickLinks() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const ui = providerNotificationUi.page;

  const cards = [
    {
      badge: VI.notification.providerRailOrdersBadge,
      title: VI.notification.providerRailOrdersTitle,
      cta: VI.notification.providerRailOrdersCta,
      icon: ShoppingBag,
      path: getProviderOrdersPath(pathname),
      badgeClass: 'text-violet-700',
    },
    {
      badge: VI.notification.providerRailMessagesBadge,
      title: VI.notification.providerRailMessagesTitle,
      cta: VI.notification.providerRailMessagesCta,
      icon: MessageCircle,
      path: getProviderMessagesPath(pathname),
      badgeClass: 'text-sky-700',
    },
    {
      badge: VI.notification.providerRailWalletBadge,
      title: VI.notification.providerRailWalletTitle,
      cta: VI.notification.providerRailWalletCta,
      icon: Wallet,
      path: getProviderWalletPath(pathname),
      badgeClass: 'text-emerald-700',
    },
    {
      badge: VI.notification.providerRailSubscriptionBadge,
      title: VI.notification.providerRailSubscriptionTitle,
      cta: VI.notification.providerRailSubscriptionCta,
      icon: Crown,
      path: getProviderSubscriptionPath(pathname),
      badgeClass: 'text-cosmate-pink',
    },
  ];

  return (
    <div className={ui.quickLinksWrap}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cosmate-mauve">
        {VI.notification.providerQuickLinksTitle}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.path}
              type="button"
              onClick={() => navigate(card.path)}
              className={ui.quickLinkCard}
            >
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide',
                  card.badgeClass,
                )}
              >
                <Icon className="h-3 w-3" aria-hidden />
                {card.badge}
              </span>
              <span className="text-sm font-semibold text-cosmate-ink">{card.title}</span>
              <span className="text-[11px] font-medium text-cosmate-pink">{card.cta} →</span>
            </button>
          );
        })}
      </div>
      <p className={ui.tipsBox}>
        <Sparkles className="mb-0.5 mr-1 inline h-3.5 w-3.5 text-cosmate-pink" aria-hidden />
        {VI.notification.providerRailTipsTitle}: {VI.notification.providerRailTipsBody}
      </p>
    </div>
  );
}

function ProviderNotificationRow({
  item: n,
  onOpen,
  onDeleteRequest,
}: {
  item: NotificationItem;
  onOpen: (n: NotificationItem) => void;
  onDeleteRequest: (id: number) => void;
}) {
  const ui = providerNotificationUi.page;

  return (
    <li>
      <article
        role="button"
        tabIndex={0}
        onClick={() => void onOpen(n)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            void onOpen(n);
          }
        }}
        className={cn(ui.row, !n.isRead && ui.rowUnread)}
      >
        <div className="flex gap-3">
          <span
            className={cn(
              'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full',
              n.isRead ? 'bg-cosmate-lavender-border' : 'bg-cosmate-pink',
            )}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p
                className={cn(
                  'text-sm leading-snug text-cosmate-ink',
                  n.isRead ? 'font-medium opacity-90' : 'font-semibold',
                )}
              >
                {n.header}
              </p>
              {!n.isRead && <span className={ui.newBadge}>Mới</span>}
            </div>
            <NotificationContentPreview content={n.content} variant="provider" />
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-cosmate-lavender-border/50 pt-3">
              <span
                className={cn(
                  'rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  providerTypeBadgeClasses(n.type),
                )}
              >
                {getTypeLabel(n.type)}
              </span>
              <time dateTime={n.sendAt} className="text-[11px] font-medium text-cosmate-mauve">
                {formatSendAt(n.sendAt)}
              </time>
              {n.link ? (
                <span className="text-[11px] font-medium text-sky-700"> · Có liên kết</span>
              ) : null}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRequest(n.id);
                }}
                className={ui.deleteRowBtn}
                aria-label="Xóa thông báo"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

export default function ProviderNotificationsPage() {
  const location = useLocation();
  const isPhotograph = location.pathname.startsWith('/provider-photograph');
  const isEventStaff = location.pathname.startsWith('/provider-event-staff');

  const rawSidebarItems = isPhotograph
    ? photographSidebarItems
    : isEventStaff
      ? eventStaffSidebarItems
      : providerSidebarItems;

  const brandName = isPhotograph
    ? 'CosMate Photographer'
    : isEventStaff
      ? 'CosMate Event Staff'
      : 'CosMate Provider';

  const sidebarItems: DashboardSidebarItem[] = rawSidebarItems.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon size={18} />,
      path: item.path,
    };
  });

  const { notifications, loading, markNotificationRead, markAllRead, deleteNotification } =
    useNotifications();
  const { handleOpenNotification, requestDelete, markAllWithToast } =
    useNotificationInteractions({
      markNotificationRead,
      markAllRead,
      deleteNotification,
    });

  const [listTab, setListTab] = React.useState<ProviderNotificationTab>('unread');
  const ui = providerNotificationUi.page;

  const counts = React.useMemo(() => providerTabCounts(notifications), [notifications]);
  const filtered = React.useMemo(
    () => filterProviderNotificationsByTab(notifications, listTab),
    [notifications, listTab],
  );

  const filterTabs = React.useMemo(
    () =>
      [
        { id: 'unread' as const, label: VI.notification.filterUnread, icon: Mail, count: counts.unread },
        { id: 'read' as const, label: VI.notification.filterRead, icon: MailOpen, count: counts.read },
        {
          id: 'orders' as const,
          label: VI.notification.filterOrders,
          icon: ShoppingBag,
          count: counts.orders,
        },
        {
          id: 'messages' as const,
          label: VI.notification.filterMessages,
          icon: MessageCircle,
          count: counts.messages,
        },
        {
          id: 'finance' as const,
          label: VI.notification.filterFinance,
          icon: Coins,
          count: counts.finance,
        },
        {
          id: 'system' as const,
          label: VI.notification.filterSystem,
          icon: Bell,
          count: counts.system,
        },
      ],
    [counts],
  );

  const tabInitRef = React.useRef(false);
  React.useEffect(() => {
    if (loading || notifications.length === 0) return;
    if (tabInitRef.current) return;
    tabInitRef.current = true;
    setListTab(pickInitialProviderTab(counts));
  }, [counts, loading, notifications.length]);

  return (
    <DashboardLayout
      title={VI.notification.providerPageTitle}
      sidebarItems={sidebarItems}
      brandName={brandName}
      showChatButton={false}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        {notifications.some((n) => !n.isRead) && (
          <div className={cn(ui.hero, 'justify-end')}>
            <button type="button" onClick={() => void markAllWithToast()} className={ui.markAllBtn}>
              {VI.notification.markAllRead}
            </button>
          </div>
        )}

        <div className={cn(ui.panel, 'p-4 md:p-5')}>
          <div className="lg:grid lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-start lg:gap-6">
            <aside className="mb-6 min-w-0 lg:sticky lg:top-4 lg:mb-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cosmate-mauve">
                {VI.notification.filterLabel}
              </p>
              <nav aria-label={VI.notification.filterLabel} className={ui.filterNav}>
                {filterTabs.map((t) => {
                  const Icon = t.icon;
                  const active = listTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setListTab(t.id)}
                      className={cn(ui.filterTab, active && ui.filterTabActive)}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className={cn(
                            ui.filterIconWrap,
                            active && ui.filterIconWrapActive,
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        </span>
                        <span className="min-w-0 truncate text-xs font-semibold">{t.label}</span>
                      </span>
                      <span className="inline-flex min-w-6 justify-center rounded-md bg-cosmate-lavender-surface/50 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-cosmate-mauve">
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </nav>
              <div className={ui.filterHint}>{VI.notification.providerFilterHintSidebar}</div>
            </aside>

            <div className={ui.listArea}>
              {loading ? (
                <div className="flex flex-col items-center gap-3 py-16">
                  <Spin />
                  <span className="text-sm font-medium text-cosmate-mauve">
                    {VI.common.status.loading}
                  </span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center px-4 py-16 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-cosmate-soft-pink/50 text-cosmate-pink">
                    <Bell className="h-7 w-7" aria-hidden />
                  </span>
                  <p className="mt-4 text-base font-semibold text-cosmate-ink">
                    {VI.notification.empty}
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center px-4 py-14 text-center">
                  <Mail className="h-10 w-10 text-cosmate-mauve" aria-hidden />
                  <p className="mt-4 text-base font-semibold text-cosmate-ink">
                    {VI.notification.emptyInFilter}
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-cosmate-mauve">
                    {VI.notification.filterEmptyHintMobile}
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {filtered.map((n) => (
                    <ProviderNotificationRow
                      key={n.id}
                      item={n}
                      onOpen={handleOpenNotification}
                      onDeleteRequest={requestDelete}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>

          <ProviderNotificationsQuickLinks />
        </div>
      </div>
    </DashboardLayout>
  );
}
