export interface QuizOption {
  id: string
  label: string
  value: string
  emoji?: string
}

export interface QuizQuestion {
  id: string
  key: "favoriteColor" | "style" | "hobby" | "budgetRange" | "gender"
  question: string
  options: QuizOption[]
}

export interface StyleQuizAnswers {
  favoriteColor: string
  style: string
  hobby: string
  budgetRange: string
  gender: string
}

export interface RecommendResponseItem {
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
