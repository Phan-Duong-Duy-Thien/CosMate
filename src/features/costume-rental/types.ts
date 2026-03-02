export type TagKey = "anime" | "game" | "event" | "photoshoot" | "new" | "adult18"

export type SeriesType = "anime" | "game"

export type BrandType = "brand" | "non_brand" | "tu_may" | "freestyle"

export type RentalPurpose = "test" | "fes_shoot" | "event"

export type SizeKey = "xs" | "s" | "m" | "l" | "xl" | "freesize"

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
  sizeOptions: SizeKey[]
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
  surchargesTotal: number
  rentalOptionPrice: number
  deposit: number
  /** @deprecated kept for backward compat; always 0 in new flow */
  laundryFee: number
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

// â”€â”€â”€ Create Costume Wizard Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type CostumeSizeOption = "S" | "M" | "L" | "XL" | "FREESIZE"

export type RentalOptionName = "FEST" | "SHOOT" | "TEST" | "EVENT"

export interface CreateCostumeBasicPayload {
  name: string
  description: string
  size: CostumeSizeOption
  numberOfItems: number
  pricePerDay: number
  depositAmount: number
  providerId: number
  imageFiles: File[]
}

export interface SurchargeInput {
  name: string
  description: string
  price: number
}

export interface AccessoryInput {
  name: string
  description: string
  price: number
  isRequired: boolean
}

export interface RentalOptionInput {
  name: RentalOptionName
  price: number
  description: string
}

// â”€â”€â”€ Backend API Types (Provider / Costume) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Status values returned by the backend for a Costume */
export type CostumeStatus = 'AVAILABLE' | 'RENTED' | string

export interface CostumeSurcharge {
  id: number
  name: string
  description: string
  price: number
}

export interface CostumeAccessory {
  id: number
  name: string
  description: string
  price: number
  isRequired: boolean
}

export interface CostumeRentalOption {
  id: number
  name: string
  price: number
  description: string
}

/**
 * Full Costume model returned by:
 *   GET /api/costumes/provider/{providerId}  (list item)
 *   GET /api/costumes/{id}(detail)
 */
export interface Costume {
  id: number
  name: string
  description: string
  size: string
  numberOfItems: number
  pricePerDay: number
  depositAmount: number
  status: CostumeStatus
  imageUrls: string[]
  providerId: number
  surcharges: CostumeSurcharge[]
  accessories: CostumeAccessory[]
  rentalOptions: CostumeRentalOption[]
}

/**
 * Generic API response wrapper used by costume-rental feature.
 * Mirrors the shape of admin/types.ts ApiResponse without importing it.
 */
export interface CostumeApiResponse<T> {
  code: number
  message?: string
  result: T
}

// â”€â”€â”€ Edit Costume Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Fields allowed to be updated via PUT /api/costumes/{id} */
export interface UpdateCostumeBasicInput {
  name: string
  description?: string
  size: CostumeSizeOption
  numberOfItems: number
  pricePerDay: number
  depositAmount: number
  imageFiles?: File[]
}

/** Body for PUT /api/surcharges/{id} */
export interface SurchargeUpdateInput {
  name: string
  description: string
  price: number
}

/** Body for PUT /api/rental-options/{id} */
export interface RentalOptionUpdateInput {
  name: string
  price: number
  description: string
}

/** Body for PUT /api/accessories/{id} */
export interface AccessoryUpdateInput {
  name: string
  description: string
  price: number
  isRequired: boolean
}