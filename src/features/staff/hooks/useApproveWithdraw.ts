import { useState, useCallback } from 'react'
import { message } from 'antd'
import * as withdrawApi from '@/features/profile/api/withdraw.api'
import { VI } from '@/shared/i18n/vi'

interface UseApproveWithdrawResult {
  approvingId: number | null
  approveWithdraw: (id: number) => Promise<void>
}

export function useApproveWithdraw(onSuccess?: () => void): UseApproveWithdrawResult {
  const [approvingId, setApprovingId] = useState<number | null>(null)

  const approveWithdraw = useCallback(async (id: number) => {
    setApprovingId(id)
    try {
      const response = await withdrawApi.approveWithdraw(id)
      if (response.code === 0) {
        message.success(VI.staff.withdraw.approveSuccess)
        onSuccess?.()
      } else {
        message.error(response.message || VI.staff.withdraw.approveError)
      }
    } catch (err) {
      console.error('Approve withdraw failed:', err)
      message.error(VI.staff.withdraw.approveError)
    } finally {
      setApprovingId(null)
    }
  }, [onSuccess])

  return { approvingId, approveWithdraw }
}
