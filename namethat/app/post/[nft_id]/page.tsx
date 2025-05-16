"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResponsiveNavbar from "@/components/navbar";
import Image from "next/image";

interface Option {
  id: number | string;
  name: string;
  votes: number;
}

interface NFT {
  id: string;
  image_url: string;
  name: string;
  caption?: string;
  mode: "open" | "vote_only" | "hybrid";
  options: Option[];
  suggestion_text?: string[]; // now an array
  created_at: string;
  // ...other fields
}

export default function PostPage() {
  const params = useParams();
  const nft_id = params.nft_id as string;
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [votedId, setVotedId] = useState<number | string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!nft_id) return;
    async function fetchNFT() {
      setLoading(true);
      try {
        const res = await fetch(`/api/nft/explore?id=${nft_id}`);
        const json = await res.json();
        if (json.nft) {
          setNft(json.nft);
          // --- Option logic for all modes ---
          if (json.nft.mode === "vote_only") {
              // Only uploader's options (from suggestion_text array)
            if (Array.isArray(json.nft.suggestion_text) && json.nft.suggestion_text.length > 0) {
              setOptions(json.nft.suggestion_text.map((text: string, idx: number) => ({
                id: idx + 1,
                name: text,
                votes: 0,
              })));
            } else {
              setOptions([]);
            }
          } else if (json.nft.mode === "open") {
            // Only user suggestions (start empty, or from DB if available)
            setOptions([]); // User suggestions will be added client-side
          } else if (json.nft.mode === "hybrid") {
            // Both uploader's and user suggestions
            let uploaderOptions: Option[] = [];
            if (Array.isArray(json.nft.suggestion_text) && json.nft.suggestion_text.length > 0) {
              uploaderOptions = json.nft.suggestion_text.map((text: string, idx: number) => ({
                id: `uploader-${idx + 1}`,
                name: text,
                votes: 0,
              }));
            }
            setOptions(uploaderOptions);
          } else {
            setOptions([]);
          }
        } else {
          setNft(null);
        }
      } catch {
        setNft(null);
      }
      setLoading(false);
    }
    fetchNFT();
  }, [nft_id]);

  // --- Add suggestion logic for open/hybrid ---
  const handleAddSuggestion = () => {
    if (!suggestion.trim()) return;
    setOptions(prev => [
      ...prev,
      { id: `user-${Date.now()}-${Math.random()}`, name: suggestion, votes: 0 },
    ]);
    setSuggestion("");
  };

  const handleVote = (id: number | string) => {
    if (votedId !== null) return;
    setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt));
    setVotedId(id);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1500);
    } catch {
      alert("Failed to copy link");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!nft) return <div>Post not found.</div>;

  // Determine if add suggestion UI should be shown
  const showAddSuggestion = nft.mode === "open" || nft.mode === "hybrid";

  // --- Display options logic ---
  let displayOptions: Option[] = [];
  if (nft.mode === "vote_only") {
    displayOptions = options; // Only uploader's options
  } else if (nft.mode === "open") {
    displayOptions = options; // Only user suggestions
  } else if (nft.mode === "hybrid") {
    displayOptions = options; // Both uploader and user suggestions
  }

  return (
    <>
      <ResponsiveNavbar />
      <main className="bg-[#FFFDF6] m-[25px] md:m-0 md:px-[200px] md:py-[40px] md:rounded-[24px] md:shadow-lg min-h-screen flex flex-col pt-0">
        <section>
          <h1 className="text-[42px] md:text-[56px] font-semibold text-pink">Vote</h1>
        </section>
        <hr className="h-[3px] bg-blue mt-[20px]" />
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <div className="w-full md:w-[320px] h-[320px] bg-gray-400 rounded-lg mx-auto md:mx-0 flex items-center justify-center overflow-hidden">
            {nft.image_url ? (
              <Image src={nft.image_url} alt={nft.caption || "NFT"} width={320} height={320} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500">No image</span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-[15px] md:text-[18px] text-black/80">
              {nft.caption ? nft.caption : <span className="italic text-gray-400">No caption provided.</span>}
            </p>
            <div className="text-xs font-semibold text-black/60 mb-2">Company Name</div>
            <div className="flex items-center gap-4 mb-2">
              <button className="bg-blue text-white rounded-[10px] px-4 py-1 text-[15px] font-semibold">
                {nft.mode === "hybrid" ? "Hybrid" : nft.mode === "open" ? "Open" : "Vote Only"}
              </button>
              <button
                className="ml-auto flex items-center gap-1 bg-blue text-white rounded-[10px] px-4 py-1 text-[15px] font-semibold"
                style={{ minWidth: 0 }}
                onClick={handleShare}
              >
                Share
                <span className="inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="#e3e3e3">
                    <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
                  </svg>
                </span>
              </button>
              {shareCopied && <span className="ml-2 text-green-600 text-xs">Link copied!</span>}
            </div>
            {/* Suggestions (add suggestion UI for open/hybrid) */}
            {showAddSuggestion && (
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-[#f7f8fa] rounded-xl px-4 py-2">
                    <span className="text-blue font-semibold mr-2">1.</span>
                    <input
                      className="flex-1 px-4 py-2 bg-white border-2 border-blue rounded-lg outline-none text-[16px] text-blue placeholder:text-blue font-medium"
                      placeholder="Your Suggestion"
                      value={suggestion}
                      onChange={e => setSuggestion(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-fit bg-blue text-white rounded-[10px] px-5 py-2 text-[16px] font-normal flex items-center gap-2"
                    onClick={handleAddSuggestion}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Suggestion
                  </button>
                </div>
              </div>
            )}
            {/* Voting List */}
            <div className="mt-6 flex flex-col gap-4">
              {displayOptions.length === 0 ? (
                <div className="text-gray-400 italic">No suggestions yet.</div>
              ) : (
                (() => {
                  const maxVotes = Math.max(...displayOptions.map(n => n.votes), 1);
                  return displayOptions.map(n => (
                    <div className="flex items-center gap-4" key={n.id}>
                      <span
                        className={`font-semibold text-[18px] flex-1 transition-colors ${votedId === n.id ? "text-pink" : ""}`}
                        style={{ minWidth: 0, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {n.name}
                      </span>
                      <div className="flex-1 flex items-center max-w-[320px] min-w-[120px]">
                        <div className="relative w-full h-7">
                          <div className="absolute top-0 left-0 w-full h-full rounded-full border border-blue bg-white" />
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all ${votedId === n.id ? "bg-pink" : "bg-blue"}`}
                            style={{ width: `${Math.max(10, (n.votes / maxVotes) * 100)}%`, minWidth: 28 }}
                          />
                        </div>
                      </div>
                      <span className="text-[13px] text-black/60 min-w-[110px] text-right">
                        {n.votes.toLocaleString()} {n.votes === 1 ? "vote" : "votes"}
                      </span>
                      <button
                        className={`rounded-full px-4 py-1 text-[15px] transition-colors ${votedId === n.id ? "bg-pink text-white opacity-80 cursor-default" : "bg-blue text-white hover:bg-blue/80"}`}
                        disabled={votedId !== null}
                        onClick={() => handleVote(n.id)}
                      >
                        {votedId === n.id ? "Voted" : "Vote"}
                      </button>
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
