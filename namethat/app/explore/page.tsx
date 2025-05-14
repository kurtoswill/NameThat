"use client";

import ResponsiveNavbar from '@/components/navbar'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Explore() {
    interface NFT {
        id: string;
        image_url: string;
        name: string;
        caption?: string;
        created_at: string;
    }

    const [nfts, setNfts] = useState<NFT[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNFTs() {
            setLoading(true);
            const res = await fetch('/api/nft/explore');
            const { nfts } = await res.json();
            setNfts(nfts || []);
            setLoading(false);
        }
        fetchNFTs();
    }, []);

    return (
        <>
            <ResponsiveNavbar />
            <main className="bg-[#FFFDF6] m-[25px] md:m-0 md:px-[200px] md:py-[40px] md:rounded-[24px] md:shadow-lg min-h-screen flex flex-col pt-0">
                <section>
                    <h1 className="text-[42px] md:text-[56px] font-semibold text-pink">
                        Explore
                    </h1>
                    <p className="text-[15px] md:text-[20px]">
                        Dive into the freshest finds, trending collections, and hidden gems.
                    </p>
                </section>
                <hr className="h-[3px] bg-blue mt-[40px]" />
                <section className="flex justify-end w-full md:w-auto mt-4">
                    <button className="flex items-center gap-[6px] bg-white border border-blue rounded-full px-[12px] py-[6px] sm:px-[16px] sm:py-[8px] text-xs sm:text-sm font-semibold hover:shadow">
                        <span className="text-blue">Filter</span>
                        <svg width="12" height="12" fill="currentColor" className="text-pink">
                            <path d="M1 1h10L6 6.5V11l-2-1V6.5L1 1z" />
                        </svg>
                    </button>
                </section>
                <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20 mt-5">
                    {loading ? (
                        <div className="col-span-full text-center text-blue">Loading...</div>
                    ) : nfts.length === 0 ? (
                        <div className="col-span-full text-center text-gray-400">No NFTs yet.</div>
                    ) : (
                        nfts.map((nft) => (
                            <Link
                                key={nft.id}
                                href={`/explore/${nft.id}`}
                                className="rounded-xl overflow-hidden shadow-md bg-white aspect-square block hover:scale-105 transition"
                            >
                                <Image
                                    src={nft.image_url}
                                    alt={nft.caption || nft.name}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        ))
                    )}
                </section>
            </main>
        </>
    );
}