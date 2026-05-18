import { getAuth } from "@/features/auth/services/tokenStorage"

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "")

const IMAGE_FILE_EXTENSION = /\.(jpe?g|png|gif|webp|heic|bmp)$/i

/** Strip .jpg / .png etc. — BE view path must not include file extension. */
export function normalizeImageIdForView(imageId: string): string {
  return imageId.trim().replace(IMAGE_FILE_EXTENSION, "")
}

/** BE pushes STOMP body: `/ws-image/view/{imageId}` (may include extension; FE normalizes). */
export function parseImageIdFromWsBody(body: string): string | null {
  let path = body.trim()
  if (path.startsWith('"') && path.endsWith('"')) {
    path = path.slice(1, -1)
  }

  const prefix = "/ws-image/view/"
  if (path.startsWith(prefix)) {
    const raw = path.slice(prefix.length).trim()
    if (!raw) return null
    return normalizeImageIdForView(raw)
  }

  return null
}

function assertSafeImageId(imageId: string): string {
  const id = normalizeImageIdForView(imageId)
  if (!id || id.includes("/") || id.includes("..")) {
    throw new Error("Invalid image id")
  }
  return id
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const text = await response.text()
    if (!text) return response.statusText
    try {
      const json = JSON.parse(text) as { message?: string }
      return json.message || text
    } catch {
      return text
    }
  } catch {
    return response.statusText
  }
}

/**
 * Load temp image from BE disk via GET /ws-image/view/{id}.
 * Uses fetch (not axios) to avoid blob error noise in global interceptor.
 */
export async function fetchWsImageBlob(imageId: string): Promise<Blob> {
  const id = assertSafeImageId(imageId)
  const auth = getAuth()
  const headers: HeadersInit = {}
  if (auth?.token) {
    headers.Authorization = `${auth.tokenType || "Bearer"} ${auth.token}`
  }

  const response = await fetch(`${API_BASE}/ws-image/view/${id}`, { headers })

  if (!response.ok) {
    const detail = await readErrorMessage(response)
    throw new Error(detail || `HTTP ${response.status}`)
  }

  const blob = await response.blob()
  if (blob.type.includes("json")) {
    const detail = await blob.text()
    throw new Error(detail || "Invalid image response")
  }

  return blob
}

export async function fetchWsImageBlobWithRetry(
  imageId: string,
  attempts = 3,
  delayMs = 400
): Promise<Blob> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchWsImageBlob(imageId)
    } catch (err) {
      lastError = err
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)))
      }
    }
  }
  throw lastError
}
