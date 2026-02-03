export type TagKey = "anime" | "game" | "event" | "photoshoot" | "new" | "adult18"

export type SeriesType = "anime" | "game"

export type BrandType = "brand" | "non_brand" | "tu_may" | "freestyle"

export type RentalPurpose = "test" | "fes_shoot" | "event"

export type RegionKey = "hcm" | "hn" | "dn" | "ct" | "hp"

export type SortKey =
  | "relevance"
  | "newest"
  | "bestSeller"
  | "priceAsc"
  | "priceDesc"

export type UIState = "loading" | "empty" | "error" | "success" | "notFound"

export interface DetailItem {
  label: string
  value: string
}

export interface AccessoryOption {
  id: string
  name: string
  price: number
}

export interface CostumeItem {
  id: string
  name: string
  characterName: string
  seriesName: string
  seriesType: SeriesType
  tags: TagKey[]
  rating: number
  reviewCount: number
  rentalsCount: number
  priceMin: number
  priceMax: number
  isAdult18: boolean
  isAvailable: boolean
  bestSeller: boolean
  brand: string
  brandType: BrandType
  brandName?: string
  region: RegionKey
  shopId: string
  shopName: string
  images: string[]
  videoUrl?: string
  hasAccessories: boolean
  accessoryCount?: number
  accessoryOptions: AccessoryOption[]
  createdAt: string
  description: string
  details: DetailItem[]
  rentalPurposes: RentalPurpose[]
  basePriceByPurpose: Record<RentalPurpose, number>
  deposit: number
  laundryFee: number
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
  rules: string[]
  terms: string
  policiesSummary: string
}

export interface QuoteBreakdown {
  rentalPrice: number
  accessoryTotal: number
  laundryFee: number
  deposit: number
  total: number
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
