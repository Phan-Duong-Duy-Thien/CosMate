/**
 * Staff AI token plans feature types
 */

export interface AiTokenPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  numberOfToken: number;
  isActive: boolean;
}

export interface CreateAiTokenPlanRequest {
  name: string;
  description: string;
  price: number;
  numberOfToken: number;
  isActive: boolean;
}

export type UpdateAiTokenPlanRequest = CreateAiTokenPlanRequest;

/**
 * AI token purchase from GET /api/ai-token-purchases
 */
export interface AiTokenPurchase {
  id: number;
  userId: number;
  subscriptionId: number;
  transactionId: number;
  priceAtPurchase: number;
  tokensAdded: number;
  purchaseDate: string;
  status: string;
}
