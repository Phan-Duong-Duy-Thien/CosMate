export interface SearchResponseItem {
  costumeId: number
  costumeName: string
  imageUrl: string
  price: number
  similarityScore: number
}

export interface ApiResponse<T> {
  code: number
  message?: string
  result: T
}

export interface RecommendationRequestPayload {
  archetypeId: string
  subTypeId: string
  budgetMetadata: string
}

export interface Stage1Option {
  text: string
  points_to?: string[]
  metadata?: string
}

export interface Stage1Question {
  question_id: string
  question: string
  options: Stage1Option[]
}

export interface Stage2Option {
  text: string
  points_to_subtype: string
}

export interface Stage2Question {
  question: string
  options: Stage2Option[]
}

export interface StageAnswers {
  archetypeId: string
  subTypeId: string
  budgetMetadata: string
}
