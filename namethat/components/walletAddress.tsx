"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import React from "react";

export function BaseWalletAddress() {
  return (
    <div>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          // Styles to match the "Create" button in the navbar
          const buttonClass =
            "flex items-center gap-2 px-4 py-2 h-10 bg-white text-blue border-blue border-2 rounded-md font-semibold hover:bg-blue hover:text-white transition";

          return (
            <div
              aria-hidden={!ready}
              className={`transition-all ${
                !ready ? "opacity-0 pointer-events-none select-none" : ""
              }`}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className={buttonClass}
                      style={{ minHeight: "40px" }} // h-10 = 2.5rem = 40px
                    >
                      Connect Wallet
                    </button>
                  );
                }
                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className={buttonClass.replace(
                        "bg-blue text-white hover:bg-blue/80",
                        "bg-red-600 text-white hover:bg-red-700"
                      )}
                      style={{ minHeight: "40px" }}
                    >
                      Wrong network
                    </button>
                  );
                }
                return (
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className={buttonClass}
                    style={{ minHeight: "40px" }}
                  >
                    {account.displayName}
                  </button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}