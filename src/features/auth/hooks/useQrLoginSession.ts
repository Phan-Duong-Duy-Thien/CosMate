import { useCallback, useEffect, useRef, useState } from "react"
import { message } from "antd"

import { buildQrLoginUrl } from "../constants/qrLogin"
import { subscribeQrLoginSession } from "../services/qrLoginSocket.service"
import { saveAuth, getRoles } from "../services/tokenStorage"
import { parseQrLoginWsPayload } from "../utils/parseQrLoginWsPayload"
import type { QrLoginSessionStatus } from "../types"
import { VI } from "@/shared/i18n/vi"

const SESSION_TTL_MS = 2 * 60 * 1000

function createLocalSessionToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `qr-login-${Date.now()}-${Math.random().toString(36).slice(2)}`
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
 * QR login: web generates sessionToken → STOMP `/topic/qr-login/{sessionToken}` (no poll).
 */
export function useQrLoginSession({ active, onApproved }: UseQrLoginSessionOptions) {
  const [loginSessionToken, setLoginSessionToken] = useState("")
  const [qrValue, setQrValue] = useState("")
  const [status, setStatus] = useState<QrLoginSessionStatus | "IDLE">("IDLE")
  const [expiresAtMs, setExpiresAtMs] = useState(0)
  const [countdownSec, setCountdownSec] = useState(0)
  const [sessionError, setSessionError] = useState("")
  const [isListening, setIsListening] = useState(false)
  const tokenRef = useRef("")
  const approvedRef = useRef(false)
  const onApprovedRef = useRef(onApproved)
  onApprovedRef.current = onApproved

  const handleWsMessage = useCallback((body: string) => {
    const auth = parseQrLoginWsPayload(body)
    if (!auth?.token) {
      console.warn("[qrLogin] Unrecognized WS payload:", body)
      return
    }

    if (approvedRef.current) return
    approvedRef.current = true

    saveAuth(auth, true)
    setStatus("APPROVED")
    message.success(VI.auth.login.messages.loginSuccess)
    onApprovedRef.current?.(getRoles())
  }, [])

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
      setIsListening(false)
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
    if (!active || !loginSessionToken || status !== "PENDING") {
      setIsListening(false)
      return
    }

    setIsListening(true)
    const unsubscribe = subscribeQrLoginSession(loginSessionToken, (body) => {
      handleWsMessage(body)
    })

    return () => {
      unsubscribe()
      setIsListening(false)
    }
  }, [active, loginSessionToken, status, handleWsMessage])

  return {
    qrValue,
    sessionLoading: false,
    status,
    countdownLabel: formatCountdown(countdownSec),
    sessionError,
    refreshSession,
    isWaiting: status === "PENDING" && !!qrValue,
    isListening,
  }
}
