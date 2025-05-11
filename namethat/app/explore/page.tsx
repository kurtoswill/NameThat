import React from 'react'
import { BaseWalletAddress } from "@/components/walletAddress"
import { Logo } from "@/components/logo"
import ResponsiveNavbar from '@/components/navbar'
import Image from 'next/image'

const items = [
    "/images/Doodles.gif",
    "/images/HorseJoker.jpg",
    "/images/NikeReact.gif",
    "/images/Pillhead.jpg",
    "/images/NikeDunks.jpg",
    "/images/Beast.jpg",
    "/images/SB1.jpg",
    "/images/V2K.jpg",
    "/images/Chick.jpg",
    "/images/Frizeess.jpg",
    "/images/GentleMonster.jpg",
    "/images/Hape.jpg",
    "/images/Hoodie.jpg",
    "/images/JinWoo.jpg",
    "/images/Killua.jpg",
    "/images/LeoNatsume.jpg",

]

export default function Explore() {
    return (
        <main
            className="
        bg-[#FFFDF6]
        m-[25px]
        md:m-0
        md:px-[200px]
        md:py-[40px]
        md:rounded-[24px]
        md:shadow-lg
        min-h-screen
        flex flex-col
      "
        >
            <header className="flex justify-between items-center mb-8">
                <Logo />
                <BaseWalletAddress />
            </header>

            <section className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-[16px]">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink">Explore</h1>
                        <p className="text-sm sm:text-base text-darkSilver mt-[4px] sm:mt-[8px]">
                            Dive into the freshest finds, trending collections, and hidden gems.
                        </p>
                    </div>

                    <div className="w-full md:hidden">
                        <hr className="h-[3px] bg-blue mt-[20px]" />
                    </div>

                    <div className="flex justify-end w-full md:w-auto">
                        <button className="flex items-center gap-[6px] bg-white border border-blue rounded-full px-[12px] py-[6px] sm:px-[16px] sm:py-[8px] text-xs sm:text-sm font-semibold hover:shadow">
                            <span className="text-blue">Filter</span>
                            <svg width="12" height="12" fill="currentColor" className="text-pink">
                                <path d="M1 1h10L6 6.5V11l-2-1V6.5L1 1z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20 mt-10">
                {items.map((src, index) => (
                    <div key={index} className="rounded-xl overflow-hidden shadow-md bg-white aspect-square">
                        <Image
                            src={src}
                            alt={`item-${index}`}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </section>

            <footer className="mt-auto">
                <ResponsiveNavbar />
            </footer>
        </main>
    )
}