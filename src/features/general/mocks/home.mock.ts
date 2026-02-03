import type { BannerSlide, Product, Shop, TagKey } from "../pages/home.types"

export const bannerSlides: BannerSlide[] = [
  {
    id: "slide-game",
    title: "Trang phục theo Game",
    subtitle: "Hóa thân thành nhân vật game yêu thích chỉ trong 1 click",
    actionType: "tag",
    tag: "game",
    pill: "Bộ sưu tập mới",
    ctaLabel: "Xem ngay",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "slide-anime",
    title: "Trang phục theo Anime",
    subtitle: "Khám phá bộ sưu tập cosplay anime mới nhất",
    actionType: "tag",
    tag: "anime",
    pill: "Bộ sưu tập mới",
    ctaLabel: "Xem ngay",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "slide-quiz",
    title: "Bạn hợp cosplay nhân vật nào nhất?",
    subtitle: "Trả lời 5 câu hỏi nhanh để khám phá vibe nhân vật phù hợp với bạn.",
    hint: "⏱ Mất ~1 phút • Gợi ý trang phục & shop phù hợp",
    actionType: "quiz",
    pill: "Quiz nhanh",
    ctaLabel: "Làm quiz ngay",
    imageUrl:
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1400&q=80",
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

export const products: Product[] = [
  {
    id: "p-01",
    name: "Set Nezuko Kimono Pastel",
    shopName: "Hana Cosplay",
    tags: ["anime", "new"],
    isAdult: false,
    rating: 4.9,
    priceMin: 250,
    priceMax: 400,
    imageUrl:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-02",
    name: "Mikasa Scout Uniform",
    shopName: "Otaku Closet",
    tags: ["anime", "event"],
    isAdult: false,
    rating: 4.8,
    priceMin: 280,
    priceMax: 420,
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-03",
    name: "Ahri K/DA Spark",
    shopName: "Kitsune Rent",
    tags: ["game", "photoshoot"],
    isAdult: false,
    rating: 4.7,
    priceMin: 320,
    priceMax: 520,
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-04",
    name: "Jinx Street Neon",
    shopName: "Hextech Wardrobe",
    tags: ["game", "new"],
    isAdult: false,
    rating: 4.9,
    priceMin: 300,
    priceMax: 550,
    imageUrl:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-05",
    name: "Sailor Moon Classic",
    shopName: "Moonlight Studio",
    tags: ["anime", "event"],
    isAdult: false,
    rating: 4.6,
    priceMin: 220,
    priceMax: 360,
    imageUrl:
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-06",
    name: "Cyber Maid Noir 18+",
    shopName: "Noir Atelier",
    tags: ["adult", "photoshoot"],
    isAdult: true,
    rating: 4.8,
    priceMin: 380,
    priceMax: 620,
    imageUrl:
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-07",
    name: "Genshin Lumine Breeze",
    shopName: "Teyvat Wardrobe",
    tags: ["game", "event"],
    isAdult: false,
    rating: 4.9,
    priceMin: 260,
    priceMax: 410,
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-08",
    name: "Kimetsu Tanjiro Set",
    shopName: "Hashira House",
    tags: ["anime", "photoshoot"],
    isAdult: false,
    rating: 4.7,
    priceMin: 240,
    priceMax: 390,
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-09",
    name: "Violet Evergarden Dress",
    shopName: "Everlight",
    tags: ["anime", "new"],
    isAdult: false,
    rating: 4.9,
    priceMin: 330,
    priceMax: 520,
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-10",
    name: "Yennefer Mystic 18+",
    shopName: "Witcher Wardrobe",
    tags: ["game", "adult"],
    isAdult: true,
    rating: 4.6,
    priceMin: 350,
    priceMax: 600,
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-11",
    name: "Makima Office Chic",
    shopName: "Chainsaw Studio",
    tags: ["anime", "event"],
    isAdult: false,
    rating: 4.8,
    priceMin: 270,
    priceMax: 430,
    imageUrl:
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "p-12",
    name: "Persona Velvet Dress",
    shopName: "Velvet Club",
    tags: ["game", "photoshoot"],
    isAdult: false,
    rating: 4.7,
    priceMin: 300,
    priceMax: 480,
    imageUrl:
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=900&q=80",
  },
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
