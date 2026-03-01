// Feature types for profile (mock-only phase)

export type GallerySpanPreset = "small" | "wide" | "tall" | "large"

export interface MockProfile {
  name: string
  username: string
  bio: string
  avatarUrl: string
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

// ============ USER ADDRESS TYPES ============

export interface UserAddress {
  id?: number
  name: string
  city: string
  district: string
  address: string
  phone: string
}

export interface CreateUserAddressPayload {
  name: string
  city: string
  district: string
  address: string
  phone: string
}

// ============ VIETNAM LOCATION TYPES ============

export interface Province {
  code: number
  name: string
}

export interface District {
  code: number
  name: string
}

export interface Ward {
  code: number
  name: string
}
