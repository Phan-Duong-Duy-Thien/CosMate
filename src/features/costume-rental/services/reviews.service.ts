/**
 * Reviews Service
 *
 * Orchestration layer - coordinates API calls.
 * Called by hooks only; never by components or pages.
 */

import { getReviewsByCostumeId, type ReviewItem } from '../api/review.api'

export async function getCostumeReviews(costumeId: number): Promise<ReviewItem[]> {
  return getReviewsByCostumeId(costumeId)
}