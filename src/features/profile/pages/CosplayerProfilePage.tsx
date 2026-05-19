import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserProfile } from "../hooks/useUserProfile"
import { useUserAddresses } from "../hooks/useUserAddresses"
import { usePurchaseOrders } from "../hooks/usePurchaseOrders"
import { useWallet } from "../hooks/useWallet"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { VI } from "@/shared/i18n/vi"
import EditProfileModal from "../components/EditProfileModal"
import { AddressModal } from "../components/AddressModal"
import { ProfileCover } from "../components/ProfileCover"
import { ProfileBioCard } from "../components/ProfileBioCard"
import { ImageCropDialog } from "../components/ImageCropDialog"
import { ProfileMetricBody, ProfileNeoCard } from "../components/ProfileNeoCard"
import { PROFILE_CARD_UI } from "../constants/profileUi"
import { CheckCheck, Coins, MapPin, PackageCheck, Star, Truck, User, Wallet } from "lucide-react"
import { message } from "antd"

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: "bg-cosmate-success/15 text-cosmate-success",
  inactive: "bg-muted text-muted-foreground",
  banned: "bg-destructive/10 text-destructive",
  default: "bg-cosmate-soft-pink text-cosmate-pink",
}

export default function CosplayerProfilePage() {
  const navigate = useNavigate()
  const { profile, displayName, handle, initials, statusTone, loading, error, setProfile, userId, refetch } =
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
      className={`home-anime min-h-[calc(100vh-64px)] bg-transparent px-3 py-8 transition-all duration-500 md:px-4 md:py-10 ${
        isPageVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-[min(1460px,100%)] space-y-4">
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleCoverFileChange(e)}
        />

        {loading ? (
          <div className="space-y-4">
            <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.32)]">
              <div className="space-y-4 p-6">
                <div className="h-40 animate-pulse rounded-2xl bg-muted" />
                <div className="h-8 w-52 animate-pulse rounded-xl bg-muted" />
              </div>
            </Card>
            <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.32)]">
              <div className="space-y-3 p-6">
                <div className="h-20 animate-pulse rounded-2xl bg-muted" />
                <div className="h-20 animate-pulse rounded-2xl bg-muted" />
              </div>
            </Card>
          </div>
        ) : error ? (
          <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.32)]">
            <div className="p-6">
              <p className="rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
                {error}
              </p>
            </div>
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

                <ProfileNeoCard
                  title={VI.wallet.title}
                  icon={Wallet}
                  footer={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={PROFILE_CARD_UI.action}
                      onClick={() => navigate("/profile/wallet")}
                    >
                      {VI.wallet.manage}
                    </Button>
                  }
                >
                  <ProfileMetricBody
                    label={VI.wallet.balance}
                    value={`${walletInfo?.balance?.toLocaleString("vi-VN") ?? 0} ₫`}
                  />
                </ProfileNeoCard>

                <ProfileNeoCard
                  title={VI.profile.token.title}
                  icon={Coins}
                  footer={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={PROFILE_CARD_UI.action}
                      onClick={() => navigate("/profile/token")}
                    >
                      {VI.profile.token.manage}
                    </Button>
                  }
                >
                  <ProfileMetricBody
                    label={VI.profile.token.balance}
                    value={(profile.numberOfToken ?? 0).toLocaleString("vi-VN")}
                  />
                </ProfileNeoCard>

                <ProfileNeoCard title={VI.profile.title} icon={User} hoverable={false}>
                    <div className="mt-2 space-y-2">
                      <div className="rounded-xl border-[2px] border-indigo-950/15 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{VI.admin.users.columns.email}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{profile.email}</p>
                      </div>
                      <div className="rounded-xl border-[2px] border-indigo-950/15 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{VI.admin.users.columns.phone}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{profile.phone}</p>
                      </div>
                      <div className="rounded-xl border-[2px] border-indigo-950/15 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{VI.admin.users.columns.status}</p>
                        <div className="mt-1">
                          <span
                            className={`inline-flex rounded-full border border-white/80 px-2.5 py-0.5 text-xs font-bold shadow-sm ${STATUS_BADGE_CLASS[statusTone]}`}
                          >
                            {profile.status}
                          </span>
                        </div>
                      </div>
                    </div>
                </ProfileNeoCard>
              </div>

              <div className="space-y-4 lg:col-span-7">
                <ProfileNeoCard
                  title={VI.profile.orders.title}
                  icon={PackageCheck}
                  footer={
                    <button
                      type="button"
                      className={PROFILE_CARD_UI.linkAction}
                      onClick={() => navigate("/profile/purchase-history")}
                    >
                      {VI.profile.orders.history}
                    </button>
                  }
                >
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {orderShortcuts.map((item) => {
                      const Icon = item.icon
                      const tabKey = shortcutToTabMap[item.key]
                      const count = tabKey ? counts[tabKey as keyof typeof counts] || 0 : 0
                      return (
                        <button
                          key={item.key}
                          type="button"
                          className="rounded-2xl border-[2px] border-indigo-950/15 bg-white px-3 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-950/40 hover:bg-pink-50 active:scale-[0.98]"
                          onClick={() => navigate(`/profile/purchase-history?tab=${tabKey}`)}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className="h-4 w-4 text-[#d61f91]" />
                            <span className="text-xs font-bold text-slate-500">{count}</span>
                          </div>
                          <p className="mt-2 text-xs font-semibold text-slate-700">{item.label}</p>
                        </button>
                      )
                    })}
                  </div>
                </ProfileNeoCard>

                <ProfileNeoCard
                  title={VI.profile.addresses.title}
                  icon={MapPin}
                  footer={
                    <>
                      {addresses.length > 1 && !addressesLoading && !addressesError && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={PROFILE_CARD_UI.action}
                          onClick={() => setShowAllAddresses((prev) => !prev)}
                        >
                          {showAllAddresses
                            ? VI.profile.addresses.collapse
                            : VI.profile.addresses.showMore}
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className={PROFILE_CARD_UI.action}
                        onClick={() => setIsAddressModalOpen(true)}
                      >
                        + {VI.profile.address.button.add}
                      </Button>
                    </>
                  }
                >
                  {addressesLoading ? (
                    <p className="text-sm text-muted-foreground">{VI.profile.addresses.loading}</p>
                  ) : addressesError ? (
                    <p className="text-sm text-destructive">{addressesError}</p>
                  ) : addresses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{VI.profile.addresses.empty}</p>
                  ) : (
                    <div className="space-y-2">
                      {displayedAddresses.map((item) => {
                        const fullAddress = [item.address, item.district, item.city]
                          .filter((part) => part && part.trim().length > 0)
                          .join(", ")

                        return (
                          <div
                            key={item.id}
                            className="rounded-2xl border-[2px] border-indigo-950/15 bg-white px-4 py-3"
                          >
                            <p className="text-sm font-bold text-indigo-950">{item.name}</p>
                            <p className="mt-0.5 text-sm font-medium text-slate-600">{item.phone}</p>
                            <p className="mt-0.5 text-sm font-medium text-slate-600">{fullAddress}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </ProfileNeoCard>
              </div>
            </div>
          </>
        ) : (
          <Card className="rounded-2xl border-[4px] border-indigo-950 bg-[#fffbeb] shadow-[8px_8px_0_0_rgba(30,27,75,0.32)]">
            <div className="p-6">
              <p className="rounded-2xl border border-border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
                {VI.common.status.noData}
              </p>
            </div>
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
              <div className="flex h-52 w-52 items-center justify-center rounded-full bg-cosmate-soft-pink text-5xl font-bold text-cosmate-pink">
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
