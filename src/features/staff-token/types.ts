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
