/**
 * Path helpers for provider subscription / profile gates.
 */

/** Any provider portal route that should require an active subscription. */
export function isProviderDashboardPath(pathname: string): boolean {
  return (
    pathname.startsWith('/provider-rental') ||
    pathname.startsWith('/provider-photograph') ||
    pathname.startsWith('/provider-event-staff') ||
    pathname.startsWith('/provider/reviews') ||
    pathname.startsWith('/provider/settings') ||
    pathname.startsWith('/provider/messages')
  );
}

/** Settings / profile completion — allowed while verified but profile incomplete. */
export function isProviderProfileSettingsPath(pathname: string): boolean {
  return pathname.includes('/settings');
}

export function getProviderSettingsCompletionPath(pathname: string): string {
  if (pathname.startsWith('/provider-photograph')) {
    return '/provider-photograph/settings/completion';
  }
  if (pathname.startsWith('/provider-event-staff')) {
    return '/provider-event-staff/settings/completion';
  }
  return '/provider/settings/completion';
}
