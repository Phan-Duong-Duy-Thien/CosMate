/**
 * Service Order Status Constants
 *
 * Single source of truth for all service order statuses.
 * Used by both backend-driven logic and UI rendering.
 */
export const ORDER_STATUS = {
  UNCONFIRM: 'UNCONFIRM',
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  WAITING_SERVICE_DATE: 'WAITING_SERVICE_DATE',
  IN_SERVICE: 'IN_SERVICE',
  COMPLETED: 'COMPLETED',
  DISPUTE: 'DISPUTE',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatusValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/**
 * Provider-side UI config for each status.
 * Drives: label, color, available actions, urgent flag.
 *
 * To add a new action:
 *   1. Add the action key to the `actions` array.
 *   2. Handle it in the UI via: ORDER_STATUS_UI[order.status]?.actions.includes('ACTION_NAME')
 */
export const ORDER_STATUS_UI: Record<
  OrderStatusValue,
  { label: string; color: string; actions: string[]; badgeClass: string }
> = {
  UNCONFIRM: {
    label: 'Chưa xác nhận',
    color: 'slate',
    actions: [],
    badgeClass: 'bg-slate-100 text-slate-600',
  },
  UNPAID: {
    label: 'Chưa thanh toán',
    color: 'orange',
    actions: [],
    badgeClass: 'bg-orange-100 text-orange-700',
  },
  PAID: {
    label: 'Đã thanh toán',
    color: 'blue',
    actions: ['SET_WAITING'],
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  WAITING_SERVICE_DATE: {
    label: 'Chờ ngày thực hiện',
    color: 'orange',
    actions: ['START_SERVICE'],
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  IN_SERVICE: {
    label: 'Đang thực hiện',
    color: 'purple',
    actions: ['COMPLETE_SERVICE'],
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'green',
    actions: [],
    badgeClass: 'bg-green-100 text-green-700',
  },
  DISPUTE: {
    label: 'Khiếu nại',
    color: 'red',
    actions: [],
    badgeClass: 'bg-red-100 text-red-700',
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'dark',
    actions: [],
    badgeClass: 'bg-slate-700 text-slate-100',
  },
};

// Urgent statuses that need immediate attention
export const URGENT_STATUSES = new Set<OrderStatusValue>([
  ORDER_STATUS.UNCONFIRM,
  ORDER_STATUS.UNPAID,
]);

// Valid provider-side status transitions
export const STATUS_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue | null> = {
  UNCONFIRM: null,
  UNPAID: null,
  PAID: ORDER_STATUS.WAITING_SERVICE_DATE,
  WAITING_SERVICE_DATE: null,
  IN_SERVICE: null,
  COMPLETED: null,
  DISPUTE: null,
  CANCELLED: null,
};