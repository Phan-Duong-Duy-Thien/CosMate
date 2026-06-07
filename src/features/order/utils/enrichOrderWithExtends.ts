import { getOrderExtends } from '../api/order.api';
import type { OrderItem, OrderDetail, OrderStatus } from '../types';

/**
 * Enrich a single OrderItem with the sum of its PAID rental extensions.
 * Calculates and updates rentEnd and rentDay based on extension history.
 */
export async function enrichOrderWithExtends(order: OrderItem): Promise<OrderItem> {
  const eligibleStatuses: OrderStatus[] = [
    'IN_USE',
    'OVERDUE',
    'SHIPPING_BACK',
    'RETURNED',
    'COMPLETED',
    'DISPUTE',
  ];
  
  if (!eligibleStatuses.includes(order.status)) {
    return order;
  }
  
  try {
    const extendsList = await getOrderExtends(order.id);
    const paidExtends = extendsList.filter((ext) => ext.paymentStatus === 'PAID');
    if (paidExtends.length === 0) {
      return order;
    }
    
    const totalExtendDays = paidExtends.reduce((sum, ext) => sum + ext.extendDays, 0);
    if (totalExtendDays > 0) {
      const originalEnd = new Date(order.rentEnd);
      if (!isNaN(originalEnd.getTime())) {
        const newEnd = new Date(originalEnd);
        newEnd.setDate(newEnd.getDate() + totalExtendDays);
        
        const isIsoWithT = order.rentEnd.includes('T');
        const year = newEnd.getFullYear();
        const month = String(newEnd.getMonth() + 1).padStart(2, '0');
        const day = String(newEnd.getDate()).padStart(2, '0');
        const datePart = `${year}-${month}-${day}`;
        let formattedNewEnd = datePart;
        
        if (isIsoWithT) {
          const timePart = order.rentEnd.split('T')[1] || '00:00:00';
          formattedNewEnd = `${datePart}T${timePart}`;
        }
        
        return {
          ...order,
          rentDay: order.rentDay + totalExtendDays,
          rentEnd: formattedNewEnd,
        };
      }
    }
  } catch (err) {
    console.error(`Failed to enrich order ${order.id} with extends:`, err);
  }
  
  return order;
}

/**
 * Enrich an array of OrderItem elements with their PAID rental extensions.
 */
export async function enrichOrdersWithExtends(orders: OrderItem[]): Promise<OrderItem[]> {
  return Promise.all(orders.map(enrichOrderWithExtends));
}

/**
 * Enrich an OrderDetail object (used in detail drawer) with the sum of its PAID rental extensions.
 */
export async function enrichOrderDetailWithExtends(order: OrderDetail): Promise<OrderDetail> {
  const eligibleStatuses: OrderStatus[] = [
    'IN_USE',
    'OVERDUE',
    'SHIPPING_BACK',
    'RETURNED',
    'COMPLETED',
    'DISPUTE',
  ];
  
  if (!eligibleStatuses.includes(order.status) || !order.details || order.details.length === 0) {
    return order;
  }
  
  try {
    const extendsList = await getOrderExtends(order.id);
    const paidExtends = extendsList.filter((ext) => ext.paymentStatus === 'PAID');
    if (paidExtends.length === 0) {
      return order;
    }
    
    const totalExtendDays = paidExtends.reduce((sum, ext) => sum + ext.extendDays, 0);
    if (totalExtendDays > 0) {
      const firstDetail = order.details[0];
      const originalEnd = new Date(firstDetail.rentEnd);
      if (!isNaN(originalEnd.getTime())) {
        const newEnd = new Date(originalEnd);
        newEnd.setDate(newEnd.getDate() + totalExtendDays);
        
        const isIsoWithT = firstDetail.rentEnd.includes('T');
        const year = newEnd.getFullYear();
        const month = String(newEnd.getMonth() + 1).padStart(2, '0');
        const day = String(newEnd.getDate()).padStart(2, '0');
        const datePart = `${year}-${month}-${day}`;
        let formattedNewEnd = datePart;
        
        if (isIsoWithT) {
          const timePart = firstDetail.rentEnd.split('T')[1] || '00:00:00';
          formattedNewEnd = `${datePart}T${timePart}`;
        }
        
        const updatedDetails = [...order.details];
        updatedDetails[0] = {
          ...firstDetail,
          rentDay: firstDetail.rentDay + totalExtendDays,
          rentEnd: formattedNewEnd,
        };
        
        return {
          ...order,
          details: updatedDetails,
        };
      }
    }
  } catch (err) {
    console.error(`Failed to enrich order detail ${order.id} with extends:`, err);
  }
  
  return order;
}
