"use client";

import React, { useState } from "react";
import { useWallets } from "@coinbase/onchainkit"; // Ensure correct import
import { handleUploadAndSavePost } from "@/lib/handleUploadAndSavePost";

export default function CreateForm() {
  const { wallets } = useWallets(); // Handle multiple wallets if returned as an array
  const wallet = wallets?.[0];     // Use the first wallet (adjust based on the hook's behavior)
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [mode, setMode] = useState<"open" | "vote_only" | "hybrid">("open");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    if (!wallet?.address) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      await handleUploadAndSavePost({
        file,
        caption,
        mode,
        category,
        walletAddress: wallet.address,
      });
      alert("Post has been uploaded successfully!");
      setFile(null);
      setCaption("");
      setMode("open");
      setCategory("");
      (document.getElementById("upload") as HTMLInputElement).value = "";
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload post. Please try again.");
    }
  };

  return (
    <form className="flex flex-col md:flex-row gap-8 mt-10" onSubmit={handleSubmit}>
      {/* Left: Square Upload Placeholder */}
      <div className="w-full md:w-1/2">
        <label
          htmlFor="upload"
          className="block aspect-square border-2 border-dashed rounded-xl cursor-pointer bg-gray-100 flex items-center justify-center overflow-hidden"
          tabIndex={0}
        >
          <span className="text-blue text-sm">
            {file ? file.name : "Click to upload image or GIF"}
          </span>
        </label>
        <input
          id="upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between">
        <div className="text-sm">
          {/* Caption */}
          <textarea
            placeholder="Add a caption..."
            className="w-full p-3 border-2 border-blue text-black placeholder:text-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-[16px]"
            rows={4}
            value={caption}
            onChange={e => setCaption(e.target.value)}
          />
          {/* Dropdown */}
          <div className="relative w-fit my-4">
            <select
              className="appearance-none w-full px-6 py-2 pr-10 bg-blue text-white font-semibold rounded-full text-sm cursor-pointer text-center"
              value={mode}
              onChange={e => setMode(e.target.value as "open" | "vote_only" | "hybrid")}
            >
              <option value="open">Open Suggestions</option>
              <option value="vote_only">Vote Only</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {/* Category */}
          <input
            id="category"
            type="text"
            placeholder="Category..."
            aria-label="Category"
            className="w-full px-4 py-2 border-blue border-2 text-black rounded-[12px] placeholder-blue text-[16px] focus:ring-blue mb-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </div>
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-pink text-white font-semibold text-[16px] py-[15px] px-6 rounded-lg hover:bg-pink/75 transition"
            disabled={!wallet?.address}
          >
            {wallet?.address ? "Submit Entry" : "Connect Wallet to Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}