"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { handleUploadAndSavePost } from "@/lib/handleUploadAndSavePost";

const CATEGORY_OPTIONS = [
  "Animals",
  "Technology",
  "Sports",
  "Music",
  "Movies",
  "Art",
  "Nature",
  "Food",
  "Travel",
  "Other",
];

export default function CreateForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [mode, setMode] = useState<"open" | "vote_only" | "hybrid">("open");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { openConnectModal } = useConnectModal();
  const { address: walletAddress } = useAccount();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Image preview URL
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Toggle category selection with max 2 limit
  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      if (categories.length < 2) {
        setCategories([...categories, category]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    let hasError = false;

    if (!file) {
      hasError = true;
    }

    if (!caption.trim()) {
      alert("Please add a caption.");
      return;
    }

    if (categories.length === 0) {
      hasError = true;
    }

    if (hasError) return;

    if (!walletAddress) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      await handleUploadAndSavePost({
        file: file as File,
        caption,
        mode,
        category: categories.join(", "),
        walletAddress,
      });
      alert("Post has been uploaded successfully!");
      setFile(null);
      setCaption("");
      setMode("open");
      setCategories([]);
      (document.getElementById("upload") as HTMLInputElement).value = "";
      setPreviewUrl(null);
      setCategoryDropdownOpen(false);
      setSubmitted(false);
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload post. Please try again.");
    }
  };

  // Display selected categories as comma separated text or placeholder
  const selectedCategoriesText =
    categories.length > 0 ? categories.join(", ") : "Select 2 categories";

  return (
    <>
      <form className="flex flex-col md:flex-row gap-8 mt-10" onSubmit={handleSubmit}>
        {/* Left: Upload and Preview */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <label
            htmlFor="upload"
            className="aspect-square w-full max-w-md border-2 border-dashed rounded-xl cursor-pointer bg-gray-100 flex items-center justify-center overflow-hidden relative"
            tabIndex={0}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                className="object-contain w-full h-full"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <span className="text-blue text-sm px-4 text-center">
                Click to upload image or GIF
              </span>
            )}
          </label>
          <input
            id="upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              setFile(e.target.files?.[0] || null);
            }}
            required
          />
          {submitted && !file && (
            <p className="text-red-500 text-sm mt-2">Please select a file.</p>
          )}
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div className="text-sm">
            <textarea
              placeholder="Add a caption..."
              className="w-full p-3 border-2 border-blue text-black placeholder:text-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-[16px]"
              rows={4}
              value={caption}
              onChange={e => setCaption(e.target.value)}
              required
            />

            <div className="relative w-fit my-4">
              <select
                className="appearance-none w-full px-6 py-2 pr-10 bg-blue text-white font-semibold rounded-full text-sm cursor-pointer text-center"
                value={mode}
                onChange={e => setMode(e.target.value as "open" | "vote_only" | "hybrid")}
                required
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

            {/* Custom multi-select dropdown */}
            <div className="my-4 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full text-left px-4 py-2 border-2 border-blue rounded-[12px] text-black placeholder-blue text-[16px] flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue"
                aria-haspopup="listbox"
                aria-expanded={categoryDropdownOpen}
              >
                <span className={`${categories.length === 0 ? "text-blue" : ""}`}>
                  {selectedCategoriesText}
                </span>
                <svg
                  className={`w-5 h-5 text-blue transition-transform duration-200 ${
                    categoryDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {categoryDropdownOpen && (
                <ul
                  className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-blue bg-white shadow-lg focus:outline-none"
                  role="listbox"
                  aria-multiselectable="true"
                >
                  {CATEGORY_OPTIONS.map(category => {
                    const checked = categories.includes(category);
                    const disabled =
                      !checked && categories.length >= 2; // disable unchecked if 2 selected
                    return (
                      <li
                        key={category}
                        className={`cursor-pointer select-none px-4 py-2 flex items-center gap-3 hover:bg-blue/10 ${
                          disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (!disabled) toggleCategory(category);
                        }}
                        role="option"
                        aria-selected={checked}
                        tabIndex={-1}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          readOnly
                          tabIndex={-1}
                          className="w-4 h-4 text-blue border-blue rounded focus:ring-blue"
                          aria-label={category}
                        />
                        <span>{category}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {submitted && categories.length === 0 && (
              <p className="text-red-500 text-sm mt-2">Please select at least one category.</p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-pink text-white font-semibold text-[16px] py-[15px] px-6 rounded-lg hover:bg-pink/75 transition"
              onClick={e => {
                if (!walletAddress) {
                  e.preventDefault();
                  if (openConnectModal) {
                    openConnectModal();
                  } else {
                    alert("No wallet connection modal available");
                  }
                }
              }}
            >
              {walletAddress ? "Submit Entry" : "Connect Wallet to Submit"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}