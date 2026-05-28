import { WalletHubContent } from '../components/WalletHubContent';

/** Cosplayer site wallet — anime card UI. */
export default function WalletPage() {
  return (
    <WalletHubContent
      variant="cosplayer"
      walletBase="/profile/wallet"
      backPath="/profile"
    />
  );
}
