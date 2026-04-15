/**
 * Reviews Service
 *
 * Orchestration layer - coordinates API calls.
 * Called by hooks only; never by components or pages.
 */

import { getReviewsByCostumeId, getReviewByOrderId, type ReviewItem } from '../api/review.api'
import { getOrdersByUserId } from '@/features/order/api/order.api'
import { getUserId } from '@/features/auth/services/tokenStorage'

export async function getCostumeReviews(costumeId: number): Promise<ReviewItem[]> {
  return getReviewsByCostumeId(costumeId)
}

/**
 * Check if the current user can review a costume.
 * Returns the orderId if they can (have a completed/returned order, haven't reviewed yet),
 * or null if they cannot review.
 */
export async function checkReviewPermission(costumeId: number): Promise<{ canReview: boolean; orderId?: number }> {
  const userId = getUserId()
  if (!userId) {
    return { canReview: false }
  }

  const orders = await getOrdersByUserId(userId)

  // Find a completed/returned order for this costume
  const completedOrder = orders.find(
    (o) =>
      o.costumeId === costumeId &&
      o.orderType === 'RENT_COSTUME' &&
      (o.status === 'COMPLETED' || o.status === 'RETURNED')
  )

  if (!completedOrder) {
    return { canReview: false }
  }

  // Check if already reviewed
  const existingReview = await getReviewByOrderId(completedOrder.id)
  if (existingReview) {
    return { canReview: false }
  }

  return { canReview: true, orderId: completedOrder.id }
}