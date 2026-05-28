import { useLocation } from 'react-router-dom';
import { WalletHubContent } from '@/features/profile/components/WalletHubContent';
import { getProviderDashboardBackPath } from '@/features/profile/utils/tokenRoutes';

/**
 * Provider wallet — dashboard-style UI inside ProviderWalletLayout outlet.
 */
export default function ProviderWalletPage() {
  const { pathname } = useLocation();
  const walletBase = pathname.replace(/\/wallet(\/.*)?$/, '/wallet');
  const backPath = getProviderDashboardBackPath(pathname);

  return (
    <WalletHubContent variant="provider" walletBase={walletBase} backPath={backPath} />
  );
}
