"use client";

import ResponsiveNavbar from "@/components/navbar";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";

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

export default function PostPage() {
  const params = useParams();
  const nft_id = params.nft_id as string;
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nft_id) return;
    async function fetchNFT() {
      setLoading(true);
      try {
        const res = await fetch(`/api/nft/explore?id=${nft_id}`);
        const json = await res.json();
        if (json.nft) setNft(json.nft);
        else setNft(null);
      } catch (err) {
        setNft(null);
      }
      setLoading(false);
    }
    fetchNFT();
  }, [nft_id]);

  if (loading) return <div>Loading...</div>;
  if (!nft) {
    notFound();
    return null;
  }

  return (
    <>
      <ResponsiveNavbar />
      <main className="bg-[#FFFDF6] m-[25px] md:m-0 md:px-[200px] md:py-[40px] md:rounded-[24px] md:shadow-lg min-h-screen flex flex-col pt-0">
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
          <Image
            src={nft.image_url}
            alt={nft.caption || nft.name || "NFT"}
            width={400}
            height={400}
            className="rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{nft.name}</h1>
          <p className="text-gray-600 mb-2">{nft.caption}</p>
          <div className="text-sm text-gray-500 mb-2">Created: {nft.created_at}</div>
          <div className="text-sm text-gray-500 mb-2">Status: {nft.status}</div>
          <div className="text-sm text-gray-500 mb-2">Votes: {nft.votes}</div>
        </div>
      </main>
    </>
  );
}
