export type TagKey =
  | "anime"
  | "game"
  | "event"
  | "photoshoot"
  | "new"
  | "adult"

export type BannerSlideAction = "tag" | "quiz"

export interface BannerSlide {
  id: string
  title: string
  subtitle: string
  hint?: string
  actionType: BannerSlideAction
  tag?: TagKey
  pill: string
  ctaLabel: string
  imageUrl: string
}

export interface Product {
  id: number
  name: string
  pricePerDay: number
  status: string
  imageUrls: string[]
}

export interface Shop {
  id: string
  name: string
  rating: number
  rentalsCount: number
  topRated: boolean
  avatarUrl: string
}

export type UIState = "loading" | "empty" | "error" | "success"
