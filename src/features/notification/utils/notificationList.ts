import type { NotificationItem } from '../types';

export type CosplayerNotificationTab = 'unread' | 'read' | 'orders' | 'messages';

export type ProviderNotificationTab =
  | 'unread'
  | 'read'
  | 'orders'
  | 'messages'
  | 'finance'
  | 'system';

const MESSAGE_NOTIFICATION_TYPES = new Set(['CHAT', 'MESSAGE', 'NEW_MESSAGE']);

export function isMessageNotification(n: { type: string; header: string }): boolean {
  if (MESSAGE_NOTIFICATION_TYPES.has(n.type)) return true;
  const h = n.header.toLowerCase();
  return (
    h.includes('tin nhắn') || h.includes('gửi tin') || h.includes('tin nhắn cho bạn')
  );
}

export function isOrderNotification(n: { type: string }): boolean {
  return n.type === 'ORDER_STATUS';
}

export function isFinanceNotification(n: { type: string }): boolean {
  return n.type === 'WALLET_CREDIT';
}

export function isSystemNotification(n: NotificationItem): boolean {
  if (isOrderNotification(n) || isMessageNotification(n) || isFinanceNotification(n)) {
    return false;
  }
  return true;
}

export function formatSendAt(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    WALLET_CREDIT: 'Nạp tiền',
    ORDER_STATUS: 'Đơn hàng',
    REMINDER: 'Nhắc nhở',
    SYSTEM: 'Hệ thống',
    CHAT: 'Tin nhắn',
    MESSAGE: 'Tin nhắn',
    NEW_MESSAGE: 'Tin nhắn',
  };
  return map[type] ?? 'Thông báo';
}

export function cosplayerTypeBadgeClasses(type: string): string {
  const map: Record<string, string> = {
    WALLET_CREDIT: 'border-emerald-700 bg-emerald-100 text-emerald-950',
    ORDER_STATUS: 'border-violet-700 bg-violet-100 text-violet-950',
    REMINDER: 'border-amber-700 bg-amber-100 text-amber-950',
    SYSTEM: 'border-slate-600 bg-slate-100 text-slate-900',
    CHAT: 'border-sky-700 bg-sky-100 text-sky-950',
    MESSAGE: 'border-sky-700 bg-sky-100 text-sky-950',
    NEW_MESSAGE: 'border-sky-700 bg-sky-100 text-sky-950',
  };
  return map[type] ?? 'border-pink-600 bg-pink-100 text-pink-950';
}

export function providerTypeBadgeClasses(type: string): string {
  const map: Record<string, string> = {
    WALLET_CREDIT: 'border-emerald-200/80 bg-emerald-50 text-emerald-800',
    ORDER_STATUS: 'border-violet-200/80 bg-violet-50 text-violet-800',
    REMINDER: 'border-amber-200/80 bg-amber-50 text-amber-900',
    SYSTEM: 'border-cosmate-lavender-border bg-cosmate-lavender-surface/60 text-cosmate-mauve',
    CHAT: 'border-sky-200/80 bg-sky-50 text-sky-800',
    MESSAGE: 'border-sky-200/80 bg-sky-50 text-sky-800',
    NEW_MESSAGE: 'border-sky-200/80 bg-sky-50 text-sky-800',
  };
  return map[type] ?? 'border-cosmate-lavender-border bg-cosmate-soft-pink/40 text-cosmate-pink';
}

export type ParsedContent =
  | { mode: 'text'; text: string }
  | { mode: 'image-only'; url: string }
  | { mode: 'text-with-image'; text: string; imageUrl: string };

function isProbablyImageUrl(raw: string): boolean {
  const path = raw.split('?')[0].toLowerCase();
  if (/\.(jpe?g|png|gif|webp|avif|bmp)(\?|$)/.test(path)) return true;
  if (path.includes('storage.googleapis.com')) return true;
  if (path.includes('firebase') || path.includes('googleusercontent')) return true;
  return false;
}

function tokensSingleUrl(s: string): boolean {
  return /^https?:\/\//i.test(s) && s.split(/\s+/).filter(Boolean).length === 1;
}

export function parseNotificationContent(content: string): ParsedContent {
  const trimmed = content.trim();
  const tokens = trimmed.split(/\s+/).filter(Boolean);

  if (tokens.length === 1 && /^https?:\/\//i.test(trimmed)) {
    if (isProbablyImageUrl(trimmed)) {
      return { mode: 'image-only', url: trimmed };
    }
    try {
      const u = new URL(trimmed);
      const short =
        `${u.hostname}${u.pathname.length > 36 ? `${u.pathname.slice(0, 34)}…` : u.pathname}` +
        (u.search ? '…' : '');
      return { mode: 'text', text: short || trimmed };
    } catch {
      return { mode: 'text', text: trimmed.slice(0, 120) + (trimmed.length > 120 ? '…' : '') };
    }
  }

  const urlMatch = content.match(/https?:\/\/[^\s<>]+/);
  if (urlMatch?.[0] && isProbablyImageUrl(urlMatch[0])) {
    const imageUrl = urlMatch[0];
    const rest = content.replace(imageUrl, '').trim();
    return {
      mode: 'text-with-image',
      text: rest,
      imageUrl,
    };
  }

  return { mode: 'text', text: content };
}

export function shortenGenericUrl(content: string): string {
  const trimmed = content.trim();
  if (tokensSingleUrl(trimmed)) {
    try {
      const u = new URL(trimmed);
      const path = u.pathname.length > 40 ? `${u.pathname.slice(0, 38)}…` : u.pathname;
      return `${u.hostname}${path}` || trimmed;
    } catch {
      return trimmed.slice(0, 100) + (trimmed.length > 100 ? '…' : '');
    }
  }
  return content;
}

function sortBySendAt(list: NotificationItem[]): NotificationItem[] {
  return [...list].sort(
    (a, b) => new Date(b.sendAt).getTime() - new Date(a.sendAt).getTime()
  );
}

export function filterCosplayerNotificationsByTab(
  list: NotificationItem[],
  tab: CosplayerNotificationTab
): NotificationItem[] {
  let out: NotificationItem[];
  switch (tab) {
    case 'unread':
      out = list.filter((n) => !n.isRead);
      break;
    case 'read':
      out = list.filter((n) => n.isRead);
      break;
    case 'orders':
      out = list.filter((n) => isOrderNotification(n));
      break;
    case 'messages':
      out = list.filter((n) => isMessageNotification(n));
      break;
  }
  return sortBySendAt(out);
}

export function filterProviderNotificationsByTab(
  list: NotificationItem[],
  tab: ProviderNotificationTab
): NotificationItem[] {
  let out: NotificationItem[];
  switch (tab) {
    case 'unread':
      out = list.filter((n) => !n.isRead);
      break;
    case 'read':
      out = list.filter((n) => n.isRead);
      break;
    case 'orders':
      out = list.filter((n) => isOrderNotification(n));
      break;
    case 'messages':
      out = list.filter((n) => isMessageNotification(n));
      break;
    case 'finance':
      out = list.filter((n) => isFinanceNotification(n));
      break;
    case 'system':
      out = list.filter((n) => isSystemNotification(n));
      break;
  }
  return sortBySendAt(out);
}

export function cosplayerTabCounts(list: NotificationItem[]) {
  return {
    unread: list.filter((n) => !n.isRead).length,
    read: list.filter((n) => n.isRead).length,
    orders: list.filter((n) => isOrderNotification(n)).length,
    messages: list.filter((n) => isMessageNotification(n)).length,
  };
}

export function providerTabCounts(list: NotificationItem[]) {
  return {
    unread: list.filter((n) => !n.isRead).length,
    read: list.filter((n) => n.isRead).length,
    orders: list.filter((n) => isOrderNotification(n)).length,
    messages: list.filter((n) => isMessageNotification(n)).length,
    finance: list.filter((n) => isFinanceNotification(n)).length,
    system: list.filter((n) => isSystemNotification(n)).length,
  };
}

export type ProviderTabCounts = ReturnType<typeof providerTabCounts>;

export function pickInitialCosplayerTab(counts: ReturnType<typeof cosplayerTabCounts>): CosplayerNotificationTab {
  if (counts.unread > 0) return 'unread';
  if (counts.messages > 0) return 'messages';
  if (counts.orders > 0) return 'orders';
  return 'read';
}

export function pickInitialProviderTab(counts: ProviderTabCounts): ProviderNotificationTab {
  if (counts.unread > 0) return 'unread';
  if (counts.messages > 0) return 'messages';
  if (counts.orders > 0) return 'orders';
  if (counts.finance > 0) return 'finance';
  if (counts.system > 0) return 'system';
  return 'read';
}

export function unreadCountLabel(list: { isRead: boolean }[]): number {
  return list.filter((n) => !n.isRead).length;
}
