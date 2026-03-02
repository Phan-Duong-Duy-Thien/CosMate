// Feature types for profile (mock-only phase)

export type GallerySpanPreset = "small" | "wide" | "tall" | "large"

export interface MockProfile {
  name: string
  username: string
  bio: string
  avatarUrl?: string | null
  email?: string
  phone?: string
  status?: string
  stats: { bookings: number; rating: number }
  location: string
  social: { instagram?: string }
  tags: string[]
}

export interface MockGalleryItem {
  id: string
  imageUrl: string
  title?: string
  spanPreset: GallerySpanPreset
  createdAt?: string
}

export interface MockConcept {
  id: string
  title: string
  count: number
  color: string
}

export interface MockReview {
  id: string
  rating: number
  comment: string
  author?: string
}

export type ProfileTabId = "gallery" | "concepts" | "reviews"

export type SortOption = "latest" | "popular"

export interface UpdateUserProfilePayload {
  fullName: string
  phone: string
}
