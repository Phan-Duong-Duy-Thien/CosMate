import type { BannerSlide, Shop, TagKey } from "../pages/home.types"
import bannerGameImage from "@/assets/banner game.jpg"
import bannerMarinImage from "@/assets/banner marin.jpg"

export const bannerSlides: BannerSlide[] = [
  {
    id: "slide-game",
    title: "Trang phục theo Game",
    subtitle: "Hóa thân thành nhân vật game yêu thích chỉ trong 1 click",
    actionType: "tag",
    tag: "game",
    pill: "Bộ sưu tập mới",
    ctaLabel: "⋆˙⟡ Trang phục theo game",
    imageUrl: bannerGameImage,
  },
  {
    id: "slide-marin",
    title: "Trang phục Marin",
    subtitle: "Phong cách nổi bật, dễ thương cho buổi chụp hình và sự kiện.",
    actionType: "tag",
    tag: "anime",
    pill: "Bộ sưu tập nổi bật",
    ctaLabel: "⋆˙⟡ Trang phục theo Anime",
    imageUrl: bannerMarinImage,
  },
]

export const tagList: { key: TagKey; label: string }[] = [
  { key: "anime", label: "Anime" },
  { key: "game", label: "Game" },
  { key: "event", label: "Event" },
  { key: "photoshoot", label: "Photoshoot" },
  { key: "new", label: "New" },
  { key: "adult", label: "18+" },
]

export const shops: Shop[] = [
  {
    id: "s-01",
    name: "Hana Cosplay",
    rating: 4.9,
    rentalsCount: 1200,
    topRated: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "s-02",
    name: "Moonlight Studio",
    rating: 4.8,
    rentalsCount: 980,
    topRated: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "s-03",
    name: "Hextech Wardrobe",
    rating: 4.7,
    rentalsCount: 860,
    topRated: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "s-04",
    name: "Otaku Closet",
    rating: 4.9,
    rentalsCount: 1500,
    topRated: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "s-05",
    name: "Noir Atelier",
    rating: 4.6,
    rentalsCount: 720,
    topRated: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "s-06",
    name: "Teyvat Wardrobe",
    rating: 4.8,
    rentalsCount: 1100,
    topRated: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "s-07",
    name: "Everlight",
    rating: 4.7,
    rentalsCount: 640,
    topRated: false,
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "s-08",
    name: "Velvet Club",
    rating: 4.9,
    rentalsCount: 940,
    topRated: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
]
