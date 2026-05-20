import * as React from "react"
import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { Button } from "@/components/ui/button"
import { PROFILE_MODAL_UI } from "../constants/profileUi"
import type { AdminUserProfile } from "@/features/admin/types"
import type { UpsertUserAddressPayload, UserAddress, Province, District } from "../types"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { useEditProfile } from "../hooks/useEditProfile"
import { useUserAddressesCrud } from "../hooks/useUserAddressesCrud"
import { useVnLocation } from "../hooks/useVnLocation"
import { ImageCropDialog } from "./ImageCropDialog"
import { message, Modal } from "antd"
import { AddressOptionalLabel, AddressRequiredLabel } from "./AddressRequiredLabel"
import { DistrictSelect, ProvinceSelect } from "./AddressLocationSelects"
import { AddressPhoneInput } from "./AddressPhoneInput"
import { getPhoneValidationError } from "../utils/addressValidation"

// ============ Location Helper Functions ============

function normalizeVnName(n: string | undefined | null): string {
  if (!n) return "";
  return n.toLowerCase().trim().replace(/^(tinh|thanh pho)\s+/i, "").replace(/\s+/g, " ");
}

function findProvinceByCityLabel(
  provinces: Province[],
  cityLabel: string | undefined | null
): Province | undefined {
  if (!cityLabel || provinces.length === 0) return undefined;
  const nl = normalizeVnName(cityLabel);
  const em = provinces.find((p) => normalizeVnName(p.name) === nl);
  if (em) return em;
  return provinces.find((p) => {
    const np = normalizeVnName(p.name);
    return nl.includes(np) || np.includes(nl);
  });
}

function findDistrictByLabel(
  districts: District[],
  districtLabel: string | undefined | null
): District | undefined {
  if (!districtLabel || districts.length === 0) return undefined;
  const nl = normalizeVnName(districtLabel);
  const em = districts.find((d) => normalizeVnName(d.name) === nl);
  if (em) return em;
  return districts.find((d) => {
    const nd = normalizeVnName(d.name);
    return nl.includes(nd) || nd.includes(nl);
  });
}

type EditProfileTab = "basic" | "address"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number | null | undefined
  profile: AdminUserProfile | null
  onProfileUpdated: (profile: AdminUserProfile) => void
}

export default function EditProfileModal({
  open,
  onOpenChange,
  userId,
  profile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = React.useState<EditProfileTab>("basic")
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const [isAvatarCropOpen, setIsAvatarCropOpen] = React.useState(false)
  const [isAddressFormOpen, setIsAddressFormOpen] = React.useState(false)
  const [editingAddressId, setEditingAddressId] = React.useState<number | null>(null)
  const [addressForm, setAddressForm] = React.useState<UpsertUserAddressPayload>({
    name: "",
    city: "",
    district: "",
    address: "",
    phone: "",
    addressName: "",
  })
  const [addressFieldErrors, setAddressFieldErrors] = React.useState<
    Partial<Record<keyof UpsertUserAddressPayload, string>>
  >({})
  const [editingAddressCity, setEditingAddressCity] = React.useState<string | null>(null)
  const [editingAddressDistrict, setEditingAddressDistrict] = React.useState<string | null>(null)

  const {
    addresses,
    loadingList,
    saving,
    error: addressesError,
    create,
    update,
    remove,
  } = useUserAddressesCrud(userId)
  const {
    provinceCode,
    setProvinceCode,
    districtCode,
    setDistrictCode,
    provinces,
    districts,
    loadingProvinces,
    loadingDistricts,
    error: locationError,
  } = useVnLocation()

  const {
    fullName,
    setFullName,
    phone,
    setPhone,
    updatingProfile,
    uploadingAvatar,
    fieldErrors,
    error,
    success,
    handleSubmitBasicInfo,
    handleAvatarUpload,
  } = useEditProfile({
    initialProfile: profile,
    onProfileUpdated,
  })

  React.useEffect(() => {
    if (open) {
      setActiveTab("basic")
      setAvatarFile(null)
      setIsAvatarCropOpen(false)
      setIsAddressFormOpen(false)
      setEditingAddressId(null)
      setAddressForm({
        name: "",
        city: "",
        district: "",
        address: "",
        phone: "",
        addressName: "",
      })
      setAddressFieldErrors({})
      setEditingAddressCity(null)
      setEditingAddressDistrict(null)
    }
  }, [open])

  // Effect: Prefill province when editing existing address
  React.useEffect(() => {
    if (!isAddressFormOpen || !editingAddressCity) return
    if (provinceCode != null) return
    if (provinces.length === 0) return
    
    const matchedProvince = findProvinceByCityLabel(provinces, editingAddressCity)
    if (matchedProvince) {
      setProvinceCode(matchedProvince.code)
    }
  }, [isAddressFormOpen, editingAddressCity, provinceCode, provinces, setProvinceCode])

  // Effect: Prefill district after districts loaded for edit mode
  React.useEffect(() => {
    if (!isAddressFormOpen || !editingAddressDistrict) return
    if (provinceCode == null) return
    if (districtCode != null) return
    if (districts.length === 0) return
    
    const matchedDistrict = findDistrictByLabel(districts, editingAddressDistrict)
    if (matchedDistrict) {
      setDistrictCode(matchedDistrict.code)
    }
  }, [isAddressFormOpen, editingAddressDistrict, provinceCode, districtCode, districts, setDistrictCode])

  const previewUrl = React.useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile)
    return profile?.avatarUrl ?? null
  }, [avatarFile, profile?.avatarUrl])

  React.useEffect(() => {
    return () => {
      if (avatarFile) {
        URL.revokeObjectURL(previewUrl ?? "")
      }
    }
  }, [avatarFile, previewUrl])

  const initials = React.useMemo(() => {
    const source = (profile?.fullName?.trim() || profile?.username || "U").trim()
    const parts = source.split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "U"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }, [profile?.fullName, profile?.username])

  const handleOpenCreateAddress = () => {
    setEditingAddressId(null)
    setEditingAddressCity(null)
    setEditingAddressDistrict(null)
    setProvinceCode(null)
    setDistrictCode(null)
    setAddressForm({
      name: "",
      city: "",
      district: "",
      address: "",
      phone: "",
      addressName: "",
    })
    setAddressFieldErrors({})
    setIsAddressFormOpen(true)
  }

  const handleOpenEditAddress = (item: UserAddress) => {
    setEditingAddressId(item.id)
    setEditingAddressCity(item.city)
    setEditingAddressDistrict(item.district)
    setAddressForm({
      name: item.name,
      city: item.city,
      district: item.district,
      address: item.address,
      phone: item.phone,
      addressName: (item as UserAddress & { addressName?: string }).addressName || "",
    })
    setAddressFieldErrors({})
    setIsAddressFormOpen(true)
  }

  const validatePhoneField = (phone: string) => {
    const phoneError = getPhoneValidationError(phone)
    setAddressFieldErrors((prev) => {
      const next = { ...prev }
      if (phoneError) next.phone = phoneError
      else delete next.phone
      return next
    })
    return phoneError
  }

  const validateAddress = (): boolean => {
    const nextErrors: Partial<Record<keyof UpsertUserAddressPayload, string>> = {}
    if (!addressForm.name.trim()) nextErrors.name = VI.profile.address.validation.required
    const phoneError = getPhoneValidationError(addressForm.phone)
    if (phoneError) nextErrors.phone = phoneError
    if (!addressForm.city.trim()) nextErrors.city = VI.profile.address.validation.required
    if (!addressForm.district.trim()) nextErrors.district = VI.profile.address.validation.required
    if (!addressForm.address.trim()) nextErrors.address = VI.profile.address.validation.required
    setAddressFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSaveAddress = async () => {
    if (!validateAddress()) return

    const payload: UpsertUserAddressPayload = {
      name: addressForm.name.trim(),
      city: addressForm.city.trim(),
      district: addressForm.district.trim(),
      address: addressForm.address.trim(),
      phone: addressForm.phone.trim(),
      addressName: addressForm.addressName.trim(),
    }

    const ok =
      editingAddressId == null
        ? await create(payload)
        : await update(editingAddressId, payload)

    if (!ok) return

    message.success(
      editingAddressId == null
        ? VI.profile.address.messages.createSuccess
        : VI.profile.address.messages.updateSuccess
    )
    setIsAddressFormOpen(false)
    setEditingAddressId(null)
    setEditingAddressCity(null)
    setEditingAddressDistrict(null)
    setProvinceCode(null)
    setDistrictCode(null)
    setAddressFieldErrors({})
  }

  const handleAvatarFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""
    if (!file || uploadingAvatar) return
    setAvatarFile(file)
    setIsAvatarCropOpen(true)
  }

  const handleSaveBasicInfo = async () => {
    const ok = await handleSubmitBasicInfo()
    if (ok) {
      message.success(VI.profile.editModal.updateSuccess)
      return
    }
    message.error(error ?? VI.profile.messages.updateFailed)
  }

  const handleDeleteAddress = async (addressId: number) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Modal.confirm({
        title: VI.profile.address.confirm.delete,
        okText: VI.common.actions.delete,
        cancelText: VI.common.actions.cancel,
        okButtonProps: { danger: true },
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      })
    })
    if (!confirmed) return

    const ok = await remove(addressId)
    if (!ok) return

    message.success(VI.profile.address.messages.deleteSuccess)
    if (editingAddressId === addressId) {
      setIsAddressFormOpen(false)
      setEditingAddressId(null)
      setAddressFieldErrors({})
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={PROFILE_MODAL_UI.content}
        closeClassName={PROFILE_MODAL_UI.closeBtn}
        onClose={() => onOpenChange(false)}
      >
        <h2 className={PROFILE_MODAL_UI.title}>
          {VI.profile.editModal.title}
        </h2>

        <div className={cn("mt-4", PROFILE_MODAL_UI.tabTrack)}>
          <button
            type="button"
            className={cn(
              PROFILE_MODAL_UI.tabBtn,
              activeTab === "basic" ? PROFILE_MODAL_UI.tabActive : PROFILE_MODAL_UI.tabIdle,
            )}
            onClick={() => setActiveTab("basic")}
          >
            {VI.profile.editModal.tabs.basicInfo}
          </button>
          <button
            type="button"
            className={cn(
              PROFILE_MODAL_UI.tabBtn,
              activeTab === "address" ? PROFILE_MODAL_UI.tabActive : PROFILE_MODAL_UI.tabIdle,
            )}
            onClick={() => setActiveTab("address")}
          >
            {VI.profile.editModal.tabs.address}
          </button>
        </div>

        {activeTab === "basic" ? (
          <div className="mt-5 space-y-5">
            <div className={PROFILE_MODAL_UI.section}>
              <p className={cn("mb-3", PROFILE_MODAL_UI.sectionTitle)}>
                {VI.profile.avatar}
              </p>
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={VI.profile.avatar}
                    className={PROFILE_MODAL_UI.avatar}
                  />
                ) : (
                  <div className={PROFILE_MODAL_UI.avatarFallback}>
                    {initials}
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileSelected}
                    className={PROFILE_MODAL_UI.fileInput}
                  />
                </div>
              </div>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                void handleSaveBasicInfo()
              }}
            >
              <div>
                <label className={PROFILE_MODAL_UI.label}>
                  {VI.profile.fullName} <span className={PROFILE_MODAL_UI.required}>*</span>
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={VI.profile.placeholders.fullName}
                  className={cn(
                    PROFILE_MODAL_UI.input,
                    fieldErrors.fullName && PROFILE_MODAL_UI.inputError,
                  )}
                />
                {fieldErrors.fullName && (
                  <p className={PROFILE_MODAL_UI.fieldError}>{fieldErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className={PROFILE_MODAL_UI.label}>
                  {VI.profile.phone} <span className={PROFILE_MODAL_UI.required}>*</span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={VI.profile.placeholders.phone}
                  className={cn(
                    PROFILE_MODAL_UI.input,
                    fieldErrors.phone && PROFILE_MODAL_UI.inputError,
                  )}
                />
                {fieldErrors.phone && (
                  <p className={PROFILE_MODAL_UI.fieldError}>{fieldErrors.phone}</p>
                )}
              </div>

              {error && (
                <p className={PROFILE_MODAL_UI.alertError}>{error}</p>
              )}
              {success && (
                <p className={PROFILE_MODAL_UI.alertSuccess}>{success}</p>
              )}

              <div className={PROFILE_MODAL_UI.footerActions}>
                <Button
                  type="button"
                  variant="ghost"
                  className={PROFILE_MODAL_UI.btnCancel}
                  onClick={() => onOpenChange(false)}
                >
                  {VI.common.actions.cancel}
                </Button>
                <Button
                  type="submit"
                  variant="ghost"
                  className={PROFILE_MODAL_UI.btnPrimary}
                  disabled={updatingProfile}
                >
                  {updatingProfile
                    ? VI.common.status.loading
                    : VI.profile.editModal.saveBasicInfo}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className={PROFILE_MODAL_UI.section}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className={PROFILE_MODAL_UI.sectionTitle}>
                  {VI.profile.addresses.title}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  className={PROFILE_MODAL_UI.btnGhost}
                  onClick={handleOpenCreateAddress}
                >
                  + {VI.profile.address.button.add}
                </Button>
              </div>

              {loadingList ? (
                <p className={PROFILE_MODAL_UI.mutedText}>{VI.profile.addresses.loading}</p>
              ) : addressesError ? (
                <p className={PROFILE_MODAL_UI.fieldError}>{addressesError}</p>
              ) : addresses.length === 0 ? (
                <p className={PROFILE_MODAL_UI.mutedText}>{VI.profile.addresses.empty}</p>
              ) : (
                <div className="space-y-2">
                  {addresses.map((item) => {
                    const fullAddress = [item.address, item.district, item.city]
                      .filter((part) => part && part.trim().length > 0)
                      .join(", ")

                    return (
                      <div
                        key={item.id}
                        className={PROFILE_MODAL_UI.addressCard}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={PROFILE_MODAL_UI.addressName}>{item.name}</p>
                            <p className={PROFILE_MODAL_UI.addressMeta}>{item.phone}</p>
                            <p className={PROFILE_MODAL_UI.addressMeta}>{fullAddress}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              className={cn("min-w-14 justify-center", PROFILE_MODAL_UI.btnGhost)}
                              onClick={() => handleOpenEditAddress(item)}
                            >
                              {VI.profile.address.button.edit}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              className={cn("min-w-14 justify-center", PROFILE_MODAL_UI.deleteBtn)}
                              disabled={saving}
                              onClick={() => void handleDeleteAddress(item.id)}
                            >
                              {VI.profile.address.button.delete}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {isAddressFormOpen && (
              <div className={PROFILE_MODAL_UI.section}>
                <p className={cn("mb-3", PROFILE_MODAL_UI.sectionTitle)}>
                  {editingAddressId == null
                    ? VI.profile.address.button.add
                    : VI.profile.address.button.edit}
                </p>

                <div className="space-y-3">
                  <div>
                    <AddressRequiredLabel
                      className={PROFILE_MODAL_UI.label}
                      requiredClassName={PROFILE_MODAL_UI.required}
                    >
                      {VI.profile.address.form.recipientName}
                    </AddressRequiredLabel>
                    <input
                      value={addressForm.name}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder={VI.profile.address.form.recipientNamePlaceholder}
                      className={cn(
                        PROFILE_MODAL_UI.input,
                        addressFieldErrors.name && PROFILE_MODAL_UI.inputError,
                      )}
                    />
                    {addressFieldErrors.name && (
                      <p className={PROFILE_MODAL_UI.fieldError}>{addressFieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <AddressRequiredLabel
                      className={PROFILE_MODAL_UI.label}
                      requiredClassName={PROFILE_MODAL_UI.required}
                    >
                      {VI.profile.address.form.phone}
                    </AddressRequiredLabel>
                    <AddressPhoneInput
                      value={addressForm.phone}
                      onChange={(phone) =>
                        setAddressForm((prev) => ({ ...prev, phone }))
                      }
                      onBlur={() => validatePhoneField(addressForm.phone)}
                      hasError={Boolean(addressFieldErrors.phone)}
                      className={cn(
                        PROFILE_MODAL_UI.input,
                        addressFieldErrors.phone && PROFILE_MODAL_UI.inputError,
                      )}
                    />
                    {addressFieldErrors.phone && (
                      <p className={PROFILE_MODAL_UI.fieldError}>{addressFieldErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <AddressRequiredLabel
                      className={PROFILE_MODAL_UI.label}
                      requiredClassName={PROFILE_MODAL_UI.required}
                    >
                      {VI.profile.address.form.city}
                    </AddressRequiredLabel>
                    <ProvinceSelect
                      variant="modal"
                      provinceCode={provinceCode}
                      provinces={provinces}
                      loading={loadingProvinces}
                      hasError={Boolean(addressFieldErrors.city)}
                      onProvinceChange={(nextCode, selectedProvince) => {
                        setProvinceCode(nextCode)
                        setDistrictCode(null)
                        setAddressForm((prev) => ({
                          ...prev,
                          city: selectedProvince?.name ?? "",
                          district: "",
                        }))
                      }}
                    />
                    {addressFieldErrors.city && (
                      <p className={PROFILE_MODAL_UI.fieldError}>{addressFieldErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <AddressRequiredLabel
                      className={PROFILE_MODAL_UI.label}
                      requiredClassName={PROFILE_MODAL_UI.required}
                    >
                      {VI.profile.address.form.district}
                    </AddressRequiredLabel>
                    <DistrictSelect
                      variant="modal"
                      provinceCode={provinceCode}
                      districtCode={districtCode}
                      districts={districts}
                      loading={loadingDistricts}
                      hasError={Boolean(addressFieldErrors.district)}
                      onDistrictChange={(nextCode, selectedDistrict) => {
                        setDistrictCode(nextCode)
                        setAddressForm((prev) => ({
                          ...prev,
                          district: selectedDistrict?.name ?? "",
                        }))
                      }}
                    />
                    {addressFieldErrors.district && (
                      <p className={PROFILE_MODAL_UI.fieldError}>
                        {addressFieldErrors.district}
                      </p>
                    )}
                  </div>

                  <div>
                    <AddressOptionalLabel className={PROFILE_MODAL_UI.label}>
                      {VI.profile.address.form.addressName}
                    </AddressOptionalLabel>
                    <input
                      value={addressForm.addressName}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, addressName: e.target.value }))
                      }
                      placeholder={VI.profile.address.form.addressNamePlaceholder}
                      className={cn(
                        PROFILE_MODAL_UI.input,
                        addressFieldErrors.addressName && PROFILE_MODAL_UI.inputError,
                      )}
                    />
                    {addressFieldErrors.addressName && (
                      <p className={PROFILE_MODAL_UI.fieldError}>{addressFieldErrors.addressName}</p>
                    )}
                  </div>

                  <div>
                    <AddressRequiredLabel
                      className={PROFILE_MODAL_UI.label}
                      requiredClassName={PROFILE_MODAL_UI.required}
                    >
                      {VI.profile.address.form.streetAddress}
                    </AddressRequiredLabel>
                    <input
                      value={addressForm.address}
                      onChange={(e) =>
                        setAddressForm((prev) => ({ ...prev, address: e.target.value }))
                      }
                      placeholder={VI.profile.address.form.streetAddressPlaceholder}
                      className={cn(
                        PROFILE_MODAL_UI.input,
                        addressFieldErrors.address && PROFILE_MODAL_UI.inputError,
                      )}
                    />
                    {addressFieldErrors.address && (
                      <p className={PROFILE_MODAL_UI.fieldError}>{addressFieldErrors.address}</p>
                    )}
                  </div>

                  {locationError && (
                    <p className={PROFILE_MODAL_UI.alertError}>{locationError}</p>
                  )}

                  <div className={PROFILE_MODAL_UI.footerActions}>
                    <Button
                      type="button"
                      variant="ghost"
                      className={PROFILE_MODAL_UI.btnCancel}
                      onClick={() => {
                        setIsAddressFormOpen(false)
                        setEditingAddressId(null)
                        setAddressFieldErrors({})
                      }}
                    >
                      {VI.common.actions.cancel}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className={PROFILE_MODAL_UI.btnPrimary}
                      disabled={saving}
                      onClick={() => void handleSaveAddress()}
                    >
                      {saving ? VI.common.status.loading : VI.common.actions.save}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
      <ImageCropDialog
        open={isAvatarCropOpen}
        file={avatarFile}
        title={VI.profile.crop.avatarTitle}
        aspect={1}
        cropShape="round"
        onOpenChange={(open) => {
          setIsAvatarCropOpen(open)
          if (!open) {
            setAvatarFile(null)
          }
        }}
        onConfirm={async ({ file }) => {
          const ok = await handleAvatarUpload(file)
          if (ok) {
            message.success(VI.profile.editModal.uploadAvatarSuccess)
            setAvatarFile(null)
            setIsAvatarCropOpen(false)
            return
          }
          message.error(VI.profile.messages.uploadAvatarFailed)
        }}
      />
    </Dialog>
  )
}
