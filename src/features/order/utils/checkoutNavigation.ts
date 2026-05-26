/**
 * Shared checkout flow URLs and helpers (breadcrumb + resume state).
 */
import type { BreadcrumbItem } from '@/shared/components/Breadcrumbs';
import { VI } from '@/shared/i18n/vi';
import { loadDraft } from './rentalDraftStorage';

export const CHECKOUT_PATH = '/rent/checkout';

export function getCostumeDetailPath(costumeId: number): string {
  return `/costumes/${costumeId}`;
}

/**
 * Breadcrumb trail for checkout and sub-flows (address, wallet top-up).
 * Middle crumb links to costume detail when draft has costumeId — not the list page.
 */
export function buildCheckoutFlowBreadcrumbs(tail?: BreadcrumbItem[]): BreadcrumbItem[] {
  const draft = loadDraft();
  const items: BreadcrumbItem[] = [
    { label: VI.common.breadcrumb.home, to: '/' },
  ];

  if (draft?.costumeId) {
    items.push({
      label: draft.costumeName ?? VI.common.breadcrumb.costumeDetail,
      to: getCostumeDetailPath(draft.costumeId),
    });
  } else {
    items.push({ label: VI.common.breadcrumb.costumes, to: '/costumes' });
  }

  if (!tail?.length) {
    items.push({ label: VI.common.breadcrumb.checkout });
    return items;
  }

  items.push({ label: VI.common.breadcrumb.checkout, to: CHECKOUT_PATH });
  return [...items, ...tail];
}

export function isCheckoutReturnPath(path: string | null | undefined): boolean {
  if (!path) return false;
  const normalized = path.split('?')[0];
  return normalized === CHECKOUT_PATH;
}

/** True when user entered a sub-flow from checkout (address, wallet top-up). */
export function isFromCheckoutFlow(search: string): boolean {
  const params = new URLSearchParams(search);
  if (params.get('from') === 'checkout') return true;
  const returnTo = params.get('returnTo') || params.get('redirect');
  return isCheckoutReturnPath(returnTo);
}

export function buildAddressCreateFromCheckoutUrl(): string {
  const q = new URLSearchParams({
    returnTo: CHECKOUT_PATH,
    from: 'checkout',
  });
  return `/profile/addresses/new?${q.toString()}`;
}

export function buildWalletTopUpFromCheckoutUrl(): string {
  const q = new URLSearchParams({
    redirect: CHECKOUT_PATH,
    from: 'checkout',
  });
  return `/profile/wallet/topup?${q.toString()}`;
}
