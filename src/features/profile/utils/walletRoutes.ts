/** True when wallet flows run under a provider dashboard path. */
export function isProviderWalletPath(pathname: string): boolean {
  return (
    pathname.startsWith('/provider-rental') ||
    pathname.startsWith('/provider-photograph') ||
    pathname.startsWith('/provider-event-staff')
  );
}
