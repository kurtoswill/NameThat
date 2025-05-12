import ResponsiveNavbar from '@/components/navbar'
import Image from 'next/image'
import React from 'react'

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
        <>
            {/* Navbar always on top */}
            <ResponsiveNavbar />

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
                    pt-0
                "
            >
                {/* Top section: match homepage */}
                <section>
                    <h1 className="text-[42px] md:text-[56px] font-semibold mt-[40px] text-pink">
                        Explore
                    </h1>
                    <p className="text-[15px] md:text-[20px]">
                        Dive into the freshest finds, trending collections, and hidden gems.
                    </p>
                </section>

                <hr className="h-[3px] bg-blue mt-[40px]" />

                {/* Filter button row */}
                <section className="flex justify-end w-full md:w-auto mt-4">
                    <button className="flex items-center gap-[6px] bg-white border border-blue rounded-full px-[12px] py-[6px] sm:px-[16px] sm:py-[8px] text-xs sm:text-sm font-semibold hover:shadow">
                        <span className="text-blue">Filter</span>
                        <svg width="12" height="12" fill="currentColor" className="text-pink">
                            <path d="M1 1h10L6 6.5V11l-2-1V6.5L1 1z" />
                        </svg>
                    </button>
                </section>

                {/* Gallery grid */}
                <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20 mt-5">
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
            </main>
        </>
    )
}