"use client";

import ResponsiveNavbar from "@/components/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React, { useState } from "react";

export default function Profile() {
    const [copied, setCopied] = useState(false);
    const [username, setUsername] = useState("Deannie");
    const [editing, setEditing] = useState(false);
    const [tempName, setTempName] = useState(username);

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const handleSave = () => {
        setUsername(tempName);
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
                            <div className="flex items-center px-4 py-2 h-10 bg-white text-blue border-blue border-2 rounded-md font-semibold min-w-[120px]">
                                {editing ? (
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
                                ) : (
                                    <span>{username}</span>
                                )}
                            </div>
                            {/* Icons outside the border */}
                            {editing ? (
                                <div className="flex items-center ml-2">
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
                                            <path stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    </button>
                                    <button
                                        className="text-pink font-bold ml-2 text-sm flex items-center"
                                        onClick={handleCancel}
                                        title="Cancel"
                                    >
                                        {/* X icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                                            <path stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="ml-2 p-0 bg-transparent border-0 focus:outline-none flex items-center"
                                    onClick={() => setEditing(true)}
                                    title="Edit name"
                                    tabIndex={0}
                                    style={{ lineHeight: 0, height: "40px" }} // h-10 = 40px
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#3b82f6">
                                        <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                        {/* Only wallet address below username */}
                        <div className="mt-1 text-blue text-sm font-poppins break-all px-3 py-2 hover:rounded-md hover:bg-blue/10 border-2 border-blue rounded-md">
                            <ConnectButton.Custom>
                                {({ account, mounted }) =>
                                    mounted && account ? (
                                        <button
                                            type="button"
                                            className=" focus:outline-none"
                                            onClick={() => handleCopy(account.address)}
                                            title="Copy address"
                                        >
                                            {account.address}
                                            {copied && (
                                                <span className="ml-2 text-pink font-normal">Copied!</span>
                                            )}
                                        </button>
                                    ) : (
                                        <span>Not connected</span>
                                    )
                                }
                            </ConnectButton.Custom>
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