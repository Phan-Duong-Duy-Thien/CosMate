import { useCallback, useEffect, useRef, useState } from "react"
import { message } from "antd"

import { getQrLoginStatus } from "../api/auth.api"
import { buildQrLoginUrl } from "../constants/qrLogin"
import { saveAuth, getRoles } from "../services/tokenStorage"
import type { LoginResult, QrLoginSessionStatus } from "../types"
import { VI } from "@/shared/i18n/vi"

const POLL_INTERVAL_MS = 2000
const SESSION_TTL_MS = 2 * 60 * 1000

function createLocalSessionToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `qr-login-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function resolveLoginResult(statusResult: {
  token?: string
  accessToken?: string
  tokenType?: string
  result?: LoginResult
}): LoginResult | null {
  if (statusResult.result?.token) {
    return statusResult.result
  }
  const token = statusResult.accessToken || statusResult.token
  if (!token) return null
  return {
    token,
    tokenType: statusResult.tokenType || "Bearer",
  }
}

function formatCountdown(remainingSec: number): string {
  const sec = Math.max(0, remainingSec)
  const min = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(min).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

type UseQrLoginSessionOptions = {
  active: boolean
  onApproved?: (roles: string[]) => void
}

/**
 * QR login: web generates sessionToken (same pattern as confirm-delivery).
 * Mobile approves via BE with that token; web polls status until APPROVED.
 */
export function useQrLoginSession({ active, onApproved }: UseQrLoginSessionOptions) {
  const [loginSessionToken, setLoginSessionToken] = useState("")
  const [qrValue, setQrValue] = useState("")
  const [status, setStatus] = useState<QrLoginSessionStatus | "IDLE">("IDLE")
  const [expiresAtMs, setExpiresAtMs] = useState(0)
  const [countdownSec, setCountdownSec] = useState(0)
  const [sessionError, setSessionError] = useState("")
  const tokenRef = useRef("")
  const approvedRef = useRef(false)
  const onApprovedRef = useRef(onApproved)
  onApprovedRef.current = onApproved

  const applyLocalSession = useCallback(() => {
    approvedRef.current = false
    setSessionError("")

    const token = createLocalSessionToken()
    const expiresMs = Date.now() + SESSION_TTL_MS

    tokenRef.current = token
    setLoginSessionToken(token)
    setQrValue(buildQrLoginUrl(token))
    setExpiresAtMs(expiresMs)
    setCountdownSec(Math.ceil(SESSION_TTL_MS / 1000))
    setStatus("PENDING")
  }, [])

  const refreshSession = useCallback(() => {
    applyLocalSession()
  }, [applyLocalSession])

  useEffect(() => {
    if (!active) {
      tokenRef.current = ""
      approvedRef.current = false
      setLoginSessionToken("")
      setQrValue("")
      setExpiresAtMs(0)
      setCountdownSec(0)
      setStatus("IDLE")
      setSessionError("")
      return
    }

    applyLocalSession()
  }, [active, applyLocalSession])

  useEffect(() => {
    if (!active || !expiresAtMs) return

    const tick = () => {
      const remaining = Math.ceil((expiresAtMs - Date.now()) / 1000)
      setCountdownSec(remaining)
      if (remaining <= 0 && status === "PENDING") {
        setStatus("EXPIRED")
      }
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [active, expiresAtMs, status])

  useEffect(() => {
    if (!active || !loginSessionToken || status !== "PENDING") return

    let cancelled = false

    const poll = async () => {
      try {
        const response = await getQrLoginStatus(loginSessionToken)
        if (cancelled || response.code !== 0) return

        const nextStatus = response.result.status
        if (nextStatus === "EXPIRED" || nextStatus === "CANCELLED") {
          setStatus(nextStatus)
          return
        }

        if (nextStatus === "APPROVED") {
          const auth = resolveLoginResult(response.result)
          if (!auth?.token) {
            setSessionError(VI.auth.qrLogin.messages.approvedNoToken)
            return
          }

          if (approvedRef.current) return
          approvedRef.current = true

          saveAuth(auth, true)
          setStatus("APPROVED")
          message.success(VI.auth.login.messages.loginSuccess)
          onApprovedRef.current?.(getRoles())
        }
      } catch {
        // Keep polling until client-side TTL expires
      }
    }

    void poll()
    const id = setInterval(() => {
      void poll()
    }, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [active, loginSessionToken, status])

  return {
    qrValue,
    sessionLoading: false,
    status,
    countdownLabel: formatCountdown(countdownSec),
    sessionError,
    refreshSession,
    isWaiting: status === "PENDING" && !!qrValue,
  }
}
