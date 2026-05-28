import { Spin } from 'antd';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VI } from '@/shared/i18n/vi';
import type { NotificationItem } from '../types';
import { formatNotificationDisplayText } from '../utils/formatNotificationDisplayText';

export type NotificationPopoverUiTokens = {
  shell: string;
  header: string;
  title: string;
  markAllBtn: string;
  list: string;
  empty: string;
  item: string;
  itemUnread: string;
  itemHeaderRead: string;
  itemHeaderUnread: string;
  itemContent: string;
  deleteBtn: string;
  footer: string;
  unreadDot: string;
  readDot: string;
};

type NotificationPopoverPanelProps = {
  ui: NotificationPopoverUiTokens;
  notifications: NotificationItem[];
  loading: boolean;
  unreadCount: number;
  onMarkAllRead: () => void | Promise<void>;
  onActivateItem: (item: NotificationItem) => void | Promise<void>;
  onDeleteItem: (id: number) => void;
  onViewAll: () => void;
};

export function NotificationPopoverPanel({
  ui,
  notifications,
  loading,
  unreadCount,
  onMarkAllRead,
  onActivateItem,
  onDeleteItem,
  onViewAll,
}: NotificationPopoverPanelProps) {
  return (
    <div className={ui.shell}>
      <div className={ui.header}>
        <p className={ui.title}>{VI.notification.title}</p>
        <button
          type="button"
          disabled={unreadCount === 0 || loading}
          onClick={() => void onMarkAllRead()}
          className={cn(
            ui.markAllBtn,
            (unreadCount === 0 || loading) && 'cursor-not-allowed opacity-45',
          )}
        >
          {VI.notification.markAllRead}
        </button>
      </div>
      <div className={ui.list}>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Spin size="small" />
          </div>
        ) : notifications.length === 0 ? (
          <div className={ui.empty}>{VI.notification.empty}</div>
        ) : (
          <>
            {notifications.slice(0, 10).map((n) => (
              <div
                key={n.id}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    void onActivateItem(n);
                  }
                }}
                onClick={() => void onActivateItem(n)}
                className={cn(ui.item, !n.isRead && ui.itemUnread)}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={n.isRead ? ui.readDot : ui.unreadDot}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className={n.isRead ? ui.itemHeaderRead : ui.itemHeaderUnread}>
                      {n.header}
                    </p>
                    <p className={ui.itemContent}>
                      {formatNotificationDisplayText(n.content)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Xóa thông báo"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(n.id);
                    }}
                    className={ui.deleteBtn}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {notifications.length > 0 && (
        <div
          role="button"
          tabIndex={0}
          className={ui.footer}
          onClick={onViewAll}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onViewAll();
            }
          }}
        >
          {VI.notification.viewAll} →
        </div>
      )}
    </div>
  );
}
