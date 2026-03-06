export interface MockReviewPermission {
  canReview: boolean
  orderId?: number
}

// Mock flag for testing - set to true to allow review submission
const MOCK_ALLOW_REVIEW = true

export function getMockReviewPermission(
  costumeId: number,
  currentUserId?: number
): MockReviewPermission {
  // For now, return canReview true for deterministic testing
  // In production, this would check if user has a completed order for this costume
  if (!currentUserId) {
    return { canReview: false }
  }

  if (!MOCK_ALLOW_REVIEW) {
    return { canReview: false }
  }

  // Mock: user can review if they have a completed order
  return {
    canReview: true,
    orderId: 12345, // Mock order ID
  }
}
