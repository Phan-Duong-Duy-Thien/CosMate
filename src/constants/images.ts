/**
 * Central image URL resolver.
 *
 * Backend often returns relative paths (e.g. "firebase-storage/mock/image.jpg"
 * or "/uploads/chat/abc.jpg") instead of full URLs. This helper prefixes them
 * with the API base URL so the browser can resolve them correctly.
 *
 * - Full http(s) URLs → returned as-is
 * - Blob URLs (optimistic preview) → returned as-is
 * - Relative paths    → prefixed with API_BASE_URL
 * - null / empty     → returns empty string
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.cosmate.site"

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return ""
  // Full URLs and blob URLs (optimistic preview) — return as-is
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:")
  )
    return url
  return `${API_BASE_URL}${url}`
}
