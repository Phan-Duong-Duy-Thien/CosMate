import type { ServiceOrder, ServiceOrderBooking } from '../api/booking.api';
import { computeServiceBookingTotal, toPriceNumber, type ServiceBookingPriceParts } from './computeServiceMinPrice';

export type ServicePackageFees = {
  depositAmount: number;
  equipmentDepreciationCost: number;
};

type RawRecord = Record<string, unknown>;

function readNumber(...values: unknown[]): number {
  for (const value of values) {
    if (value == null || value === '') continue;
    const n = Number(value);
    if (Number.isFinite(n)) return Math.max(0, n);
  }
  return 0;
}

function normalizeBooking(raw: RawRecord): ServiceOrderBooking {
  return {
    id: readNumber(raw.id),
    serviceId: readNumber(raw.serviceId, raw.service_id),
    bookingDate: String(raw.bookingDate ?? raw.booking_date ?? ''),
    timeSlot: String(raw.timeSlot ?? raw.time_slot ?? ''),
    numberOfHuman: readNumber(raw.numberOfHuman, raw.number_of_human, 1) || 1,
    rentSlotAmount: readNumber(raw.rentSlotAmount, raw.rent_slot_amount),
    depositSlotAmount: readNumber(
      raw.depositSlotAmount,
      raw.deposit_slot_amount,
      raw.depositAmount,
      raw.deposit_amount,
    ),
    equipmentDepreciationSlotAmount: readNumber(
      raw.equipmentDepreciationSlotAmount,
      raw.equipment_depreciation_slot_amount,
      raw.equipmentDepreciationAmount,
      raw.equipment_depreciation_amount,
      raw.equipmentDepreciationCost,
      raw.equipment_depreciation_cost,
    ),
  };
}

/** Map BE aliases → canonical ServiceOrder (list/detail). */
export function normalizeServiceOrder(raw: RawRecord): ServiceOrder {
  const bookingsRaw = (raw.bookings ?? raw.bookingList ?? []) as RawRecord[];
  const bookings = Array.isArray(bookingsRaw)
    ? bookingsRaw.map((b) => normalizeBooking(b))
    : [];

  return {
    id: readNumber(raw.id),
    cosplayerId: readNumber(raw.cosplayerId, raw.cosplayer_id),
    cosplayerName:
      raw.cosplayerName != null
        ? String(raw.cosplayerName)
        : raw.cosplayer_name != null
          ? String(raw.cosplayer_name)
          : undefined,
    providerId: readNumber(raw.providerId, raw.provider_id),
    orderType: String(raw.orderType ?? raw.order_type ?? ''),
    status: String(raw.status ?? ''),
    totalAmount: readNumber(raw.totalAmount, raw.total_amount),
    totalDepositAmount: readNumber(
      raw.totalDepositAmount,
      raw.total_deposit_amount,
      raw.depositAmount,
      raw.deposit_amount,
    ),
    totalEquipmentDepreciationAmount: readNumber(
      raw.totalEquipmentDepreciationAmount,
      raw.total_equipment_depreciation_amount,
      raw.equipmentDepreciationAmount,
      raw.equipment_depreciation_amount,
      raw.equipmentDepreciationCost,
      raw.equipment_depreciation_cost,
    ),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
    bookings,
  };
}

function packageFeesForOrder(
  order: ServiceOrder,
  serviceFeesById?: Map<number, ServicePackageFees>,
): ServicePackageFees {
  const firstServiceId = order.bookings[0]?.serviceId;
  if (firstServiceId && serviceFeesById?.has(firstServiceId)) {
    return serviceFeesById.get(firstServiceId)!;
  }
  return { depositAmount: 0, equipmentDepreciationCost: 0 };
}

function resolveDepositAndEquipment(
  order: ServiceOrder,
  serviceFeesById?: Map<number, ServicePackageFees>,
): { deposit: number; equipment: number } {
  const pkg = packageFeesForOrder(order, serviceFeesById);

  let deposit = toPriceNumber(order.totalDepositAmount);
  let equipment = toPriceNumber(order.totalEquipmentDepreciationAmount);

  const bookingDepositSum = order.bookings.reduce(
    (s, b) => s + toPriceNumber(b.depositSlotAmount),
    0,
  );
  const bookingEquipmentSum = order.bookings.reduce(
    (s, b) => s + toPriceNumber(b.equipmentDepreciationSlotAmount),
    0,
  );

  if (bookingDepositSum > 0) deposit = bookingDepositSum;
  if (bookingEquipmentSum > 0) equipment = bookingEquipmentSum;

  if (deposit === 0) deposit = toPriceNumber(pkg.depositAmount);
  if (equipment === 0) equipment = toPriceNumber(pkg.equipmentDepreciationCost);

  return { deposit, equipment };
}

/**
 * Tổng khách phải trả.
 * - `totalAmount` từ BE là nguồn gốc.
 * - Nếu BE thiếu phí khấu hao (hoặc tách dòng chưa đủ), cộng thêm từ booking / gói dịch vụ.
 */
export function resolveServiceOrderPayableTotal(
  order: ServiceOrder,
  serviceFeesById?: Map<number, ServicePackageFees>,
): number {
  const beTotal = toPriceNumber(order.totalAmount);
  const rentSum = order.bookings.reduce((s, b) => s + toPriceNumber(b.rentSlotAmount), 0);
  const { deposit, equipment } = resolveDepositAndEquipment(order, serviceFeesById);

  if (rentSum <= 0) {
    return beTotal;
  }

  const partsTotal = rentSum + deposit + equipment;

  if (Math.abs(beTotal - rentSum) < 1) {
    return partsTotal;
  }

  const withDeposit = rentSum + deposit;
  if (equipment > 0 && Math.abs(beTotal - withDeposit) < 1) {
    return beTotal + equipment;
  }

  if (partsTotal > beTotal) {
    return partsTotal;
  }

  return beTotal;
}

export function buildServiceOrderPriceBreakdown(
  order: ServiceOrder,
  serviceFeesById?: Map<number, ServicePackageFees>,
): ServiceBookingPriceParts {
  const rentSum = order.bookings.reduce((s, b) => s + toPriceNumber(b.rentSlotAmount), 0);
  const serviceFee = rentSum > 0 ? rentSum : toPriceNumber(order.totalAmount);
  const { deposit, equipment } = resolveDepositAndEquipment(order, serviceFeesById);

  return {
    serviceFee,
    deposit,
    equipment,
    total: resolveServiceOrderPayableTotal(order, serviceFeesById),
  };
}

export function getServiceOrderDisplayTotal(order: ServiceOrder): number {
  return order.payableTotalAmount ?? order.totalAmount;
}
