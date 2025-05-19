/* eslint-disable @next/next/no-img-element */
"use client";

import ResponsiveNavbar from '@/components/navbar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from 'react';
import Link from "next/link";

export default function HomePage() {
  type NewDropNFT = { id: string; image_url: string; caption?: string };
  const [newDrops, setNewDrops] = useState<NewDropNFT[]>([]);
  useEffect(() => {
    async function fetchNewDrops() {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch(`/api/nft/explore?since=${encodeURIComponent(since)}`);
      const json = await res.json();
      if (json.nfts) {
        setNewDrops(json.nfts);
      } else {
        setNewDrops([]);
      }
    }
    fetchNewDrops();
  }, []);

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
        "
      >
        {/* Remove header with Logo and WalletAddress, navbar handles this */}
        <section>
          <h1 className='text-[42px] md:text-[56px] font-semibold text-blue'>NameThat</h1>
          <p className='text-[15px] md:text-[20px]'>Upload an image or a GIF, get name ideas from the community, vote on the best, and turn top picks into NFTs.</p>
        </section>

        <hr className='h-[3px] bg-blue mt-[40px]' />

        <section>
          <h2 className='text-[24px] md:text-[32px] font-semibold mt-[40px] mb-[12px] text-pink'>Spotlight</h2>
          <p className="md:text-[18px]">Curated picks that deserve the stage.</p>
        </section>

        {/* Spotlight Carousel */}
        <Carousel
          className='my-[24px] overflow-hidden'
          opts={{
            align: "start",
            loop: true,
            containScroll: "trimSnaps",
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent className="flex gap-x-4 px-2">
            {[
              "/images/Doodles.gif",
              "/images/HorseJoker.jpg",
              "/images/NikeReact.gif",
              "/images/Pillhead.jpg",
              "/images/NikeDunks.jpg",
              "/images/Beast.jpg",
              "/images/SB1.jpg",
              "/images/V2K.jpg",
            ].map((src, i) => (
              <CarouselItem
                key={i}
                className="flex-[0_0_calc(50%-0.5rem)] md:flex-[0_0_calc(25%-0.75rem)] rounded-[12px] overflow-hidden"
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover aspect-square rounded-[12px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <hr className='h-[4px] bg-blue' />

        <section>
          <h2 className='text-[24px] md:text-[32px] font-semibold mt-[40px] mb-[12px] text-pink'>On Fire</h2>
          <p className="md:text-[18px]">Trending right now - don’t miss out.</p>
        </section>

        {/* On Fire Carousels */}
        <div>
          {/* Top Carousel */}
          <Carousel
            className="my-[24px] overflow-hidden"
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps",
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
              }),
            ]}
          >
            <CarouselContent className="flex gap-x-4 px-2">
              {[
                "/images/NikeDunks.jpg",
                "/images/Beast.jpg",
                "/images/SB1.jpg",
                "/images/V2K.jpg",
                "/images/NikeDunks.jpg",
                "/images/OrangeApe.png",
                "/images/Hape.jpg",
                "/images/WalterWhite.jpg"
              ].map((src, i) => (
                <CarouselItem
                  key={i}
                  className="flex-[0_0_calc(50%-0.5rem)] md:flex-[0_0_calc(25%-0.75rem)] rounded-[12px] overflow-hidden"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover aspect-square rounded-[12px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Bottom Carousel */}
          <Carousel
            className="-mt-[10px] mb-[24px] overflow-hidden"
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps",
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
              }),
            ]}
          >
            <CarouselContent className="flex gap-x-4 px-2">
              {[
                "/images/Speedcat.jpg",
                "/images/OneGravity.png",
                "/images/SB2.jpg",
                "/images/Killua.jpg",
              ].map((src, i) => (
                <CarouselItem
                  key={i}
                  className="flex-[0_0_calc(50%-0.5rem)] md:flex-[0_0_calc(25%-0.75rem)] rounded-[12px] overflow-hidden"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover aspect-square rounded-[12px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <hr className='h-[4px] bg-blue' />

        <section>
          <h2 className='text-[24px] md:text-[32px] font-semibold mt-[40px] mb-[12px] text-pink'>New Drops</h2>
          <p className="md:text-[18px]">Fresh arrivals just hit the scene.</p>
        </section>

        {/* New Drops Carousels */}
        <div>
          {/* Top Carousel */}
          <Carousel
            className="my-[24px] overflow-hidden"
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps",
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
              }),
            ]}
          >
            <CarouselContent className="flex gap-x-4 px-2">
              {newDrops.length === 0 ? (
                <div className="text-gray-400 italic p-8">No new drops in the last 24 hours.</div>
              ) : (
                newDrops.map((nft, i) => (
                  <CarouselItem
                    key={nft.id || i}
                    className="flex-[0_0_calc(50%-0.5rem)] md:flex-[0_0_calc(25%-0.75rem)] rounded-[12px] overflow-hidden"
                  >
                    <Link href={`/post/${nft.id}`} className="block w-full h-full">
                      <img
                        src={nft.image_url}
                        alt={nft.caption || "NFT"}
                        className="w-full h-full object-cover aspect-square rounded-[12px] hover:scale-105 transition"
                      />
                    </Link>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
          </Carousel>
        </div>
      </main>
    </>
  );
}
