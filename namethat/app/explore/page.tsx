"use client";

import Filter from "@/components/filter";
import ResponsiveNavbar from "@/components/navbar";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Explore() {
  interface NFT {
    id: string;
    image_url: string;
    name: string;
    caption: string;
    categories: string[];
    votes: number;
    status: string;
    submission_type: string;
    created_at: string;
    user_id: string;
  }

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Optional: handle filter changes
  const handleFilterChange = (filters: {
    categories: string[];
    statuses: string[];
  }) => {
    // You can implement filtering logic here if needed
    // For now, just log the filters
    console.log(filters);
  };

  // Open filter with animation
  const openFilter = () => {
    setShowFilter(true);
    setTimeout(() => setFilterVisible(true), 10); // allow mount before animating
  };

  // Close filter with animation
  const closeFilter = () => {
    setFilterVisible(false);
    setTimeout(() => setShowFilter(false), 200); // match transition duration
  };

  useEffect(() => {
    async function fetchNFTs() {
      setLoading(true);
      try {
        const res = await fetch("/api/nft/explore");
        const json = await res.json();
        setNfts(json.nfts || []);
      } catch (e) {
        setNfts([]);
      }
      setLoading(false);
    }
    fetchNFTs();
  }, []);

  useEffect(() => {
    if (!showFilter) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        closeFilter();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilter]);

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
          <button
            className="flex items-center gap-[6px] bg-white border border-blue rounded-full px-[12px] py-[6px] sm:px-[16px] sm:py-[8px] text-xs sm:text-sm font-semibold hover:shadow"
            onClick={openFilter}
          >
            <span className="text-blue">Filter</span>
            <svg
              width="12"
              height="12"
              fill="currentColor"
              className="text-pink"
            >
              <path d="M1 1h10L6 6.5V11l-2-1V6.5L1 1z" />
            </svg>
          </button>
        </section>

        {/* Overlay Filter */}
        {showFilter && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-2 transition-opacity duration-200 ${filterVisible ? "opacity-100" : "opacity-0"}`}
          >
            <div
              ref={filterRef}
              className={`relative bg-blue rounded-xl p-4 transform transition-all duration-200 ${filterVisible ? "scale-100" : "scale-95"}`}
            >
              <button
                className="absolute top-1.5 right-1.5 text-white bg-blue-500 rounded-full w-9 h-9 flex items-center justify-center hover:bg-blue-600 group"
                onClick={closeFilter}
                aria-label="Close filter"
              >
                <svg
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="transition-opacity duration-200 opacity-80 group-hover:opacity-100"
                >
                  <path d="M8 8l12 12M8 20L20 8" />
                </svg>
              </button>
              <Filter onChange={handleFilterChange} />
            </div>
          </div>
        )}

        <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20 mt-5">
          {loading ? (
            <div className="col-span-full text-center text-blue">
              Loading...
            </div>
          ) : nfts.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">
              No posts yet.
            </div>
          ) : (
            nfts.map((nft) => (
              <Link
                key={nft.id}
                href={`/post/${nft.id}`}
                className="rounded-xl overflow-hidden shadow-md bg-white aspect-square block hover:scale-105 transition"
              >
                <Image
                  src={nft.image_url}
                  alt={nft.caption || nft.name || "NFT"}
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
