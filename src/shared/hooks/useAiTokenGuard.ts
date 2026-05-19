import * as React from "react"
import { message } from "antd"
import { useNavigate } from "react-router-dom"

import { useUserProfile } from "@/app/providers/UserProfileProvider"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { getWalletInfo } from "@/features/profile/api/wallet.api"
import { isInsufficientTokenError, TOKEN_INSUFFICIENT_EVENT } from "@/shared/utils/tokenErrors"

interface UseAiTokenGuardOptions {
  onInsufficientToken?: () => void
}

export function useAiTokenGuard({ onInsufficientToken }: UseAiTokenGuardOptions = {}) {
  const navigate = useNavigate()
  const { tokenBalance, setTokenBalance } = useUserProfile()
  const [refreshingBalance, setRefreshingBalance] = React.useState(false)

  const refreshTokenBalance = React.useCallback(async () => {
    const userId = getUserId()
    if (!userId) return null

    setRefreshingBalance(true)
    try {
      const wallet = await getWalletInfo(userId)
      const nextBalance = wallet?.result?.balance ?? wallet?.result?.depositBalance ?? null
      setTokenBalance(typeof nextBalance === "number" ? nextBalance : null)
      return typeof nextBalance === "number" ? nextBalance : null
    } catch {
      return null
    } finally {
      setRefreshingBalance(false)
    }
  }, [setTokenBalance])

  const handleTokenError = React.useCallback(
    async (error: unknown) => {
      if (!isInsufficientTokenError(error)) return false

      message.warning("Số dư token không đủ để thực hiện hành động này.")
      await refreshTokenBalance()
      onInsufficientToken?.()
      window.dispatchEvent(new CustomEvent(TOKEN_INSUFFICIENT_EVENT))
      return true
    },
    [onInsufficientToken, refreshTokenBalance],
  )

  const goToTopUp = React.useCallback(() => {
    navigate("/profile/wallet")
  }, [navigate])

  return {
    tokenBalance,
    refreshingBalance,
    refreshTokenBalance,
    handleTokenError,
    goToTopUp,
  }
}

export function useTokenCheck(requiredTokens: number, onInsufficientToken?: () => void) {
  const { tokenBalance, refreshingBalance, refreshTokenBalance } = useAiTokenGuard({ onInsufficientToken })

  const checkTokens = React.useCallback(async () => {
    const current = typeof tokenBalance === "number" ? tokenBalance : await refreshTokenBalance()
    return typeof current === "number" && current >= requiredTokens
  }, [refreshTokenBalance, requiredTokens, tokenBalance])

  const getMissingTokens = React.useCallback(() => {
    const current = typeof tokenBalance === "number" ? tokenBalance : null
    if (current === null) return requiredTokens
    return Math.max(requiredTokens - current, 0)
  }, [requiredTokens, tokenBalance])

  return { tokenBalance, refreshingBalance, checkTokens, getMissingTokens, refreshTokenBalance }
}
