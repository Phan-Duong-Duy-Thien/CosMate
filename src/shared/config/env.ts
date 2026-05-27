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

const DEFAULT_GHN_API_BASE = '/ghn-proxy';

/** GHN Open API base — dev: Vite proxy `/ghn-proxy`; prod: set explicit URL or reverse-proxy path. */
export function getGhnApiBase(): string {
  const fromEnv = readEnvString('VITE_GHN_API_BASE');
  return trimTrailingSlashes(fromEnv || DEFAULT_GHN_API_BASE);
}

/**
 * Production builds must not call default `/ghn-proxy` without `VITE_GHN_API_BASE`
 * (static host returns SPA HTML → JSON parse errors).
 */
export function isGhnApiBaseValidForBuild(): boolean {
  if (!import.meta.env.PROD) {
    return true;
  }

  const fromEnv = readEnvString('VITE_GHN_API_BASE');
  const base = getGhnApiBase();
  const isRelative = base.startsWith('/');

  if (isRelative && !fromEnv) {
    return false;
  }

  return true;
}

export function getGhnToken(): string {
  return readEnvString('VITE_GHN_TOKEN');
}

export function getGhnShopId(): string {
  return readEnvString('VITE_GHN_SHOP_ID');
}

export type GhnConfigStatus = 'ok' | 'missing_credentials' | 'proxy_misconfigured';

export function getGhnConfigStatus(): GhnConfigStatus {
  if (!getGhnToken() || !getGhnShopId()) {
    return 'missing_credentials';
  }
  if (!isGhnApiBaseValidForBuild()) {
    return 'proxy_misconfigured';
  }
  return 'ok';
}

const DEFAULT_GEOVINA_API_BASE = '/geovina-proxy';

export function getGeovinaApiBase(): string {
  const fromEnv = readEnvString('VITE_GEOVINA_API_BASE');
  return trimTrailingSlashes(fromEnv || DEFAULT_GEOVINA_API_BASE);
}

export function isGeovinaApiBaseValidForBuild(): boolean {
  if (!import.meta.env.PROD) {
    return true;
  }

  const fromEnv = readEnvString('VITE_GEOVINA_API_BASE');
  const base = getGeovinaApiBase();
  const isRelative = base.startsWith('/');

  if (isRelative && !fromEnv) {
    return false;
  }

  return true;
}

export function getGeovinaApiKey(): string {
  return readEnvString('VITE_GEOVINA_API_KEY');
}

export function isGeovinaConfigured(): boolean {
  if (!getGeovinaApiKey()) {
    return false;
  }
  return isGeovinaApiBaseValidForBuild();
}
