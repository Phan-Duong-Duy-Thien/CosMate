/**
 * Giá tối thiểu dịch vụ = giá mỗi slot + tiền cọc + khấu hao thiết bị.
 */
export function toPriceNumber(val: unknown): number {
  if (val == null || val === '') return 0;
  const n = Number(String(val).replace(/,/g, ''));
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export function computeServiceMinPrice(
  pricePerSlot: unknown,
  equipmentDepreciationCost: unknown,
  depositAmount: unknown,
): number {
  return (
    toPriceNumber(pricePerSlot) +
    toPriceNumber(equipmentDepreciationCost) +
    toPriceNumber(depositAmount)
  );
}
