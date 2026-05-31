import { useCallback, useEffect, useState } from "react"
import { VI } from "@/shared/i18n/vi"
import type { UpsertUserAddressPayload, UserAddress } from "../types"
import * as userAddressService from "../services/userAddress.service"
import { notifyAddressesChanged } from "@/shared/sync/dataSync"

interface UseUserAddressesCrudResult {
  addresses: UserAddress[]
  loadingList: boolean
  saving: boolean
  error: string | null
  refresh: () => Promise<void>
  create: (payload: UpsertUserAddressPayload) => Promise<boolean>
  update: (addressId: number, payload: UpsertUserAddressPayload) => Promise<boolean>
  remove: (addressId: number) => Promise<boolean>
}

export function useUserAddressesCrud(
  userId: number | null | undefined
): UseUserAddressesCrudResult {
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (userId == null) {
      setAddresses([])
      setError(null)
      return
    }

    try {
      setLoadingList(true)
      setError(null)
      const list = await userAddressService.fetchAddresses(userId)
      setAddresses(list)
    } catch {
      setError(VI.profile.address.messages.saveError)
    } finally {
      setLoadingList(false)
    }
  }, [userId])

  const create = useCallback(
    async (payload: UpsertUserAddressPayload) => {
      if (userId == null) {
        setError(VI.profile.messages.loginRequired)
        return false
      }
      try {
        setSaving(true)
        setError(null)
        await userAddressService.addAddress(userId, payload)
        await refresh()
        notifyAddressesChanged()
        return true
      } catch {
        setError(VI.profile.address.messages.saveError)
        return false
      } finally {
        setSaving(false)
      }
    },
    [refresh, userId]
  )

  const update = useCallback(
    async (addressId: number, payload: UpsertUserAddressPayload) => {
      if (userId == null) {
        setError(VI.profile.messages.loginRequired)
        return false
      }
      try {
        setSaving(true)
        setError(null)
        await userAddressService.editAddress(userId, addressId, payload)
        await refresh()
        notifyAddressesChanged()
        return true
      } catch {
        setError(VI.profile.address.messages.saveError)
        return false
      } finally {
        setSaving(false)
      }
    },
    [refresh, userId]
  )

  const remove = useCallback(
    async (addressId: number) => {
      if (userId == null) {
        setError(VI.profile.messages.loginRequired)
        return false
      }
      try {
        setSaving(true)
        setError(null)
        await userAddressService.deleteAddress(userId, addressId)
        await refresh()
        notifyAddressesChanged()
        return true
      } catch {
        setError(VI.profile.address.messages.saveError)
        return false
      } finally {
        setSaving(false)
      }
    },
    [refresh, userId]
  )

  useEffect(() => {
    void refresh()
  }, [refresh])

  return {
    addresses,
    loadingList,
    saving,
    error,
    refresh,
    create,
    update,
    remove,
  }
}
