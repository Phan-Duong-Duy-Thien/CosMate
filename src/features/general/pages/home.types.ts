export type TagKey =
  | "anime"
  | "game"
  | "event"
  | "photoshoot"
  | "new"
  | "adult"

export interface BannerSlide {
  id: string
  title: string
  subtitle: string
  tag: TagKey
  pill: string
  ctaLabel: string
  imageUrl: string
}

export interface Product {
  id: string
  name: string
  shopName: string
  tags: TagKey[]
  isAdult: boolean
  rating: number
  priceMin: number
  priceMax: number
  imageUrl: string
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
