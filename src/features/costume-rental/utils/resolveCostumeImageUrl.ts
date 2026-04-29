/**
 * Builds a browser-loadable URL for costume images.
 * Backend often returns relative paths; <img> resolves those against the Vite origin, not the API.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export function resolveCostumeImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_BASE}${url}`
}
