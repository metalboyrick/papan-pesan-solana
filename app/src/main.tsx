import { Buffer } from "buffer";
// Browsers don't have a global Buffer; @solana/web3.js + anchor need it.
// This line MUST run before anything Solana-related imports. Don't remove it.
window.Buffer = window.Buffer ?? Buffer;

import React from "react";
import ReactDOM from "react-dom/client";
import { WalletProviders } from "./WalletProviders";
import App from "./App";

// Wallet adapter's default styles (modal, connect button).
import "@solana/wallet-adapter-react-ui/styles.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProviders>
      <App />
    </WalletProviders>
  </React.StrictMode>
);
