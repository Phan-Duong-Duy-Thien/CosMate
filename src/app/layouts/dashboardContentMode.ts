/**
 * Dashboard content area layout modes.
 * - scroll: form/list pages — content height follows children, area scrolls
 * - fill: full-height panels (e.g. chat) — children stretch to viewport
 */
export type DashboardContentMode = 'scroll' | 'fill';

const FILL_PATH_SEGMENTS = ['/messages'] as const;

export function resolveDashboardContentMode(
  pathname: string,
  override?: DashboardContentMode,
): DashboardContentMode {
  if (override) return override;
  if (FILL_PATH_SEGMENTS.some((segment) => pathname.includes(segment))) {
    return 'fill';
  }
  return 'scroll';
}
