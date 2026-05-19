import { useCallback, useEffect, useRef, useState } from "react"
import { message } from "antd"

import { generateQrSession } from "../api/auth.api"
import { buildQrLoginUrl } from "../constants/qrLogin"
import { subscribeQrLoginSession } from "../services/qrLoginSocket.service"
import { saveAuth, getRoles } from "../services/tokenStorage"
import { parseQrLoginWsPayload } from "../utils/parseQrLoginWsPayload"
import type { QrLoginSessionStatus } from "../types"
import { extractApiErrorMessage } from "@/shared/utils/apiError"
import { VI } from "@/shared/i18n/vi"

/** Align with BE Tokens.expires_at (qr-generate = now + 10 min) */
const SESSION_TTL_MS = 10 * 60 * 1000
const WAIT_HINT_MS = 2 * 60 * 1000

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
 * QR login: GET /api/auth/qr-generate → QR + WS `/topic/qr/{sessionId}`.
 * Mobile: POST /api/auth/qr-approve → BE emits { event: "qr_approved", accessToken }.
 */
export function useQrLoginSession({ active, onApproved }: UseQrLoginSessionOptions) {
  const [sessionId, setSessionId] = useState("")
  const [qrValue, setQrValue] = useState("")
  const [status, setStatus] = useState<QrLoginSessionStatus | "IDLE">("IDLE")
  const [expiresAtMs, setExpiresAtMs] = useState(0)
  const [countdownSec, setCountdownSec] = useState(0)
  const [sessionError, setSessionError] = useState("")
  const [sessionLoading, setSessionLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [wsConnectFailed, setWsConnectFailed] = useState(false)
  const [showWaitHint, setShowWaitHint] = useState(false)
  const sessionIdRef = useRef("")
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

  const startSession = useCallback(async () => {
    approvedRef.current = false
    setSessionLoading(true)
    setSessionError("")
    setWsConnectFailed(false)
    setShowWaitHint(false)
    setStatus("IDLE")

    try {
      const response = await generateQrSession()
      if (response.code !== 0 || !response.result?.sessionId) {
        setSessionError(response.message || VI.auth.qrLogin.messages.sessionFailed)
        return
      }

      const id = response.result.sessionId
      const expiresMs = Date.now() + SESSION_TTL_MS

      sessionIdRef.current = id
      setSessionId(id)
      setQrValue(buildQrLoginUrl(id))
      setExpiresAtMs(expiresMs)
      setCountdownSec(Math.ceil(SESSION_TTL_MS / 1000))
      setStatus("PENDING")
    } catch (err) {
      setSessionError(
        extractApiErrorMessage(err, VI.auth.qrLogin.messages.sessionFailed)
      )
    } finally {
      setSessionLoading(false)
    }
  }, [])

  const refreshSession = useCallback(() => {
    void startSession()
  }, [startSession])

  useEffect(() => {
    if (!active) {
      sessionIdRef.current = ""
      approvedRef.current = false
      setSessionId("")
      setQrValue("")
      setExpiresAtMs(0)
      setCountdownSec(0)
      setStatus("IDLE")
      setSessionError("")
      setWsConnectFailed(false)
      setShowWaitHint(false)
      setIsListening(false)
      return
    }

    void startSession()
  }, [active, startSession])

  useEffect(() => {
    if (!active || status !== "PENDING" || !sessionId) {
      setShowWaitHint(false)
      return
    }

    const id = setTimeout(() => setShowWaitHint(true), WAIT_HINT_MS)
    return () => clearTimeout(id)
  }, [active, status, sessionId])

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
    if (!active || !sessionId || status !== "PENDING") {
      setIsListening(false)
      return
    }

    setIsListening(true)
    setWsConnectFailed(false)

    let connectErrorTimer: ReturnType<typeof setTimeout> | undefined

    const unsubscribe = subscribeQrLoginSession(
      sessionId,
      (body) => {
        handleWsMessage(body)
      },
      () => {
        connectErrorTimer = setTimeout(() => {
          setWsConnectFailed(true)
          setSessionError(VI.auth.qrLogin.messages.wsConnectFailed)
        }, 4000)
      }
    )

    return () => {
      clearTimeout(connectErrorTimer)
      unsubscribe()
      setIsListening(false)
    }
  }, [active, sessionId, status, handleWsMessage])

  return {
    qrValue,
    sessionLoading,
    status,
    countdownLabel: formatCountdown(countdownSec),
    sessionError,
    refreshSession,
    isWaiting: status === "PENDING" && !!qrValue && !sessionLoading,
    isListening,
    wsConnectFailed,
    showWaitHint,
  }
}
