/**
 * Admin providers — business-facing entry points for provider list & verify actions.
 */

import * as api from '../api/adminProviders.api';

export interface AdminProviderRow {
  id: number;
  userId?: number;
  shopName?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  verified?: boolean;
  completedOrders?: number;
  totalRating?: number;
  totalReviews?: number;
}

export async function getAdminProvidersPage(
  page: number,
  pageSize: number,
  options: { search?: string; verified?: boolean | null }
): Promise<{ content: AdminProviderRow[]; totalElements: number }> {
  return api.getProviders(page, pageSize, {
    search: options.search,
    verified: options.verified,
  });
}

export async function setProviderVerified(providerId: number, verified: boolean): Promise<void> {
  await api.verifyProvider(providerId, verified);
}
