import ResponsiveNavbar from "@/components/navbar";
import Image from "next/image";
import React from "react";

export default function Profile() {
    return (
        <>
            <ResponsiveNavbar />
            <main
                className="bg-white px-6 py-10 min-h-screen
                m-[25px]
                md:m-0
                md:px-[200px]
                md:py-[40px]
                md:rounded-[24px]
                md:shadow-lg
                flex flex-col"
            >
                {/* No header here, navbar handles logo and wallet */}
                <section className="flex items-center gap-6 mb-10 mt-10">
                    <Image
                        src="/images/placeholder.png"
                        alt="Profile"
                        width={96}
                        height={96}
                        className="rounded-full object-cover w-24 h-24"
                        priority
                    />
                    <div>
                        <div className="bg-blue text-white text-sm px-3 py-1 rounded-lg inline-block font-semibold mb-1">
                            Deannie
                        </div>
                        <div className="text-blue text-sm">0x38a5310aa296F5982c...</div>
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