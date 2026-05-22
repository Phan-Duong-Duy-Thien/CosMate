export const AI_TOKEN_INSUFFICIENT_CODE = 4001;

export const AI_TOKEN_COST = {
  cosplayer: {
    searchImage: 15,
    poseScore: 20,
    styleQuiz: 30,
  },
  provider: {
    generateDescription: 20,
  },
} as const;

export type AiTokenFeature =
  | 'cosplayer.searchImage'
  | 'cosplayer.poseScore'
  | 'cosplayer.styleQuiz'
  | 'provider.generateDescription';

const COST_BY_FEATURE: Record<AiTokenFeature, number> = {
  'cosplayer.searchImage': AI_TOKEN_COST.cosplayer.searchImage,
  'cosplayer.poseScore': AI_TOKEN_COST.cosplayer.poseScore,
  'cosplayer.styleQuiz': AI_TOKEN_COST.cosplayer.styleQuiz,
  'provider.generateDescription': AI_TOKEN_COST.provider.generateDescription,
};

export function getAiTokenCost(feature: AiTokenFeature): number {
  return COST_BY_FEATURE[feature];
}

export type AiTokenFeatureLabelKey =
  | 'searchImage'
  | 'poseScore'
  | 'styleQuiz'
  | 'generateDescription';

export function getAiTokenFeatureLabelKey(feature: AiTokenFeature): AiTokenFeatureLabelKey {
  const map: Record<AiTokenFeature, AiTokenFeatureLabelKey> = {
    'cosplayer.searchImage': 'searchImage',
    'cosplayer.poseScore': 'poseScore',
    'cosplayer.styleQuiz': 'styleQuiz',
    'provider.generateDescription': 'generateDescription',
  };
  return map[feature];
}
