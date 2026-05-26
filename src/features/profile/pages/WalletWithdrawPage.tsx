import { useLocation } from 'react-router-dom';
import { WalletWithdrawHubContent } from '../components/WalletWithdrawHubContent';
import { isProviderWalletPath } from '../utils/walletRoutes';

export default function WalletWithdrawPage() {
  const location = useLocation();
  const walletBase = location.pathname.replace(/\/withdraw\/?$/, '');
  const variant = isProviderWalletPath(location.pathname) ? 'provider' : 'cosplayer';

  return <WalletWithdrawHubContent variant={variant} walletBase={walletBase} />;
}
