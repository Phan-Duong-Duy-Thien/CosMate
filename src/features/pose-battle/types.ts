export interface PoseScoringResult {
  score: number
  comment: string
}

export interface PoseReferenceItem {
  id: string
  characterName: string
  imageUrl: string
}

export interface PoseBattleApiResponse<T> {
  code: number
  message?: string
  result: T
}
