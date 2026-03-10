/**
 * Provider Service
 * Business logic layer for provider operations
 */
import { getReviewsByProvider, type ProviderReview } from '../api/provider.api';

/**
 * Fetch provider reviews
 */
export async function fetchProviderReviews(providerId: number): Promise<ProviderReview[]> {
  return getReviewsByProvider(providerId);
}
