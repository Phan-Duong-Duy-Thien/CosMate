/**
 * Stable internal location code: VN-{provinceCode}-{wardCode}
 */
export function buildInternalLocCode(provinceCode: number, wardCode: number): string {
  return `VN-${provinceCode}-${wardCode}`;
}
