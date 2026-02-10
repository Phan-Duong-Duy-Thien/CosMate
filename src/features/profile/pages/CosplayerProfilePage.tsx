import * as React from "react"
import { useNavigate } from "react-router-dom"
import { clearAuth } from "@/features/auth/services/tokenStorage"
import { ProfileSidebarCard } from "../components/ProfileSidebarCard"
import { ProfileActions } from "../components/ProfileActions"
import { EditProfileModal } from "../components/EditProfileModal"
import { LogoutConfirmDialog } from "../components/LogoutConfirmDialog"
import { ProfileTabs } from "../components/ProfileTabs"
import { GalleryGrid } from "../components/GalleryGrid"
import { SortDropdown } from "../components/SortDropdown"
import type {
  MockProfile,
  MockGalleryItem,
  MockConcept,
  MockReview,
  ProfileTabId,
  SortOption,
} from "../types"
import { Sparkles } from "lucide-react"

// TODO: Replace with PATCH /api/cosplayers/me when backend is ready.
// TODO: Replace with POST /api/auth/logout when backend is ready.

const INITIAL_MOCK_PROFILE: MockProfile = {
  name: "Miku Lan Anh",
  username: "@mikulan",
  bio: "Genshin Impact & Honkai Star Rail main. Love fantasy settings and ethereal lighting. 5+ years of craft experience.",
  avatarUrl:
    "https://images.unsplash.com/photo-1726643939988-22f4e42c4f1f?auto=format&fit=crop&q=80&w=300",
  stats: { bookings: 24, rating: 5.0 },
  location: "Hanoi, Vietnam",
  social: { instagram: "mikulan_cos" },
  tags: ["Genshin", "DarkFantasy", "CuteStyle", "Crafting", "WigStyling"],
}

const mockGalleryItems: MockGalleryItem[] = [
  {
    id: "g1",
    imageUrl:
      "https://images.unsplash.com/photo-1661347999669-e935ec73f76b?auto=format&fit=crop&q=80&w=800",
    title: "Shoot 1",
    spanPreset: "large",
    createdAt: "2024-01-15",
  },
  {
    id: "g2",
    imageUrl:
      "https://images.unsplash.com/photo-1663035046956-8198fd1c01fd?auto=format&fit=crop&q=80&w=800",
    title: "Shoot 2",
    spanPreset: "tall",
    createdAt: "2024-01-14",
  },
  {
    id: "g3",
    imageUrl:
      "https://images.unsplash.com/photo-1617791160505-6f00527e70d3?auto=format&fit=crop&q=80&w=800",
    title: "Shoot 3",
    spanPreset: "wide",
    createdAt: "2024-01-13",
  },
  {
    id: "g4",
    imageUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
    title: "Shoot 4",
    spanPreset: "small",
    createdAt: "2024-01-12",
  },
  {
    id: "g5",
    imageUrl:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=800",
    title: "Shoot 5",
    spanPreset: "small",
    createdAt: "2024-01-11",
  },
  {
    id: "g6",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    title: "Shoot 6",
    spanPreset: "tall",
    createdAt: "2024-01-10",
  },
]

const mockConcepts: MockConcept[] = [
  { id: "c1", title: "Cyberpunk Tokyo", count: 12, color: "#E0D7FF" },
  { id: "c2", title: "Fantasy Forest", count: 8, color: "#FFD7E5" },
  { id: "c3", title: "Gothic Lolita", count: 5, color: "#D7FFE0" },
]

const mockReviews: MockReview[] = [
  {
    id: "r1",
    rating: 5,
    comment:
      "Amazing attention to detail and very professional. Will book again!",
    author: "Photographer A",
  },
  {
    id: "r2",
    rating: 5,
    comment: "Perfect wig styling and costume accuracy. Highly recommend.",
    author: "Studio Prism",
  },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
]

export default function CosplayerProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = React.useState<MockProfile>(INITIAL_MOCK_PROFILE)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<ProfileTabId>("gallery")
  const [sort, setSort] = React.useState<SortOption>("latest")

  const sortedGalleryItems = React.useMemo(() => {
    const list = [...mockGalleryItems]
    if (sort === "latest") {
      list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
    }
    // popular: deterministic reorder (e.g. by id) when no likes field
    if (sort === "popular") {
      list.sort((a, b) => a.id.localeCompare(b.id))
    }
    return list
  }, [sort])

  const handleLogout = () => {
    clearAuth()
    navigate("/login")
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <ProfileSidebarCard
          profile={profile}
          actions={
            <ProfileActions
              onEditProfile={() => setIsEditOpen(true)}
              onLogout={() => setIsLogoutOpen(true)}
            />
          }
        />
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Past Shoots
                </h2>
                <SortDropdown
                  value={sort}
                  options={SORT_OPTIONS}
                  onChange={setSort}
                />
              </div>
              <GalleryGrid
                items={sortedGalleryItems}
                emptyMessage="No past shoots yet."
              />
            </div>
          )}
          {activeTab === "concepts" && (
            <div className="space-y-4">
              <h2 className="px-2 text-xl font-bold text-slate-800">
                Favorite Concepts
              </h2>
              {mockConcepts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center text-sm text-slate-500">
                  No favorite concepts yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mockConcepts.map((concept) => (
                    <div
                      key={concept.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                    >
                      <div
                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-slate-700"
                        style={{ backgroundColor: concept.color }}
                      >
                        {concept.count}
                      </div>
                      <h3 className="font-semibold text-slate-800">
                        {concept.title}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <h2 className="px-2 text-xl font-bold text-slate-800">Reviews</h2>
              {mockReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center text-sm text-slate-500">
                  No reviews yet.
                </div>
              ) : (
                <ul className="space-y-4">
                  {mockReviews.map((review) => (
                    <li
                      key={review.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className="mb-2 text-sm font-semibold text-amber-600">
                        {"★".repeat(review.rating)} ({review.rating}.0)
                      </div>
                      <p className="text-slate-700">{review.comment}</p>
                      {review.author && (
                        <p className="mt-2 text-xs text-slate-500">
                          — {review.author}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </ProfileTabs>
      </div>

      <EditProfileModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialProfile={profile}
        onSave={setProfile}
      />
      <LogoutConfirmDialog
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        onConfirm={handleLogout}
      />
    </div>
  )
}
