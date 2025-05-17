"use client";

import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/ToastProvider";

const config = getDefaultConfig({
  appName: "NameThat",
  projectId: "a67a9a502f078068327f58a05fb359e1",
  chains: [base],
  ssr: false
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}