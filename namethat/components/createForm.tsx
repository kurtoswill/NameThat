"use client";

import { handleUploadAndSavePost } from "@/lib/handleUploadAndSavePost";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { useAccount } from "wagmi";
import getCroppedImg from "../utils/cropImage";

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
  const [options, setOptions] = useState<string[]>([""]);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (idx: number) => {
    if (options.length === 1) return;
    const newOptions = options.filter((_, i) => i !== idx);
    setOptions(newOptions);
  };

  useEffect(() => {
    if (mode === "open") {
      setOptions([""]);
    }
  }, [mode]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRawImage(url);
      setShowCrop(true);
      setFile(file);
    }
  };

  const handleCropSave = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(rawImage, croppedAreaPixels);
    setPreviewUrl(URL.createObjectURL(croppedBlob));
    setShowCrop(false);
    setFile(new File([croppedBlob], file?.name || "cropped.png", { type: croppedBlob.type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setIsSubmitting(true);

    let hasError = false;

    if (!file) {
      hasError = true;
    }

    if (!caption.trim()) {
      alert("Please add a caption.");
      setIsSubmitting(false);
      return;
    }

    if (mode !== "open") {
      if (options.length === 0 || options.some(opt => !opt.trim())) {
        alert("Please provide at least one option and fill all option fields.");
        setIsSubmitting(false);
        return;
      }
    }

    if (categories.length === 0) {
      hasError = true;
    }

    if (hasError) {
      setIsSubmitting(false);
      return;
    }

    if (!walletAddress) {
      alert("Please connect your wallet.");
      setIsSubmitting(false);
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
      setOptions([""]);
      (document.getElementById("upload") as HTMLInputElement).value = "";
      setPreviewUrl(null);
      setCategoryDropdownOpen(false);
      setSubmitted(false);
      setIsSubmitting(false);
      router.push("/explore");
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload post. Please try again.");
      setIsSubmitting(false);
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
              <div className="relative w-full h-full aspect-square flex items-center justify-center bg-white">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="object-cover w-full h-full"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* X icon for remove image */}
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-red-100 transition"
                  onClick={e => {
                    e.stopPropagation();
                    setFile(null);
                    setRawImage(null);
                    setPreviewUrl(null);
                    (document.getElementById("upload") as HTMLInputElement).value = "";
                  }}
                  aria-label="Remove image"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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
            onChange={handleFileChange}
            required
          />
          {showCrop && rawImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center w-[350px]">
                <div className="relative w-[300px] h-[300px] rounded-lg overflow-hidden border-2 border-blue shadow">
                  <Cropper
                    image={rawImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="rect"
                    showGrid={true}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full mt-4">
                  <label className="text-xs text-gray-600 font-medium">Zoom</label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.01}
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                    className="w-full accent-blue"
                  />
                </div>
                <div className="flex gap-2 mt-6 w-full">
                  <button
                    onClick={handleCropSave}
                    className="flex-1 bg-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue/90 transition"
                  >
                    Crop & Use
                  </button>
                  <button
                    onClick={() => setShowCrop(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCrop(false);
                    setFile(null);
                    setRawImage(null);
                    setPreviewUrl(null);
                    (document.getElementById("upload") as HTMLInputElement).value = "";
                  }}
                  className="mt-4 text-red-500 hover:text-red-700 text-sm underline"
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
          {submitted && !file && (
            <p className="text-red-500 text-sm mt-2">Please select a file.</p>
          )}
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div className="text-sm">
            {/* Categories moved up */}
            <div className="my-4 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full text-left px-4 py-2 border-2 border-blue rounded-[12px] text-black placeholder-blue text-[16px] flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue bg-white shadow-md hover:bg-blue/10 transition"
                aria-haspopup="listbox"
                aria-expanded={categoryDropdownOpen}
              >
                <span className={`${categories.length === 0 ? "text-blue" : "font-semibold"}`}>
                  {selectedCategoriesText}
                </span>
                <svg
                  className={`w-5 h-5 text-blue transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : "rotate-0"
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
                  className="absolute z-50 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-blue bg-white shadow-2xl focus:outline-none animate-fade-in p-2 space-y-1"
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
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition cursor-pointer select-none group ${checked
                            ? "bg-blue/10 text-blue font-semibold"
                            : "hover:bg-blue/5 text-black"
                          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => {
                          if (!disabled) toggleCategory(category);
                        }}
                        role="option"
                        aria-selected={checked}
                        tabIndex={-1}
                      >
                        <span className={`w-5 h-5 flex items-center justify-center border-2 rounded-md ${checked ? "border-blue bg-blue/80" : "border-blue bg-white"}`}>
                          {checked && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          )}
                        </span>
                        <span className="flex-1">{category}</span>
                        {checked && <span className="text-xs text-blue font-bold">Selected</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {submitted && categories.length === 0 && (
              <p className="text-red-500 text-sm mt-2">Please select at least one category.</p>
            )}

            {/* Always show caption */}
            <div className="mb-6 mt-2">
              <textarea
                placeholder="Add a caption..."
                className="w-full p-3 border-2 border-blue text-black placeholder:text-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-[16px]"
                rows={4}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                required
              />
            </div>

            {/* --- Segmented Button Mode Selector --- */}
            <div className="flex gap-2 my-4">
              {[
                { value: "open", label: "Open Suggestions" },
                { value: "vote_only", label: "Vote Only" },
                { value: "hybrid", label: "Hybrid" },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`px-5 py-2 rounded-full font-semibold text-sm transition
                    ${mode === opt.value
                      ? "bg-blue text-white shadow"
                      : "bg-white text-blue border border-blue hover:bg-blue/10"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue`}
                  onClick={() => setMode(opt.value as "open" | "vote_only" | "hybrid")}
                  aria-pressed={mode === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* --- End Segmented Button Mode Selector --- */}

            {/* Show options for vote_only/hybrid */}
            {(mode === "vote_only" || mode === "hybrid") && (
              <div className="flex flex-col gap-2 mb-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 group bg-blue/5 rounded-lg px-2 py-1">
                    <span className="w-8 text-right text-blue font-bold">{idx + 1}.</span>
                    <input
                      type="text"
                      className="flex-1 p-3 border-2 border-blue text-black placeholder:text-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-[16px]"
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={e => handleOptionChange(idx, e.target.value)}
                      required
                    />
                    {options.length > 1 && (
                      <button
                        type="button"
                        className="ml-1 text-red-500 hover:text-red-700 text-lg font-bold px-2 py-1 rounded-full transition-opacity opacity-80 group-hover:opacity-100"
                        onClick={() => removeOption(idx)}
                        aria-label={`Remove option ${idx + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/80 transition w-fit self-start flex items-center gap-2 shadow-sm"
                  onClick={addOption}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Add Option
                </button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 bg-pink text-white font-semibold text-[16px] py-[15px] px-6 rounded-full shadow-lg hover:bg-pink/80 focus:outline-none focus:ring-2 focus:ring-pink transition disabled:opacity-60 disabled:cursor-not-allowed`}
              style={{ boxShadow: '0 4px 16px 0 rgba(255, 0, 128, 0.10)' }}
              onClick={e => {
                if (!walletAddress) {
                  e.preventDefault(); // Always prevent submit if not connected
                  if (openConnectModal) {
                    openConnectModal();
                  } else {
                    alert("No wallet connection modal available");
                  }
                }
              }}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              ) : (
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              )}
              <span>{isSubmitting ? "Submitting..." : (walletAddress ? "Submit Entry" : "Connect Wallet to Submit")}</span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}