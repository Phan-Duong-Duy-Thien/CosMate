import { type ChangeEvent, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserProfile } from "../hooks/useUserProfile"
import { useUserAddresses } from "../hooks/useUserAddresses"
import { usePurchaseOrders } from "../hooks/usePurchaseOrders"
import { Badge } from "@/shared/components/Badge"
import { Button } from "@/shared/components/Button"
import { Card } from "@/shared/components/Card"
import { VI } from "@/shared/i18n/vi"
import { EditProfileModal } from "../components/EditProfileModal"
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
  const { profile, displayName, handle, initials, statusTone, loading, uploadingAvatar, error, setProfile, userId, uploadAvatar } =
    useUserProfile()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showAllAddresses, setShowAllAddresses] = useState(false)
  const { addresses, isLoading: addressesLoading, error: addressesError } =
    useUserAddresses(userId)
  const { counts } = usePurchaseOrders("all")

  const displayedAddresses = showAllAddresses ? addresses : addresses.slice(0, 1)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  // Map UI shortcut keys to tab keys
  const shortcutToTabMap: Record<string, string> = {
    pendingConfirm: "wait_confirm",
    pendingPickup: "wait_shipping",
    shipping: "wait_shipping",
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

  const handlePickAvatar = () => {
    if (uploadingAvatar) return
    avatarInputRef.current?.click()
  }

  const handleAvatarFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ok = await uploadAvatar(file)
    if (ok) {
      message.success(VI.profile.editModal.uploadAvatarSuccess)
    } else {
      message.error(VI.profile.messages.uploadAvatarFailed)
    }
    e.target.value = ""
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#fff6fc] via-[#f6f5ff] to-[#eef7ff] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        {loading ? (
          <Card className="space-y-4 p-6">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          </Card>
        ) : error ? (
          <Card className="p-6">
            <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">
              {error}
            </p>
          </Card>
        ) : profile ? (
          <>
            <Card className="border-white/70 bg-white/90 p-5 shadow-[0_12px_40px_rgba(180,160,255,0.18)]">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleAvatarFileChange(e)}
              />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="group relative"
                  onClick={handlePickAvatar}
                  disabled={uploadingAvatar}
                  aria-label={VI.profile.editModal.uploadAvatar}
                >
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={displayName}
                      className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm transition-opacity group-hover:opacity-90"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-700">
                      {initials}
                    </div>
                  )}
                  <span className="pointer-events-none absolute inset-0 flex items-end justify-center rounded-full bg-black/0 pb-1 text-[10px] font-medium text-white opacity-0 transition-all group-hover:bg-black/25 group-hover:opacity-100">
                    {uploadingAvatar ? VI.common.status.loading : VI.profile.editModal.uploadAvatar}
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-slate-900">{displayName}</p>
                  <p className="text-sm text-purple-600">{handle}</p>
                  <span className="mt-1 inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                    {VI.profile.handleLabel}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditOpen(true)}
                >
                  {VI.profile.hub.edit}
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  {VI.profile.orders.title}
                </h2>
                <button
                  type="button"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                  onClick={() => navigate("/profile/purchase-history")}
                >
                  {VI.profile.orders.history}
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {orderShortcuts.map((item) => {
                  const Icon = item.icon
                  const tabKey = shortcutToTabMap[item.key]
                  const count = tabKey ? counts[tabKey as keyof typeof counts] || 0 : 0
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition-colors hover:bg-slate-100"
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

            <Card className="p-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {VI.profile.wallet.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {VI.profile.wallet.balance}: <span className="font-semibold">0 ₫</span>
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile/wallet")}
                >
                  {VI.profile.wallet.manage}
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-base font-semibold text-slate-900">
                {VI.profile.addresses.title}
              </p>

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
                  {displayedAddresses.map((item) => {
                    const fullAddress = [item.address, item.district, item.city]
                      .filter((part) => part && part.trim().length > 0)
                      .join(", ")

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
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
                  className="mt-3 rounded-full border border-purple-100 bg-purple-50 px-4 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
                  onClick={() => setShowAllAddresses((prev) => !prev)}
                >
                  {showAllAddresses
                    ? VI.profile.addresses.collapse
                    : VI.profile.addresses.showMore}
                </Button>
              )}
            </Card>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">
                  {VI.admin.users.columns.email}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">{profile.email}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">
                  {VI.admin.users.columns.phone}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">{profile.phone}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">
                  {VI.admin.users.columns.status}
                </p>
                <div className="mt-1">
                  <Badge className={STATUS_BADGE_CLASS[statusTone]}>{profile.status}</Badge>
                </div>
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
    </div>
  )
}
