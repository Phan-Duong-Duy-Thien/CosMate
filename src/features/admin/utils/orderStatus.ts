/**
 * Costume Rental Order Status UI Config
 *
 * Single source of truth for costume/rental order status rendering.
 * Used by AdminOrdersPage and any admin-side order tables.
 */
export const COSTUME_ORDER_STATUS_UI: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  UNPAID: {
    label: 'Chưa thanh toán',
    bg: '#ffe7ba',
    text: '#fa8c16',
  },
  PAID: {
    label: 'Đã thanh toán',
    bg: '#bae7ff',
    text: '#1677ff',
  },
  PREPARING: {
    label: 'Đang chuẩn bị',
    bg: '#fff7e6',
    text: '#fa8c16',
  },
  SHIPPING_OUT: {
    label: 'Đang giao hàng',
    bg: '#e6f4ff',
    text: '#1890ff',
  },
  DELIVERING_OUT: {
    label: 'Đang vận chuyển',
    bg: '#e6f7ff',
    text: '#13c2c2',
  },
  IN_USE: {
    label: 'Đang sử dụng',
    bg: '#f9f0ff',
    text: '#722ed1',
  },
  SHIPPING_BACK: {
    label: 'Đang trả hàng',
    bg: '#fff1f0',
    text: '#fa541c',
  },
  RETURNED: {
    label: 'Đã trả',
    bg: '#d9f7be',
    text: '#52c41a',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    bg: '#d9f7be',
    text: '#52c41a',
  },
  CANCELLED: {
    label: 'Đã hủy',
    bg: '#434343',
    text: '#ffffff',
  },
  DISPUTE: {
    label: 'Khiếu nại',
    bg: '#ffccc7',
    text: '#cf1322',
  },
  EXTENDING: {
    label: 'Gia hạn',
    bg: '#fff0f6',
    text: '#eb2f96',
  },
};

export function getCostumeOrderStatusProps(
  status: string
): { label: string; bg: string; text: string } {
  return (
    COSTUME_ORDER_STATUS_UI[status] ?? {
      label: status,
      bg: '#f5f5f5',
      text: '#8c8c8c',
    }
  );
}
