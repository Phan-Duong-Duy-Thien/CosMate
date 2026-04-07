export interface PoseScoringResult {
  score: number
  comment: string
}

export interface PoseHistoryItem {
  id: number
  cosplayerId: number | null
  imageUrl: string
  score: number
  createdAt: string
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
