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

// ============ USER ADDRESS TYPES ============

export interface UserAddress {
  id: number
  userId: number
  name: string
  city: string
  district: string
  address: string
  phone: string
}

export interface UpsertUserAddressPayload {
  name: string
  city: string
  district: string
  address: string
  phone: string
  addressName: string
}

export type CreateUserAddressPayload = UpsertUserAddressPayload

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

// ============ WALLET TYPES ============

export interface WalletInfo {
  walletId: number
  userId: number
  balance: number
  depositBalance: number
}

export interface WalletTransaction {
  id: number
  amount: number
  type: string
  status: string
  createdAt: string
}

// ============ AI TOKEN PLANS ============

export interface AiTokenPlan {
  id: number
  name: string
  description: string
  price: number
  numberOfToken: number
  isActive: boolean
}

export type TokenPaymentMethod = "VNPAY" | "MOMO"

export interface InitiateAiTokenPurchaseParams {
  planId: number
  paymentMethod: TokenPaymentMethod
  returnUrl: string
  isMobile?: boolean
}

export interface AiTokenPurchase {
  id: number
  userId: number
  subscriptionId: number
  transactionId: number
  priceAtPurchase: number
  tokensAdded: number
  purchaseDate: string
  status: string
}