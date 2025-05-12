"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";

export function BaseWalletAddress() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, mounted }) => (
        <button
          type="button"
          onClick={
            !mounted || !account || !chain
              ? openConnectModal
              : openAccountModal
          }
          style={{
            background: "#3A86FF",
            color: "#FFFDF6",
            borderRadius: "6px",
            fontWeight: "600",
            padding: "10.5px 12px",
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {!mounted
            ? "Connect Wallet"
            : !account || !chain
            ? "Connect Wallet"
            : `${account.displayName}`}
        </button>
      )}
    </ConnectButton.Custom>
  );
}
