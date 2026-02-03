export type TagKey = "anime" | "game" | "event" | "photoshoot" | "new" | "adult18"

export type SeriesType = "anime" | "game"

export type RegionKey = "hcm" | "hn" | "dn" | "ct" | "hp"

export type SortKey =
  | "relevance"
  | "newest"
  | "bestSeller"
  | "priceAsc"
  | "priceDesc"

export type UIState = "loading" | "empty" | "error" | "success"

export interface CostumeItem {
  id: string
  name: string
  characterName: string
  seriesName: string
  seriesType: SeriesType
  tags: TagKey[]
  rating: number
  priceMin: number
  priceMax: number
  isAdult18: boolean
  isAvailable: boolean
  bestSeller: boolean
  brand: string
  region: RegionKey
  shopId: string
  shopName: string
  images: string[]
  hasAccessories: boolean
  accessoryCount?: number
  createdAt: string
}

export interface Shop {
  id: string
  name: string
  avatarUrl: string
  rating: number
  totalRentals: number
  followers: number
  responseRate: number
  responseTimeText: string
  region: RegionKey
}

export interface FilterState {
  keyword: string
  regionKeys: RegionKey[]
  brandKeys: string[]
  minRating: number | null
  priceMin: number | null
  priceMax: number | null
  tagKeys: TagKey[]
  hasAccessories: boolean
  onlyAvailable: boolean
  onlyBestSeller: boolean
}
