"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import React from "react";

// Utility to fetch user by wallet address
export async function getUserByWallet(wallet_address: string) {
  const res = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet_address }),
  });
  const data = await res.json();
  return data.user;
}

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

export function WalletAddressWithUserSync() {
  const { address, isConnected } = useAccount();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState("");
  const [userChecked, setUserChecked] = useState(false);

  useEffect(() => {
    if (isConnected && address && !userChecked) {
      fetch(`/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: address }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!data.user?.username) {
            setShowUsernameModal(true);
          } else {
            setShowUsernameModal(false);
          }
          setUserChecked(true);
        })
        .catch((err) => {
          console.error("User API error:", err);
        });
    }
    if (!isConnected) {
      setUserChecked(false);
    }
  }, [isConnected, address, userChecked]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    await fetch(`/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet_address: address, username }),
    });
    setShowUsernameModal(false);
  };

  return (
    <div>
      <BaseWalletAddress />
      {showUsernameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            onSubmit={handleUsernameSubmit}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 min-w-[320px]"
          >
            <h2 className="text-xl font-bold text-blue">Create a username</h2>
            <p className="text-gray-600 text-sm mb-2">You can change your username later in your profile.</p>
            <input
              type="text"
              className="border border-blue rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
              placeholder="Enter a username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue text-white rounded px-4 py-2 font-semibold hover:bg-blue/80 transition"
            >
              Save Username
            </button>
          </form>
        </div>
      )}
    </div>
  );
}