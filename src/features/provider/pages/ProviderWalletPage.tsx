/**
 * Provider Wallet Page
 * Fixed wrapper that uses VI.wallet.* (top-level) instead of VI.profile.wallet.*
 * Navigation links are derived from current location so they work for any provider type.
 */
import { useLocation } from "react-router-dom";
import WalletPage from "@/features/profile/pages/WalletPage";

export default function ProviderWalletPage() {
  const location = useLocation();

  // Derive wallet base path from current URL
  // e.g. /provider-photograph/wallet -> /provider-photograph/wallet
  const walletBase = location.pathname.replace(/\/wallet(\/.*)?$/, "/wallet");

  return <WalletPage walletBase={walletBase} />;
}
