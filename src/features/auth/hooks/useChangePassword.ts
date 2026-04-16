import { useState, useCallback } from 'react'
import { message } from 'antd'
import { changePassword as changePasswordService } from '@/services/authService'
import { getUserId } from '@/features/auth/services/tokenStorage'
import { VI } from '@/shared/i18n/vi'

interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

export function useChangePassword() {
  const [loading, setLoading] = useState(false)

  const mutate = useCallback(async (payload: ChangePasswordPayload): Promise<boolean> => {
    const userId = getUserId()
    if (!userId) {
      message.error(VI.auth.changePassword.error.notAuthenticated)
      return false
    }

    setLoading(true)
    try {
      await changePasswordService(userId, payload)
      message.success(VI.auth.changePassword.success)
      return true
    } catch {
      message.error(VI.auth.changePassword.error.failed)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return { mutate, loading }
}
