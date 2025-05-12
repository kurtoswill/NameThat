"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import React from "react";

export function BaseWalletAddress() {
  return (
    <div>
      <ConnectButton chainStatus="icon" showBalance={false} />
    </div>
  );
}
