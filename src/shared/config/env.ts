/**
 * Centralized Vite env accessors (VITE_* only).
 * Payment returnUrl → getApiBaseUrl(); post-payment FE redirect hint → getAppBaseUrl().
 */

const DEFAULT_API_BASE = 'https://api.cosmate.site';

function trimTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, '');
}

function readEnvString(key: string): string {
  const raw = import.meta.env[key];
  if (typeof raw !== 'string') return '';
  return raw.trim();
}

/** BE API origin — axios, MoMo/VNPay callback returnUrl */
export function getApiBaseUrl(): string {
  const fromEnv = readEnvString('VITE_API_BASE_URL');
  const base = trimTrailingSlashes(fromEnv || DEFAULT_API_BASE);

  if (import.meta.env.PROD && /localhost|127\.0\.0\.1/i.test(base)) {
    console.warn(
      '[env] VITE_API_BASE_URL points to localhost in production build.',
      'Payment returnUrl may be wrong. Set .env.production or hosting env vars.'
    );
  }

  return base;
}

/**
 * Public FE origin — BE redirect after payment, absolute redirect params.
 * Build-time: VITE_APP_BASE_URL. Runtime fallback: window.location.origin (browser only).
 */
export function getAppBaseUrl(): string {
  const fromEnv = readEnvString('VITE_APP_BASE_URL');
  if (fromEnv) {
    return trimTrailingSlashes(fromEnv);
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlashes(window.location.origin);
  }
  return '';
}

/**
 * Turn app path or URL into absolute URL using VITE_APP_BASE_URL.
 * - `/rent/checkout` → `{appBase}/rent/checkout`
 * - `https://...` → unchanged
 */
export function resolveAppPath(pathOrUrl: string): string {
  const input = pathOrUrl.trim();
  if (!input) return '';

  if (/^https?:\/\//i.test(input)) {
    return input;
  }

  const appBase = getAppBaseUrl();
  if (!appBase) {
    return input.startsWith('/') ? input : `/${input}`;
  }

  const path = input.startsWith('/') ? input : `/${input}`;
  return `${appBase}${path}`;
}
