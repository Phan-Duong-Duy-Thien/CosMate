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

export interface Option {
  text: string
  scores: {
    E: number
    A: number
    O: number
  }
  metadata?: string
}

export interface CustomAnswerRequest {
  stage: 1 | 2
  questionId: string
  answer: string
}

export interface CustomAnswerScore {
  E: number
  A: number
  O: number
}

export interface SubmitQuizStaticAnswer {
  questionId: string
  scoreE: number
  scoreA: number
  scoreO: number
}

export interface SubmitQuizCustomAnswer {
  questionId: string
  questionContext: string
  userAnswer: string
}

export interface SubmitQuizPayload {
  staticAnswers: SubmitQuizStaticAnswer[]
  customAnswers: SubmitQuizCustomAnswer[]
}

export interface SubmitQuizResponse {
  archetypeId: string
  subTypeId?: string
}

export interface Stage1Question {
  question_id: string
  question: string
  options: Option[]
}

export interface Stage2Question {
  question_id?: string
  question: string
  options: Option[]
}

export interface ArchetypeProfile {
  id: string
  name: string
  coreDesire: string
  clothing_style: string
  color_palette: string[]
  famousCharacters: string[]
}
