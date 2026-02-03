// Feature-specific types for profile (UI-only phase; extend when API is added)
export type ProfileView = 'overview'

export interface GalleryItem {
  id: string
  url: string
  photographer: string
}
