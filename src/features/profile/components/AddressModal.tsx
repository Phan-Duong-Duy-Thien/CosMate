import * as React from "react"
import { Dialog, DialogContent } from "@/shared/components/Dialog"
import { Button } from "@/shared/components/Button"
import { Input } from "@/shared/components/Input"
import type { UpsertUserAddressPayload, UserAddress, Province, District } from "../types"
import { cn } from "@/lib/utils"
import { VI } from "@/shared/i18n/vi"
import { useUserAddressesCrud } from "../hooks/useUserAddressesCrud"
import { useVnLocation } from "../hooks/useVnLocation"
import { message } from "antd"

function normalizeVnName(n: string | undefined | null): string {
  if (!n) return ""
  return n.toLowerCase().trim().replace(/^(tinh|thanh pho)\s+/i, "").replace(/\s+/g, " ")
}

function findProvinceByCityLabel(
  provinces: Province[],
  cityLabel: string | undefined | null
): Province | undefined {
  if (!cityLabel || provinces.length === 0) return undefined
  const nl = normalizeVnName(cityLabel)
  const em = provinces.find((p) => normalizeVnName(p.name) === nl)
  if (em) return em
  return provinces.find((p) => {
    const np = normalizeVnName(p.name)
    return nl.includes(np) || np.includes(nl)
  })
}

function findDistrictByLabel(
  districts: District[],
  districtLabel: string | undefined | null
): District | undefined {
  if (!districtLabel || districts.length === 0) return undefined
  const nl = normalizeVnName(districtLabel)
  const em = districts.find((d) => normalizeVnName(d.name) === nl)
  if (em) return em
  return districts.find((d) => {
    const nd = normalizeVnName(d.name)
    return nl.includes(nd) || nd.includes(nl)
  })
}

interface AddressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number | null | undefined
}

export function AddressModal({
  open,
  onOpenChange,
  userId,
}: AddressModalProps) {
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

  const validateAddress = (): boolean => {
    const nextErrors: Partial<Record<keyof UpsertUserAddressPayload, string>> = {}
    if (!addressForm.name.trim()) nextErrors.name = VI.profile.address.validation.required
    if (!addressForm.phone.trim()) {
      nextErrors.phone = VI.profile.address.validation.required
    } else if (!/^\+?[0-9]{9,15}$/.test(addressForm.phone.trim())) {
      nextErrors.phone = VI.profile.address.validation.invalidPhone
    }
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

  const handleDeleteAddress = async (addressId: number) => {
    const confirmed = window.confirm(VI.profile.address.confirm.delete)
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

  React.useEffect(() => {
    if (open) {
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

  React.useEffect(() => {
    if (!isAddressFormOpen || !editingAddressCity) return
    if (provinceCode != null) return
    if (provinces.length === 0) return

    const matchedProvince = findProvinceByCityLabel(provinces, editingAddressCity)
    if (matchedProvince) {
      setProvinceCode(matchedProvince.code)
    }
  }, [isAddressFormOpen, editingAddressCity, provinceCode, provinces, setProvinceCode])

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85vh] max-w-xl overflow-y-auto"
        onClose={() => onOpenChange(false)}
      >
        <h2 className="text-xl font-bold text-slate-900">
          {VI.profile.addresses.title}
        </h2>

        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-700">
                {VI.profile.addresses.title}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleOpenCreateAddress}
              >
                + {VI.profile.address.button.add}
              </Button>
            </div>

            {loadingList ? (
              <p className="text-sm text-slate-600">{VI.profile.addresses.loading}</p>
            ) : addressesError ? (
              <p className="text-sm text-rose-600">{addressesError}</p>
            ) : addresses.length === 0 ? (
              <p className="text-sm text-slate-600">{VI.profile.addresses.empty}</p>
            ) : (
              <div className="space-y-2">
                {addresses.map((item) => {
                  const fullAddress = [item.address, item.district, item.city]
                    .filter((part) => part && part.trim().length > 0)
                    .join(", ")

                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                          <p className="mt-0.5 text-sm text-slate-700">{item.phone}</p>
                          <p className="mt-0.5 text-sm text-slate-600">{fullAddress}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="min-w-14 justify-center"
                            onClick={() => handleOpenEditAddress(item)}
                          >
                            {VI.profile.address.button.edit}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="min-w-14 justify-center border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
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
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-medium text-slate-700">
                {editingAddressId == null
                  ? VI.profile.address.button.add
                  : VI.profile.address.button.edit}
              </p>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {VI.profile.address.form.recipientName} <span className="text-pink-500">*</span>
                  </label>
                  <Input
                    value={addressForm.name}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={VI.profile.address.form.recipientNamePlaceholder}
                    className={cn(addressFieldErrors.name && "border-pink-300")}
                  />
                  {addressFieldErrors.name && (
                    <p className="mt-1 text-xs text-pink-600">{addressFieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {VI.profile.address.form.phone} <span className="text-pink-500">*</span>
                  </label>
                  <Input
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder={VI.profile.address.form.phonePlaceholder}
                    className={cn(addressFieldErrors.phone && "border-pink-300")}
                  />
                  {addressFieldErrors.phone && (
                    <p className="mt-1 text-xs text-pink-600">{addressFieldErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {VI.profile.address.form.addressName} <span className="text-pink-500">*</span>
                  </label>
                  <Input
                    value={addressForm.addressName}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, addressName: e.target.value }))
                    }
                    placeholder={VI.profile.address.form.addressNamePlaceholder}
                    className={cn(addressFieldErrors.addressName && "border-pink-300")}
                  />
                  {addressFieldErrors.addressName && (
                    <p className="mt-1 text-xs text-pink-600">{addressFieldErrors.addressName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {VI.profile.address.form.city} <span className="text-pink-500">*</span>
                  </label>
                  <select
                    value={provinceCode ?? ""}
                    onChange={(e) => {
                      const nextCode = e.target.value ? Number(e.target.value) : null
                      const selectedProvince = provinces.find(
                        (province) => province.code === nextCode
                      )
                      setProvinceCode(nextCode)
                      setAddressForm((prev) => ({
                        ...prev,
                        city: selectedProvince?.name ?? "",
                        district: "",
                      }))
                    }}
                    disabled={loadingProvinces}
                    className={cn(
                      "h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200 focus-visible:ring-offset-2",
                      addressFieldErrors.city && "border-pink-300"
                    )}
                  >
                    <option value="">{VI.profile.address.form.cityPlaceholder}</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {addressFieldErrors.city && (
                    <p className="mt-1 text-xs text-pink-600">{addressFieldErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {VI.profile.address.form.district}{" "}
                    <span className="text-pink-500">*</span>
                  </label>
                  <select
                    value={districtCode ?? ""}
                    onChange={(e) => {
                      const nextCode = e.target.value ? Number(e.target.value) : null
                      const selectedDistrict = districts.find(
                        (d) => d.code === nextCode
                      )
                      setDistrictCode(nextCode)
                      setAddressForm((prev) => ({
                        ...prev,
                        district: selectedDistrict?.name ?? "",
                      }))
                    }}
                    disabled={provinceCode == null || loadingDistricts}
                    className={cn(
                      "h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-200 focus-visible:ring-offset-2",
                      addressFieldErrors.district && "border-pink-300"
                    )}
                  >
                    <option value="">{VI.profile.address.form.districtPlaceholder}</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {addressFieldErrors.district && (
                    <p className="mt-1 text-xs text-pink-600">
                      {addressFieldErrors.district}
                    </p>
                  )}
                </div>


                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {VI.profile.address.form.streetAddress}{" "}
                    <span className="text-pink-500">*</span>
                  </label>
                  <Input
                    value={addressForm.address}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder={VI.profile.address.form.streetAddressPlaceholder}
                    className={cn(addressFieldErrors.address && "border-pink-300")}
                  />
                  {addressFieldErrors.address && (
                    <p className="mt-1 text-xs text-pink-600">{addressFieldErrors.address}</p>
                  )}
                </div>

                {locationError && (
                  <p className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {locationError}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
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
                    size="sm"
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
      </DialogContent>
    </Dialog>
  )
}
