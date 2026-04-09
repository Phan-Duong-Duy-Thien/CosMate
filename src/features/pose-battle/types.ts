export interface PoseScoringResult {
  id: number
  score: number
  comment: string
  characterName?: string
  imageUrl?: string
}

export interface PoseHistoryItem {
  id: number
  cosplayerId: number | null
  characterName?: string
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
