import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover } from 'antd';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/features/notification/hooks/useNotifications';
import { useNotificationInteractions } from '@/features/notification/hooks/useNotificationInteractions';
import { NotificationPopoverPanel } from '@/features/notification/components/NotificationPopoverPanel';
import { providerNotificationUi } from '../constants/providerNotificationUi';
import type { NotificationItem } from '@/features/notification/types';

type ProviderNotificationHeaderBellProps = {
  viewAllPath: string;
};

export function ProviderNotificationHeaderBell({ viewAllPath }: ProviderNotificationHeaderBellProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    notifications,
    loading,
    unreadCount,
    markNotificationRead,
    markAllRead,
    deleteNotification,
  } = useNotifications();
  const { handleOpenNotification, requestDelete, markAllWithToast } =
    useNotificationInteractions({
      markNotificationRead,
      markAllRead,
      deleteNotification,
    });

  const handleActivateItem = (n: NotificationItem) => {
    void handleOpenNotification(n);
  };

  const popoverContent = (
    <NotificationPopoverPanel
      ui={providerNotificationUi.popover}
      notifications={notifications}
      loading={loading}
      unreadCount={unreadCount}
      onMarkAllRead={() => void markAllWithToast()}
      onActivateItem={handleActivateItem}
      onDeleteItem={requestDelete}
      onViewAll={() => {
        navigate(viewAllPath);
        setOpen(false);
      }}
    />
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      arrow={false}
      align={{ offset: [0, 8] }}
      classNames={{ root: 'cosmate-provider-notif-popover' }}
      styles={{
        root: { padding: 0, background: 'transparent', boxShadow: 'none' },
        container: { padding: 0, background: 'transparent', boxShadow: 'none', border: 'none', borderRadius: 0 },
        body: { padding: 0, background: 'transparent', boxShadow: 'none' },
      }}
    >
      <button
        type="button"
        aria-label="Thông báo"
        title="Thông báo"
        className="relative flex h-9 cursor-pointer items-center justify-center rounded-lg border border-transparent p-1.5 text-cosmate-pink transition-colors hover:border-cosmate-pink/25 hover:bg-cosmate-soft-pink/50 hover:text-cosmate-mauve"
      >
        <Bell size={22} className="shrink-0" aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-md bg-destructive px-0.5 text-[9px] font-bold leading-none text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </Popover>
  );
}
