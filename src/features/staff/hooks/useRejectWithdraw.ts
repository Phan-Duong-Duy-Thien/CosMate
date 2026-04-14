import { useState, useCallback } from 'react'
import { message } from 'antd'
import * as withdrawApi from '@/features/profile/api/withdraw.api'
import { VI } from '@/shared/i18n/vi'

interface UseRejectWithdrawResult {
  rejectingId: number | null
  rejectWithdraw: (id: number, reason: string) => Promise<void>
}

export function useRejectWithdraw(onSuccess?: () => void): UseRejectWithdrawResult {
  const [rejectingId, setRejectingId] = useState<number | null>(null)

  const rejectWithdraw = useCallback(async (id: number, reason: string) => {
    setRejectingId(id)
    try {
      const response = await withdrawApi.rejectWithdraw(id, reason)
      if (response.code === 0) {
        message.success(VI.staff.withdraw.rejectSuccess)
        onSuccess?.()
      } else {
        message.error(response.message || VI.staff.withdraw.rejectError)
      }
    } catch (err) {
      console.error('Reject withdraw failed:', err)
      message.error(VI.staff.withdraw.rejectError)
    } finally {
      setRejectingId(null)
    }
  }, [onSuccess])

  return { rejectingId, rejectWithdraw }
}
