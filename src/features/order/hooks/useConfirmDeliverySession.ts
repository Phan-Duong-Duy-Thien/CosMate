import { useCallback, useEffect, useRef, useState } from "react"
import { message } from "antd"

import { generateQrSession } from "@/features/auth/api/auth.api"
import { getUserId } from "@/features/auth/services/tokenStorage"
import { fetchWsImageBlobWithRetry, parseImageIdFromWsBody } from "../api/wsImage.api"
import { buildConfirmDeliveryQrUrl } from "../constants/confirmDeliveryQr"
import { confirmDeliveryOrder } from "../services/order.service"
import { subscribeWsImageSession } from "../services/wsImageSession.service"
import { extractApiErrorMessage } from "@/shared/utils/apiError"
import {
  qrPayloadMatchesCurrentApi,
  qrPayloadMatchesCurrentUser,
} from "@/shared/utils/mobileQrUrl"
import { VI } from "@/shared/i18n/vi"

const MAX_IMAGES = 5
/** Min interval between creating a new QR for the same order */
const QR_REFRESH_COOLDOWN_MS = 15 * 60 * 1000
/** Align with BE qr-generate TTL (~10 min) */
const SESSION_TTL_MS = 10 * 60 * 1000

type StoredQrSession = {
  sessionToken: string
  qrValue: string
  createdAt: number
  userId: number
}

function qrSessionStorageKey(orderId: number): string {
  return `cosmate_confirm_delivery_qr_${orderId}`
}

function loadStoredQrSession(orderId: number): StoredQrSession | null {
  try {
    const raw = sessionStorage.getItem(qrSessionStorageKey(orderId))
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

function saveStoredQrSession(orderId: number, session: StoredQrSession): void {
  sessionStorage.setItem(qrSessionStorageKey(orderId), JSON.stringify(session))
}

function getRefreshCooldownRemainingMs(createdAt: number): number {
  return Math.max(0, QR_REFRESH_COOLDOWN_MS - (Date.now() - createdAt))
}

function isSessionExpired(createdAt: number): boolean {
  return Date.now() - createdAt >= SESSION_TTL_MS
}

function formatCooldownLabel(remainingMs: number): string {
  const totalSec = Math.ceil(remainingMs / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function revokePreviewUrls(images: ConfirmDeliveryPreviewImage[]): void {
  images.forEach((img) => {
    if (img.url.startsWith("blob:")) {
      URL.revokeObjectURL(img.url)
    }
  })
}

export type ConfirmDeliveryPreviewImage = {
  id: string
  url: string
}

type UseConfirmDeliverySessionOptions = {
  orderId: number
  open: boolean
}

/**
 * QR session (sessionId from BE qr-generate) + STOMP `/topic/ws-image/{sessionId}`
 * → fetch preview via GET `/ws-image/view/{id}`.
 */
export function useConfirmDeliverySession({ orderId, open }: UseConfirmDeliverySessionOptions) {
  const [sessionToken, setSessionToken] = useState("")
  const [qrValue, setQrValue] = useState("")
  const [previewImages, setPreviewImages] = useState<ConfirmDeliveryPreviewImage[]>([])
  const [isListening, setIsListening] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [sessionError, setSessionError] = useState("")
  const [qrCreatedAt, setQrCreatedAt] = useState(0)
  const [refreshCooldownMs, setRefreshCooldownMs] = useState(0)
  const [isConfirming, setIsConfirming] = useState(false)
  const previewImagesRef = useRef(previewImages)
  const createSessionFromApiRef = useRef<() => Promise<boolean>>(async () => false)

  previewImagesRef.current = previewImages

  const clearPreviewImages = useCallback(() => {
    setPreviewImages((prev) => {
      revokePreviewUrls(prev)
      return []
    })
  }, [])

  const applySession = useCallback(
    (sessionId: string, createdAt: number, userId: number) => {
      const qr = buildConfirmDeliveryQrUrl(sessionId, orderId, userId)
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
      clearPreviewImages()
      saveStoredQrSession(orderId, stored)
      return stored
    },
    [clearPreviewImages, orderId]
  )

  const restoreStoredSession = useCallback(
    (stored: StoredQrSession) => {
      setSessionToken(stored.sessionToken)
      setQrValue(stored.qrValue)
      setQrCreatedAt(stored.createdAt)
      setSessionError("")
    },
    []
  )

  const createSessionFromApi = useCallback(async (): Promise<boolean> => {
    const userId = getUserId()
    if (!userId) {
      setSessionError(VI.profile.orders.confirmDeliveryQr.sessionOwnerRequired)
      return false
    }

    setSessionLoading(true)
    setSessionError("")
    try {
      const response = await generateQrSession()
      if (response.code !== 0 || !response.result?.sessionId) {
        setSessionError(
          response.message || VI.profile.orders.confirmDeliveryQr.sessionFailed
        )
        return false
      }

      applySession(response.result.sessionId, Date.now(), userId)
      return true
    } catch (err) {
      setSessionError(
        extractApiErrorMessage(err, VI.profile.orders.confirmDeliveryQr.sessionFailed)
      )
      return false
    } finally {
      setSessionLoading(false)
    }
  }, [applySession])

  createSessionFromApiRef.current = createSessionFromApi

  const handleWsImageMessage = useCallback(async (body: string) => {
    const imageId = parseImageIdFromWsBody(body)
    if (!imageId) {
      console.warn("[confirmDelivery] Unrecognized WS payload:", body)
      return
    }

    if (previewImagesRef.current.some((img) => img.id === imageId)) {
      return
    }

    if (previewImagesRef.current.length >= MAX_IMAGES) {
      message.warning(VI.profile.orders.confirmDeliveryQr.tooManyImages)
      return
    }

    try {
      const blob = await fetchWsImageBlobWithRetry(imageId)
      const url = URL.createObjectURL(blob)

      setPreviewImages((prev) => {
        if (prev.some((img) => img.id === imageId)) {
          URL.revokeObjectURL(url)
          return prev
        }
        if (prev.length >= MAX_IMAGES) {
          URL.revokeObjectURL(url)
          return prev
        }
        return [...prev, { id: imageId, url }]
      })
    } catch (err) {
      const detail = err instanceof Error ? err.message : ""
      console.warn("[confirmDelivery] Failed to load ws-image:", imageId, detail)
      message.error(
        detail
          ? `${VI.profile.orders.confirmDeliveryQr.imageLoadFailed} (${detail})`
          : VI.profile.orders.confirmDeliveryQr.imageLoadFailed
      )
    }
  }, [])

  const refreshSession = useCallback(() => {
    if (!orderId) return

    const remaining = getRefreshCooldownRemainingMs(qrCreatedAt)
    if (remaining > 0) {
      message.warning(
        VI.profile.orders.confirmDeliveryQr.refreshQrCooldown(formatCooldownLabel(remaining))
      )
      return
    }

    void createSessionFromApi()
  }, [createSessionFromApi, orderId, qrCreatedAt])

  useEffect(() => {
    if (!open || !orderId) {
      setSessionToken("")
      setQrValue("")
      clearPreviewImages()
      setQrCreatedAt(0)
      setRefreshCooldownMs(0)
      setSessionError("")
      setIsListening(false)
      return
    }

    void (async () => {
      setSessionLoading(true)
      try {
        const stored = loadStoredQrSession(orderId)

        const currentUserId = getUserId()
        const storedValid =
          stored &&
          currentUserId &&
          !isSessionExpired(stored.createdAt) &&
          qrPayloadMatchesCurrentApi(stored.qrValue) &&
          stored.userId === currentUserId &&
          qrPayloadMatchesCurrentUser(stored.qrValue, currentUserId)

        if (storedValid) {
          restoreStoredSession(stored)
          return
        }

        if (stored) {
          sessionStorage.removeItem(qrSessionStorageKey(orderId))
        }

        await createSessionFromApiRef.current()
      } finally {
        setSessionLoading(false)
      }
    })()
  }, [open, orderId, clearPreviewImages, restoreStoredSession])

  useEffect(() => {
    if (!open || !qrCreatedAt) {
      setRefreshCooldownMs(0)
      return
    }

    const tick = () => setRefreshCooldownMs(getRefreshCooldownRemainingMs(qrCreatedAt))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [open, qrCreatedAt])

  useEffect(() => {
    if (!open || !sessionToken || !qrCreatedAt) {
      return
    }

    if (isSessionExpired(qrCreatedAt)) {
      setSessionError(VI.profile.orders.confirmDeliveryQr.sessionExpired)
      setSessionToken("")
      setQrValue("")
      return
    }

    const expiryTimer = setTimeout(() => {
      setSessionError(VI.profile.orders.confirmDeliveryQr.sessionExpired)
      setSessionToken("")
      setQrValue("")
    }, Math.max(0, qrCreatedAt + SESSION_TTL_MS - Date.now()))

    return () => clearTimeout(expiryTimer)
  }, [open, sessionToken, qrCreatedAt])

  useEffect(() => {
    if (!open || !sessionToken) {
      setIsListening(false)
      return
    }

    setIsListening(true)
    const unsubscribe = subscribeWsImageSession(sessionToken, (body) => {
      void handleWsImageMessage(body)
    })

    return () => {
      unsubscribe()
      setIsListening(false)
    }
  }, [open, sessionToken, handleWsImageMessage])

  const confirmSession = useCallback(async (): Promise<boolean> => {
    if (!orderId) return false

    if (previewImages.length > MAX_IMAGES) {
      message.error(VI.profile.orders.confirmDeliveryQr.tooManyImages)
      return false
    }

    setIsConfirming(true)
    try {
      const images: File[] = []
      const notes: string[] = []

      for (const preview of previewImages) {
        const blobRes = await fetch(preview.url)
        const blob = await blobRes.blob()
        const ext = blob.type.includes("png") ? "png" : "jpg"
        images.push(
          new File([blob], `confirm-${preview.id}.${ext}`, {
            type: blob.type || "image/jpeg",
          })
        )
        notes.push("")
      }

      await confirmDeliveryOrder(orderId, images, notes)
      return true
    } catch (err) {
      message.error(
        extractApiErrorMessage(err, VI.profile.orders.toastConfirmDeliveryFailed)
      )
      return false
    } finally {
      setIsConfirming(false)
    }
  }, [orderId, previewImages])

  const canConfirm =
    previewImages.length <= MAX_IMAGES &&
    !sessionLoading &&
    !isConfirming &&
    !!sessionToken &&
    !sessionError

  const canRefreshQr = refreshCooldownMs <= 0 && !sessionLoading

  return {
    sessionToken,
    qrValue,
    previewImages,
    isListening,
    sessionLoading,
    sessionError,
    refreshSession,
    confirmSession,
    isConfirming,
    canConfirm,
    canRefreshQr,
    refreshCooldownLabel:
      refreshCooldownMs > 0 ? formatCooldownLabel(refreshCooldownMs) : null,
    maxImages: MAX_IMAGES,
  }
}
