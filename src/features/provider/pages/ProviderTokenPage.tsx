import { useLocation } from 'react-router-dom';
import { TokenHubContent } from '@/features/profile/components/TokenHubContent';
import {
  getProviderDashboardBackPath,
  getWalletTopUpRedirectForToken,
} from '@/features/profile/utils/tokenRoutes';

export default function ProviderTokenPage() {
  const { pathname } = useLocation();
  return (
    <TokenHubContent
      variant="provider"
      backPath={getProviderDashboardBackPath(pathname)}
      walletTopUpRedirect={getWalletTopUpRedirectForToken(pathname)}
    />
  );
}
