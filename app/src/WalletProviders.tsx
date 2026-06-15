import { ReactNode, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// Pusatkan semua "provider" wallet di satu tempat agar App.tsx tetap bersih.
export function WalletProviders({ children }: { children: ReactNode }) {
  // Pakai DEVNET (sesuai Anchor.toml). Untuk RPC yang lebih cepat di kelas,
  // kamu bisa ganti dengan endpoint devnet milik Helius/QuickNode di sini.
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  // Daftar wallet yang didukung. Phantom sudah cukup untuk kelas pemula.
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
