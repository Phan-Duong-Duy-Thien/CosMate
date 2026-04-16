export interface PoseScoringBreakdown {
  pose: number
  expression: number
  costume: number
}

export interface PoseScoringResult {
  id: number
  score: number
  comment: string
  characterName?: string
  imageUrl?: string
  breakdown?: PoseScoringBreakdown
}

export interface PoseHistoryItem {
  id: number
  cosplayerId: number | null
  characterName?: string
  imageUrl: string
  score: number
  createdAt: string
  comment: string
  breakdown?: PoseScoringBreakdown
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
