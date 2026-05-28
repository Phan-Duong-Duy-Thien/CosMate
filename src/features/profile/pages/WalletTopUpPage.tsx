import { useLocation, useSearchParams } from 'react-router-dom';
import { WalletTopUpHubContent } from '../components/WalletTopUpHubContent';
import { isProviderWalletPath } from '../utils/walletRoutes';

export default function WalletTopUpPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const walletBase = location.pathname.replace(/\/topup\/?$/, '');
  const redirectUrl = searchParams.get('redirect') || undefined;
  const variant = isProviderWalletPath(location.pathname) ? 'provider' : 'cosplayer';

  return (
    <WalletTopUpHubContent
      variant={variant}
      walletBase={walletBase}
      redirectUrl={redirectUrl}
    />
  );
}
