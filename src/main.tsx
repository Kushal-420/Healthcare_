import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

// Required CSS for the wallet modal
import "@solana/wallet-adapter-react-ui/styles.css";

// Network configuration - change to "devnet" or "mainnet-beta" for production
// Change this line in src/main.tsx
const NETWORK = "https://api.devnet.solana.com";

function Root() {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={NETWORK}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
