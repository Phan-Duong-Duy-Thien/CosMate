import type { OrderStatusValue } from '@/constants/orderStatus';
import { ORDER_STATUS_UI } from '@/constants/orderStatus';

/** Maps service-order semantic colors → admin pill chrome (tokens only). */
const SERVICE_ORDER_PILL_THEME: Record<
  string,
  { bg: string; text: string }
> = {
  slate: {
    bg: 'color-mix(in oklch, var(--muted-foreground) 16%, var(--background))',
    text: 'var(--foreground)',
  },
  orange: {
    bg: 'color-mix(in oklch, var(--cosmate-warning) 24%, var(--background))',
    text: 'var(--cosmate-warning)',
  },
  blue: {
    bg: 'color-mix(in oklch, var(--cosmate-info) 22%, var(--background))',
    text: 'var(--cosmate-info)',
  },
  purple: {
    bg: 'color-mix(in oklch, var(--primary) 14%, var(--background))',
    text: 'var(--primary)',
  },
  green: {
    bg: 'color-mix(in oklch, var(--cosmate-success) 20%, var(--background))',
    text: 'var(--cosmate-success)',
  },
  red: {
    bg: 'color-mix(in oklch, var(--destructive) 18%, var(--background))',
    text: 'var(--destructive)',
  },
  dark: {
    bg: 'color-mix(in oklch, var(--muted-foreground) 22%, var(--muted))',
    text: 'var(--foreground)',
  },
};

function isOrderStatusValue(s: string): s is OrderStatusValue {
  return (s as OrderStatusValue) != null && s in ORDER_STATUS_UI;
}

/**
 * Costume Rental Order Status UI Config
 *
 * Single source of truth for costume/rental order status rendering.
 * Used by AdminOrdersPage and any admin-side order tables.
 * Colors reference design tokens from src/index.css (no raw hex).
 *
 * Values not listed here fall through to `@/constants/orderStatus` ORDER_STATUS_UI
 * (photography/event service orders share the admin surface).
 */
export const COSTUME_ORDER_STATUS_UI: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  UNPAID: {
    label: "Chưa thanh toán",
    bg: "color-mix(in oklch, var(--cosmate-warning) 24%, var(--background))",
    text: "var(--cosmate-warning)",
  },
  PAID: {
    label: "Đã thanh toán",
    bg: "color-mix(in oklch, var(--cosmate-info) 22%, var(--background))",
    text: "var(--cosmate-info)",
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    bg: "color-mix(in oklch, var(--cosmate-warning) 18%, var(--background))",
    text: "var(--cosmate-warning)",
  },
  SHIPPING_OUT: {
    label: "Đang giao hàng",
    bg: "color-mix(in oklch, var(--cosmate-info) 16%, var(--background))",
    text: "var(--cosmate-info)",
  },
  DELIVERING_OUT: {
    label: "Đang vận chuyển",
    bg: "color-mix(in oklch, var(--chart-3) 20%, var(--background))",
    text: "var(--chart-3)",
  },
  IN_USE: {
    label: "Đang sử dụng",
    bg: "color-mix(in oklch, var(--primary) 14%, var(--background))",
    text: "var(--primary)",
  },
  SHIPPING_BACK: {
    label: "Đang trả hàng",
    bg: "color-mix(in oklch, var(--destructive) 12%, var(--background))",
    text: "var(--destructive)",
  },
  RETURNED: {
    label: "Đã trả",
    bg: "color-mix(in oklch, var(--cosmate-success) 20%, var(--background))",
    text: "var(--cosmate-success)",
  },
  COMPLETED: {
    label: "Hoàn thành",
    bg: "color-mix(in oklch, var(--cosmate-success) 20%, var(--background))",
    text: "var(--cosmate-success)",
  },
  CANCELLED: {
    label: "Đã hủy",
    bg: "color-mix(in oklch, var(--muted-foreground) 22%, var(--muted))",
    text: "var(--foreground)",
  },
  DISPUTE: {
    label: "Khiếu nại",
    bg: "color-mix(in oklch, var(--destructive) 18%, var(--background))",
    text: "var(--destructive)",
  },
  EXTENDING: {
    label: "Gia hạn",
    bg: "color-mix(in oklch, var(--cosmate-pink) 16%, var(--background))",
    text: "var(--cosmate-pink)",
  },
}

export function getCostumeOrderStatusProps(status: string): {
  label: string;
  bg: string;
  text: string;
} {
  const rental = COSTUME_ORDER_STATUS_UI[status];
  if (rental) return rental;

  if (isOrderStatusValue(status)) {
    const svc = ORDER_STATUS_UI[status];
    const theme = SERVICE_ORDER_PILL_THEME[svc.color] ?? SERVICE_ORDER_PILL_THEME.slate;
    return { label: svc.label, ...theme };
  }

  return {
    label: status,
    bg: 'color-mix(in oklch, var(--muted) 80%, var(--background))',
    text: 'var(--muted-foreground)',
  };
}
