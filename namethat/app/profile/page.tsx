"use client";

import ResponsiveNavbar from "@/components/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useAccount } from 'wagmi';
import { getUserByWallet } from '@/components/walletAddress';

export default function Profile() {
    const { address, isConnected } = useAccount();
    const [copied, setCopied] = useState(false);
    const [username, setUsername] = useState('');
    const [editing, setEditing] = useState(false);
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        async function fetchUsername() {
            if (isConnected && address) {
                const user = await getUserByWallet(address);
                setUsername(user?.username || '');
                setTempName(user?.username || '');
            }
        }
        fetchUsername();
    }, [isConnected, address]);

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const handleSave = async () => {
        // Save username to database
        await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet_address: address, username: tempName }),
        });
        // Re-fetch username from backend to ensure UI is in sync
        if (isConnected && address) {
            const user = await getUserByWallet(address);
            setUsername(user?.username || tempName); // fallback to tempName if backend returns nothing
            setTempName(user?.username || tempName);
        }
        setEditing(false);
    };

    const handleCancel = () => {
        setTempName(username);
        setEditing(false);
    };

    return (
        <>
            <ResponsiveNavbar />
            <main
                className="font-poppins bg-white px-6 py-10 min-h-screen
                m-[25px]
                md:m-0
                md:px-[200px]
                md:py-[40px]
                md:rounded-[24px]
                md:shadow-lg
                flex flex-col"
            >
                {/* No header here, navbar handles logo and wallet */}
                <section className="flex items-center gap-6 mb-10 mt-5">
                    <Image
                        src="/images/placeholder.png"
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-full object-cover w-24 h-24"
                        priority
                    />
                    <div>
                        <div className="relative flex items-center mb-1">
                            {/* Username box with border */}
                            <div className="flex flex-col gap-2">
                                {/* Username row: box + edit/check/cancel icons (outside) */}
                                <div className="flex items-center gap-2">
                                    <ConnectButton.Custom>
                                        {({
                                            account,
                                            chain,
                                            mounted,
                                        }) => {
                                            const ready = mounted;
                                            const connected = ready && account && chain;
                                            const boxClass =
                                                "flex items-center px-4 py-2 h-10 bg-white text-blue border-blue border-2 rounded-md font-semibold hover:bg-blue/10 transition select-none w-fit";
                                            if (!ready) {
                                                return <div className="opacity-0 pointer-events-none select-none" />;
                                            }
                                            if (!connected) {
                                                return (
                                                    <div
                                                        className={boxClass}
                                                        style={{ minHeight: "40px" }}
                                                    >
                                                        Not connected
                                                    </div>
                                                );
                                            }
                                            if (editing) {
                                                return (
                                                    <div className="flex items-center gap-2">
                                                        <div className={boxClass} style={{ minHeight: "40px" }}>
                                                            <input
                                                                className="bg-transparent border-none outline-none text-blue font-semibold text-sm w-32"
                                                                value={tempName}
                                                                onChange={e => setTempName(e.target.value)}
                                                                autoFocus
                                                                onFocus={e => e.target.select()}
                                                                onKeyDown={e => {
                                                                    if (e.key === "Enter") handleSave();
                                                                    if (e.key === "Escape") handleCancel();
                                                                }}
                                                                style={{ minWidth: "80px" }}
                                                            />
                                                        </div>
                                                        <button
                                                            className="text-green-600 font-bold text-sm flex items-center"
                                                            onClick={handleSave}
                                                            title="Save"
                                                            disabled={
                                                                tempName.trim() === "" ||
                                                                tempName.trim() === username.trim()
                                                            }
                                                            style={{
                                                                opacity:
                                                                    tempName.trim() === "" ||
                                                                    tempName.trim() === username.trim()
                                                                        ? 0.5
                                                                        : 1,
                                                                cursor:
                                                                    tempName.trim() === "" ||
                                                                    tempName.trim() === username.trim()
                                                                        ? "not-allowed"
                                                                        : "pointer",
                                                            }}
                                                        >
                                                            {/* Check icon */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                                                                <path stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="text-pink font-bold ml-2 text-sm flex items-center"
                                                            onClick={handleCancel}
                                                            title="Cancel"
                                                        >
                                                            {/* X icon */}
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                                                                <path stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                );
                                            }
                                            // Not editing
                                            return (
                                                <div className="flex items-center gap-2">
                                                    <div className={boxClass} style={{ minHeight: "40px" }}>
                                                        {username || "—"}
                                                    </div>
                                                    {/* Edit icon outside the box */}
                                                    {isConnected && (
                                                        <button
                                                            className="p-0 bg-transparent border-0 focus:outline-none flex items-center"
                                                            onClick={() => setEditing(true)}
                                                            title="Edit name"
                                                            tabIndex={0}
                                                            style={{ lineHeight: 0, height: "40px" }}
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 17H17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M12.5 4.5L15.5 7.5C15.8978 7.89782 16.1022 8.10218 16.2071 8.29289C16.2982 8.45455 16.3546 8.63261 16.3706 8.81713C16.3882 9.02244 16.3552 9.23013 16.2892 9.42641C16.2172 9.64112 16.0622 9.89645 15.7522 10.2064L8.5 17.5H3V12.5L10.2936 5.20645C10.6036 4.89645 10.8589 4.74147 11.0736 4.66949C11.2699 4.60353 11.4776 4.57054 11.6829 4.58813C11.8674 4.60413 12.0455 4.66054 12.2071 4.75161C12.3978 4.85647 12.6022 5.06083 13 5.45865L12.5 4.5Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    </ConnectButton.Custom>
                                </div>
                                {/* Wallet address row: box + copy icon (outside) */}
                                <div className="flex items-center gap-2">
                                    <ConnectButton.Custom>
                                        {({ account, mounted }) => {
                                            const boxClass =
                                                "flex items-center px-4 py-2 h-10 bg-white text-blue border-blue border-2 rounded-md font-semibold hover:bg-blue/10 transition select-none w-fit";
                                            if (mounted && account) {
                                                // Shorten address like in navbar
                                                const shortAddress = `${account.address.slice(0, 6)}...${account.address.slice(-4)}`;
                                                return (
                                                    <div className={boxClass} style={{ minHeight: "40px" }}>
                                                        <span>{shortAddress}</span>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div className={boxClass} style={{ minHeight: "40px" }}>
                                                    Not connected
                                                </div>
                                            );
                                        }}
                                    </ConnectButton.Custom>
                                    {/* Copy icon outside the box */}
                                    {isConnected && (
                                        <button
                                            type="button"
                                            className="p-0 bg-transparent border-0 focus:outline-none flex items-center"
                                            onClick={() => handleCopy(address || "")}
                                            title="Copy address"
                                            tabIndex={0}
                                            style={{ lineHeight: 0, height: "40px" }}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="7" y="7" width="9" height="9" rx="2" stroke="#2563eb" strokeWidth="2"/>
                                                <rect x="4" y="4" width="9" height="9" rx="2" stroke="#2563eb" strokeWidth="2"/>
                                            </svg>
                                        </button>
                                    )}
                                    {copied && (
                                        <span className="ml-2 text-pink font-normal">Copied!</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="border-t border-b border-blue py-6 mb-12">
                    <div className="text-pink text-2xl font-semibold mb-4">
                        Overview
                    </div>
                    <div className="space-y-2 text-lg text-gray-700">
                        <div className="flex justify-between">
                            <span>Uploaded Images:</span>
                            <span>3</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Suggestions Won:</span>
                            <span>5</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Suggestions Given:</span>
                            <span>18</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Winning Entries:</span>
                            <span>1</span>
                        </div>
                        <div className="flex justify-between">
                            <span>NFT/s Owned:</span>
                            <span>2</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Earnings:</span>
                            <span>0.031 ETH</span>
                        </div>
                    </div>
                </div>

                <section>
                    <div className="text-pink text-2xl font-semibold mb-4">Image Deck</div>
                    <div className="flex flex-wrap md:flex-nowrap justify-between gap-8">
                        {/* Sung Jin Woo */}
                        <div className="flex items-center w-full md:w-[32%] gap-5 bg-white p-5 rounded-2xl shadow-lg">
                            <Image
                                src="/images/JinWoo.jpg"
                                alt="Sung Jin Woo"
                                width={120}
                                height={120}
                                className="object-cover aspect-square rounded-xl"
                                priority
                            />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-gold font-bold text-2xl">Sung Jin Woo</span>
                                    <span className="text-2xl">🏆</span>
                                </div>
                                <span className="text-base text-gray-700">133,321,043 votes</span>
                            </div>
                        </div>

                        {/* Yuki Nanami */}
                        <div className="flex items-center w-full md:w-[32%] gap-5 bg-white p-5 rounded-2xl shadow-lg">
                            <Image
                                src="/images/Yuki.gif"
                                alt="Yuki Nanami"
                                width={120}
                                height={120}
                                className="object-cover aspect-square rounded-xl"
                                priority
                            />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-2xl text-gray-800">Yuki Nanami</span>
                                </div>
                                <span className="text-base text-gray-700">15,321,044 votes</span>
                            </div>
                        </div>

                        {/* Killua */}
                        <div className="flex items-center w-full md:w-[32%] gap-5 bg-white p-5 rounded-2xl shadow-lg">
                            <Image
                                src="/images/Killua.jpg"
                                alt="Killua"
                                width={120}
                                height={120}
                                className="object-cover aspect-square rounded-xl"
                                priority
                            />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-2xl text-gray-800">Killua</span>
                                </div>
                                <span className="text-base text-gray-700">17,343,019 votes</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}