import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { VI } from '@/shared/i18n/vi';
import type { NotificationItem } from '../types';
import {
  showNotificationActionToast,
  showNotificationDetailToast,
} from '../utils/showNotificationToast';

type UseNotificationInteractionsParams = {
  markNotificationRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<boolean>;
  deleteNotification: (id: number) => Promise<boolean>;
};

export function useNotificationInteractions({
  markNotificationRead,
  markAllRead,
  deleteNotification,
}: UseNotificationInteractionsParams) {
  const navigate = useNavigate();

  const handleOpenNotification = useCallback(
    async (n: NotificationItem) => {
      if (!n.isRead) {
        await markNotificationRead(n.id);
      }
      const followLink = n.link?.trim()
        ? () => {
            const link = n.link!.trim();
            if (link.startsWith('http')) {
              window.open(link, '_blank', 'noopener,noreferrer');
            } else {
              navigate(link.startsWith('/') ? link : `/${link}`);
            }
          }
        : undefined;
      showNotificationDetailToast(n, { onViewLink: followLink });
    },
    [markNotificationRead, navigate]
  );

  const requestDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: 'Xóa thông báo này?',
        okText: VI.common.actions.delete,
        cancelText: VI.common.actions.cancel,
        okButtonProps: { danger: true },
        onOk: async () => {
          const ok = await deleteNotification(id);
          showNotificationActionToast('delete', ok);
        },
      });
    },
    [deleteNotification]
  );

  const markAllWithToast = useCallback(async () => {
    const ok = await markAllRead();
    showNotificationActionToast('readAll', ok);
    return ok;
  }, [markAllRead]);

  return {
    handleOpenNotification,
    requestDelete,
    markAllWithToast,
  };
}
