import { useCallback, useEffect, useRef, useState } from "react"
import { message } from "antd"

import { generateQrSession } from "@/features/auth/api/auth.api"
import { getUserId } from "@/features/auth/services/tokenStorage"
import {
  fetchWsImageBlobWithRetry,
  parseImageIdFromWsBody,
} from "@/features/order/api/wsImage.api"
import { subscribeWsImageSession } from "@/features/order/services/wsImageSession.service"
import {
  appendMobileSessionParams,
  qrPayloadMatchesCurrentApi,
  qrPayloadMatchesCurrentUser,
} from "@/shared/utils/mobileQrUrl"

const MAX_MEDIA = 10
const QR_REFRESH_COOLDOWN_MS = 15 * 60 * 1000
const SESSION_TTL_MS = 10 * 60 * 1000

const QR_BASE =
  import.meta.env.VITE_MOBILE_PROVIDER_MEDIA_QR_BASE?.replace(/\/+$/, "") ||
  import.meta.env.VITE_MOBILE_CONFIRM_DELIVERY_QR_BASE?.replace(/\/+$/, "") ||
  "https://cosmate.vn/app/provider-upload-media"

type QrMediaKind = "image" | "video"

export type ProviderQrMediaItem = {
  id: string
  url: string
  kind: QrMediaKind
  mimeType: string
}

type StoredQrSession = {
  sessionToken: string
  qrValue: string
  createdAt: number
  userId: number
}

function storageKey(): string {
  return "cosmate_provider_create_costume_qr"
}

function loadStoredSession(): StoredQrSession | null {
  try {
    const raw = sessionStorage.getItem(storageKey())
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredQrSession
    if (!parsed.sessionToken || !parsed.qrValue || !parsed.createdAt || !parsed.userId) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function saveStoredSession(session: StoredQrSession): void {
  sessionStorage.setItem(storageKey(), JSON.stringify(session))
}

function isSessionExpired(createdAt: number): boolean {
  return Date.now() - createdAt >= SESSION_TTL_MS
}

function getRefreshCooldownRemainingMs(createdAt: number): number {
  return Math.max(0, QR_REFRESH_COOLDOWN_MS - (Date.now() - createdAt))
}

function formatCooldownLabel(remainingMs: number): string {
  const totalSec = Math.ceil(remainingMs / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function revokeMediaUrls(items: ProviderQrMediaItem[]): void {
  items.forEach((item) => {
    if (item.url.startsWith("blob:")) {
      URL.revokeObjectURL(item.url)
    }
  })
}

function buildProviderMediaQrUrl(sessionId: string, userId: number): string {
  const url = new URL(QR_BASE)
  appendMobileSessionParams(url, sessionId)
  url.searchParams.set("userId", String(userId))
  url.searchParams.set("flow", "provider-create-costume")
  return url.toString()
}

export function useProviderMediaQrSession(active: boolean) {
  const [sessionToken, setSessionToken] = useState("")
  const [qrValue, setQrValue] = useState("")
  const [sessionLoading, setSessionLoading] = useState(false)
  const [sessionError, setSessionError] = useState("")
  const [qrCreatedAt, setQrCreatedAt] = useState(0)
  const [refreshCooldownMs, setRefreshCooldownMs] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [mediaItems, setMediaItems] = useState<ProviderQrMediaItem[]>([])
  const mediaItemsRef = useRef(mediaItems)

  mediaItemsRef.current = mediaItems

  const clearMediaItems = useCallback(() => {
    setMediaItems((prev) => {
      revokeMediaUrls(prev)
      return []
    })
  }, [])

  const removeMediaItem = useCallback((id: string) => {
    setMediaItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target?.url.startsWith("blob:")) {
        URL.revokeObjectURL(target.url)
      }
      return prev.filter((item) => item.id !== id)
    })
  }, [])

  const applySession = useCallback(
    (sessionId: string, createdAt: number, userId: number) => {
      const qr = buildProviderMediaQrUrl(sessionId, userId)
      const stored: StoredQrSession = {
        sessionToken: sessionId,
        qrValue: qr,
        createdAt,
        userId,
      }
      setSessionToken(sessionId)
      setQrValue(qr)
      setQrCreatedAt(createdAt)
      setSessionError("")
      saveStoredSession(stored)
    },
    []
  )

  const createSessionFromApi = useCallback(async (): Promise<boolean> => {
    const userId = getUserId()
    if (!userId) {
      setSessionError("Vui lòng đăng nhập lại để tạo QR.")
      return false
    }
    setSessionLoading(true)
    setSessionError("")
    try {
      const response = await generateQrSession()
      if (response.code !== 0 || !response.result?.sessionId) {
        setSessionError(response.message || "Không thể tạo QR lúc này.")
        return false
      }
      applySession(response.result.sessionId, Date.now(), userId)
      return true
    } catch {
      setSessionError("Không thể tạo QR lúc này.")
      return false
    } finally {
      setSessionLoading(false)
    }
  }, [applySession])

  const handleWsMessage = useCallback(async (body: string) => {
    const mediaId = parseImageIdFromWsBody(body)
    if (!mediaId) return
    if (mediaItemsRef.current.some((item) => item.id === mediaId)) return
    if (mediaItemsRef.current.length >= MAX_MEDIA) {
      message.warning(`Tối đa ${MAX_MEDIA} tệp media từ QR.`)
      return
    }

    try {
      const blob = await fetchWsImageBlobWithRetry(mediaId)
      const mimeType = blob.type || ""
      const kind: QrMediaKind = mimeType.startsWith("video/") ? "video" : "image"
      const url = URL.createObjectURL(blob)

      setMediaItems((prev) => {
        if (prev.some((item) => item.id === mediaId)) {
          URL.revokeObjectURL(url)
          return prev
        }
        if (prev.length >= MAX_MEDIA) {
          URL.revokeObjectURL(url)
          return prev
        }
        return [...prev, { id: mediaId, url, kind, mimeType }]
      })
    } catch {
      message.error("Không thể tải media từ QR. Vui lòng thử lại.")
    }
  }, [])

  const refreshSession = useCallback(() => {
    const remaining = getRefreshCooldownRemainingMs(qrCreatedAt)
    if (remaining > 0) {
      message.warning(`Bạn có thể tạo QR mới sau ${formatCooldownLabel(remaining)}.`)
      return
    }
    void createSessionFromApi()
  }, [createSessionFromApi, qrCreatedAt])

  useEffect(() => {
    if (!active) {
      setSessionToken("")
      setQrValue("")
      setSessionError("")
      setQrCreatedAt(0)
      setRefreshCooldownMs(0)
      setIsListening(false)
      clearMediaItems()
      return
    }

    void (async () => {
      setSessionLoading(true)
      try {
        const stored = loadStoredSession()
        const currentUserId = getUserId()
        const storedValid =
          stored &&
          currentUserId &&
          !isSessionExpired(stored.createdAt) &&
          qrPayloadMatchesCurrentApi(stored.qrValue) &&
          stored.userId === currentUserId &&
          qrPayloadMatchesCurrentUser(stored.qrValue, currentUserId)

        if (storedValid) {
          setSessionToken(stored.sessionToken)
          setQrValue(stored.qrValue)
          setQrCreatedAt(stored.createdAt)
          setSessionError("")
          return
        }

        if (stored) {
          sessionStorage.removeItem(storageKey())
        }

        await createSessionFromApi()
      } finally {
        setSessionLoading(false)
      }
    })()
  }, [active, clearMediaItems, createSessionFromApi])

  useEffect(() => {
    if (!active || !qrCreatedAt) {
      setRefreshCooldownMs(0)
      return
    }
    const tick = () => setRefreshCooldownMs(getRefreshCooldownRemainingMs(qrCreatedAt))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [active, qrCreatedAt])

  useEffect(() => {
    if (!active || !sessionToken || !qrCreatedAt) return
    if (isSessionExpired(qrCreatedAt)) {
      setSessionError("QR đã hết hạn. Vui lòng tạo QR mới.")
      setSessionToken("")
      setQrValue("")
      return
    }

    const expiryTimer = setTimeout(() => {
      setSessionError("QR đã hết hạn. Vui lòng tạo QR mới.")
      setSessionToken("")
      setQrValue("")
    }, Math.max(0, qrCreatedAt + SESSION_TTL_MS - Date.now()))

    return () => clearTimeout(expiryTimer)
  }, [active, sessionToken, qrCreatedAt])

  useEffect(() => {
    if (!active || !sessionToken) {
      setIsListening(false)
      return
    }
    setIsListening(true)
    const unsubscribe = subscribeWsImageSession(sessionToken, (body) => {
      void handleWsMessage(body)
    })
    return () => {
      unsubscribe()
      setIsListening(false)
    }
  }, [active, handleWsMessage, sessionToken])

  useEffect(() => {
    return () => revokeMediaUrls(mediaItemsRef.current)
  }, [])

  return {
    qrValue,
    sessionLoading,
    sessionError,
    refreshSession,
    canRefreshQr: refreshCooldownMs <= 0 && !sessionLoading,
    refreshCooldownLabel:
      refreshCooldownMs > 0 ? formatCooldownLabel(refreshCooldownMs) : null,
    isListening,
    mediaItems,
    imageItems: mediaItems.filter((item) => item.kind === "image"),
    videoItems: mediaItems.filter((item) => item.kind === "video"),
    clearMediaItems,
    removeMediaItem,
    maxMedia: MAX_MEDIA,
  }
}
