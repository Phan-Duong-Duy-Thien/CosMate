import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserProfile } from "../hooks/useUserProfile"
import { useUserAddresses } from "../hooks/useUserAddresses"
import { usePurchaseOrders } from "../hooks/usePurchaseOrders"
import { useWallet } from "../hooks/useWallet"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { VI } from "@/shared/i18n/vi"
import EditProfileModal from "../components/EditProfileModal"
import { AddressModal } from "../components/AddressModal"
import { ProfileCover } from "../components/ProfileCover"
import { ProfileBioCard } from "../components/ProfileBioCard"
import { ImageCropDialog } from "../components/ImageCropDialog"
import { CheckCheck, PackageCheck, Star, Truck } from "lucide-react"
import { message } from "antd"

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-700",
  banned: "bg-rose-100 text-rose-700",
  default: "bg-purple-100 text-purple-700",
}

export default function CosplayerProfilePage() {
  const navigate = useNavigate()
  const { profile, displayName, handle, initials, statusTone, loading, error, setProfile, userId } =
    useUserProfile()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false)
  const [isCoverPreviewOpen, setIsCoverPreviewOpen] = useState(false)
  const [isCoverCropOpen, setIsCoverCropOpen] = useState(false)
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [isPageVisible, setIsPageVisible] = useState(false)
  const [showAllAddresses, setShowAllAddresses] = useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const { addresses, isLoading: addressesLoading, error: addressesError } =
    useUserAddresses(userId)
  const { counts } = usePurchaseOrders("all")
  const { walletInfo } = useWallet()

  const displayedAddresses = showAllAddresses ? addresses : addresses.slice(0, 1)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  // Map UI shortcut keys to tab keys
  const shortcutToTabMap: Record<string, string> = {
    pendingConfirm: "wait_confirm",
    pendingPickup: "wait_shipping",
    shipping: "shipping_combined",
    review: "completed",
  }

  const orderShortcuts = [
    {
      key: "pendingConfirm",
      label: VI.profile.orders.pendingConfirm,
      icon: CheckCheck,
    },
    {
      key: "pendingPickup",
      label: VI.profile.orders.pendingPickup,
      icon: PackageCheck,
    },
    {
      key: "shipping",
      label: VI.profile.orders.shipping,
      icon: Truck,
    },
    {
      key: "review",
      label: VI.profile.orders.review,
      icon: Star,
    },
  ] as const

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setIsPageVisible(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    try {
      const storedCover = window.localStorage.getItem("cosmate.profile.cover")
      setCoverImageUrl(storedCover || null)
    } catch {
      setCoverImageUrl(null)
    }
  }, [])

  const handleCoverFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingCoverFile(file)
    setIsCoverCropOpen(true)
    e.target.value = ""
  }

  return (
    <div
      className={`home-anime min-h-[calc(100vh-64px)] bg-transparent py-8 transition-all duration-500 md:py-10 ${
        isPageVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="w-full min-w-0 space-y-4">
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleCoverFileChange(e)}
        />

        {loading ? (
          <div className="space-y-4">
            <Card className="space-y-4 p-6">
              <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-8 w-52 animate-pulse rounded-xl bg-slate-100" />
            </Card>
            <Card className="space-y-3 p-6">
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            </Card>
          </div>
        ) : error ? (
          <Card className="p-6">
            <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">
              {error}
            </p>
          </Card>
        ) : profile ? (
          <>
            <ProfileCover
              displayName={displayName}
              handle={handle}
              initials={initials}
              avatarUrl={profile.avatarUrl}
              coverImageUrl={coverImageUrl}
              onPreviewAvatar={() => setIsAvatarPreviewOpen(true)}
              onPreviewCover={() => setIsCoverPreviewOpen(true)}
              onUploadCover={() => coverInputRef.current?.click()}
              onEditProfile={() => setIsEditOpen(true)}
            />

            <div className="grid gap-4 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-5">
                <ProfileBioCard />

                <Card className="border-violet-300/85 bg-gradient-to-br from-violet-200/70 to-white p-5 shadow-[0_10px_30px_rgba(129,140,248,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(129,140,248,0.16)]">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        {VI.wallet.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">{VI.wallet.balance}</p>
                      <p className="mt-2 text-2xl font-bold text-purple-700">
                        {walletInfo?.balance?.toLocaleString("vi-VN") ?? 0} ₫
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/profile/wallet")}
                    >
                      {VI.wallet.manage}
                    </Button>
                  </div>
                </Card>

                <Card className="border-pink-300/85 bg-gradient-to-br from-pink-200/60 to-white p-5 shadow-[0_10px_30px_rgba(236,72,153,0.1)]">
                  <p className="text-base font-semibold text-slate-900">{VI.profile.title}</p>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-xl bg-white/90 px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        {VI.admin.users.columns.email}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{profile.email}</p>
                    </div>
                    <div className="rounded-xl bg-violet-200/65 px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        {VI.admin.users.columns.phone}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{profile.phone}</p>
                    </div>
                    <div className="rounded-xl bg-pink-200/65 px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">
                        {VI.admin.users.columns.status}
                      </p>
                      <div className="mt-1">
                        <Badge className={STATUS_BADGE_CLASS[statusTone]}>{profile.status}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-4 lg:col-span-7">
                <Card className="border-fuchsia-300/85 bg-gradient-to-br from-white to-pink-200/55 p-5 shadow-[0_10px_30px_rgba(236,72,153,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(236,72,153,0.16)]">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-900">
                      {VI.profile.orders.title}
                    </h2>
                    <button
                      type="button"
                      className="text-sm font-medium text-purple-600 decoration-1 underline-offset-2 transition-colors hover:text-purple-700 hover:underline"
                      onClick={() => navigate("/profile/purchase-history")}
                    >
                      {VI.profile.orders.history}
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {orderShortcuts.map((item, index) => {
                      const Icon = item.icon
                      const tabKey = shortcutToTabMap[item.key]
                      const count = tabKey ? counts[tabKey as keyof typeof counts] || 0 : 0
                      const tileToneClass =
                        index % 2 === 0
                          ? "border-fuchsia-300 bg-white/92 hover:bg-pink-100/80"
                          : "border-violet-300 bg-violet-200/70 hover:bg-violet-300/65"
                      return (
                        <button
                          key={item.key}
                          type="button"
                          className={`rounded-2xl border px-3 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${tileToneClass}`}
                          onClick={() =>
                            navigate(`/profile/purchase-history?tab=${tabKey}`)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <Icon className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-semibold text-slate-600">{count}</span>
                          </div>
                          <p className="mt-2 text-xs font-medium text-slate-700">{item.label}</p>
                        </button>
                      )
                    })}
                  </div>
                </Card>

                <Card className="border-violet-300/85 bg-gradient-to-br from-violet-200/65 to-white p-5 shadow-[0_10px_30px_rgba(139,92,246,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(139,92,246,0.18)]">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-base font-semibold text-slate-900">
                      {VI.profile.addresses.title}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      + {VI.profile.address.button.add}
                    </Button>
                  </div>

                  {addressesLoading ? (
                    <p className="mt-3 text-sm text-slate-600">
                      {VI.profile.addresses.loading}
                    </p>
                  ) : addressesError ? (
                    <p className="mt-3 text-sm text-rose-600">{addressesError}</p>
                  ) : addresses.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-600">{VI.profile.addresses.empty}</p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {displayedAddresses.map((item, index) => {
                        const fullAddress = [item.address, item.district, item.city]
                          .filter((part) => part && part.trim().length > 0)
                          .join(", ")
                        const addressToneClass =
                          index % 2 === 0
                            ? "border-fuchsia-300 bg-white/92"
                            : "border-pink-300 bg-pink-200/70"

                        return (
                          <div
                            key={item.id}
                            className={`rounded-2xl border px-4 py-3 ${addressToneClass}`}
                          >
                            <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                            <p className="mt-0.5 text-sm text-slate-700">{item.phone}</p>
                            <p className="mt-0.5 text-sm text-slate-600">{fullAddress}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {addresses.length > 1 && !addressesLoading && !addressesError && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-3 rounded-full border border-violet-300 bg-violet-200/75 px-4 text-violet-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-300/70 hover:text-violet-950 active:scale-[0.98]"
                      onClick={() => setShowAllAddresses((prev) => !prev)}
                    >
                      {showAllAddresses
                        ? VI.profile.addresses.collapse
                        : VI.profile.addresses.showMore}
                    </Button>
                  )}
                </Card>
              </div>
            </div>
          </>
        ) : (
          <Card className="p-6">
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
              {VI.common.status.noData}
            </p>
          </Card>
        )}
      </div>
      <EditProfileModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        userId={userId}
        profile={profile}
        onProfileUpdated={setProfile}
      />
      <AddressModal
        open={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        userId={userId}
      />
      <Dialog open={isAvatarPreviewOpen} onOpenChange={setIsAvatarPreviewOpen}>
        <DialogContent className="max-h-[92vh] w-auto max-w-[96vw] rounded-none bg-transparent p-0 shadow-none">
          <div className="flex justify-center">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={VI.profile.cover.avatarPreviewTitle}
                className="h-auto max-h-[90vh] w-auto max-w-[94vw] rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-52 w-52 items-center justify-center rounded-full bg-pink-100 text-5xl font-bold text-pink-700">
                {initials}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCoverPreviewOpen} onOpenChange={setIsCoverPreviewOpen}>
        <DialogContent className="max-h-[92vh] w-auto max-w-[98vw] rounded-none bg-transparent p-0 shadow-none">
          <div className="flex justify-center">
            <img
              src={
                coverImageUrl ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop stop-color='%23fbcfe8'/%3E%3Cstop offset='0.5' stop-color='%23ddd6fe'/%3E%3Cstop offset='1' stop-color='%23bfdbfe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E"
              }
              alt={VI.profile.cover.coverPreviewTitle}
              className="h-auto max-h-[90vh] w-auto max-w-[96vw] rounded-lg object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <ImageCropDialog
        open={isCoverCropOpen}
        file={pendingCoverFile}
        title={VI.profile.crop.coverTitle}
        aspect={16 / 6}
        onOpenChange={(open) => {
          setIsCoverCropOpen(open)
          if (!open) setPendingCoverFile(null)
        }}
        onConfirm={async ({ dataUrl }) => {
          setCoverImageUrl(dataUrl)
          try {
            window.localStorage.setItem("cosmate.profile.cover", dataUrl)
          } catch {
            // Ignore storage errors and keep UI state.
          }
          message.success(VI.profile.cover.uploadCoverSuccess)
          setPendingCoverFile(null)
          setIsCoverCropOpen(false)
        }}
      />
    </div>
  )
}
