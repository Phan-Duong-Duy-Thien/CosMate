import { getOrderById, getOrders } from '@/features/admin/api/adminOrders.api';

export async function getStaffOrders() {
  const data = await getOrders(1, 9999);
  return data.content ?? [];
}

export async function getStaffOrderById(id: number) {
  return getOrderById(id);
}
