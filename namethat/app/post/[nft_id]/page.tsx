"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResponsiveNavbar from "@/components/navbar";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Option {
  id: number | string;
  suggestion_text: string; // now a string, not an array
  votes: number; // now a number, not an array
  suggestion_row_id?: string;
  option_index?: number;
}

interface NFT {
  user_id: string;
  id: string;
  image_url: string;
  caption?: string;
  mode: "open_suggestion" | "vote_only" | "hybrid";
  options: Option[];
  created_at: string;
  // uploader_username removed since we fetch username separately now
}

export default function PostPage() {
  const params = useParams();
  const nft_id = params.nft_id as string;

  const [nft, setNft] = useState<NFT | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);
  const [votedId, setVotedId] = useState<number | string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const supabase = createClientComponentClient();

  // Fetch NFT data by id
  useEffect(() => {
    if (!nft_id) return;

    async function fetchNFT() {
      setLoading(true);
      try {
        const res = await fetch(`/api/nft/explore?id=${nft_id}`);
        const json = await res.json();
        if (json.nft) {
          // Only allow valid submission_type values
          const validModes = ["open_suggestion", "vote_only", "hybrid"];
          const mode = json.nft.submission_type;
          if (!validModes.includes(mode)) {
            setNft(null);
            setOptions([]);
            setLoading(false);
            return;
          }
          setNft({ ...json.nft, mode });

          // Always fetch and display suggestions for all modes
          const suggRes = await fetch(`/api/nft/suggestions?nft_id=${nft_id}`);
          const suggJson = await suggRes.json();
          setOptions(Array.isArray(suggJson.suggestions) ? suggJson.suggestions : []);
        } else {
          setNft(null);
        }
      } catch {
        setNft(null);
      }
      setLoading(false);
    }

    fetchNFT();

    // --- Supabase Realtime subscription for suggestions table ---
    const channel = supabase
      .channel("realtime-suggestions-" + nft_id)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "suggestions",
          filter: `nft_id=eq.${nft_id}`,
        },
        () => {
          fetchNFT();
        }
      )
      .subscribe();

    // Optionally, listen for changes to the NFT itself (e.g., mode changes)
    const nftChannel = supabase
      .channel("realtime-nft-" + nft_id)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "nfts",
          filter: `id=eq.${nft_id}`,
        },
        () => {
          fetchNFT();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(nftChannel);
    };
  }, [nft_id, supabase]);

  // Fetch uploader username by nft.user_id
  useEffect(() => {
    if (!nft?.user_id) {
      setUsername(null);
      return;
    }

    async function fetchUsername() {
      if (!nft || !nft.user_id) {
        setUsername(null);
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", nft.user_id)
        .single();

      if (error || !data) {
        setUsername(null);
      } else {
        setUsername(data.username);
      }
    }

    fetchUsername();
  }, [nft, supabase]);

  // --- Add suggestion logic for open/hybrid ---
  const [suggestionInput, setSuggestionInput] = useState("");
  const [localSuggestions, setLocalSuggestions] = useState<string[]>([]);

  const handleAddLocalSuggestion = async () => {
    const trimmed = suggestionInput.trim();
    if (!trimmed) return;
    if (localSuggestions.includes(trimmed)) return;
    setLocalSuggestions(prev => [...prev, trimmed]);
    setSuggestionInput("");
    // Submit to backend so it's visible to others
    try {
      const res = await fetch("/api/nft/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nft_id, suggestion: trimmed }),
      });
      if (!res.ok) throw new Error("Failed to add suggestion");
      // No need to update options here; realtime will update
    } catch {
      alert("Failed to add suggestion");
    }
  };


  const handleVote = (id: number | string) => {
    if (votedId !== null) return;
    setOptions(prevOptions =>
      prevOptions.map(option => {
        if (option.id === id) {
          return { ...option, votes: (option.votes || 0) + 1 };
        }
        return option;
      })
    );
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

  if (loading) return <div className="text-center justify-center">Loading...</div>;
  if (!nft) return <div>Post not found.</div>;

  // --- Destructure here, so TS knows nft is not null ---
  const { image_url, caption, mode } = nft;

  const showAddSuggestion = mode === "open_suggestion" || mode === "hybrid";
  // Always display options, even in open_suggestion mode
  // Normalize options: if a single row with stringified arrays, flatten to individual options
  let displayOptions: Option[] = [];
  if (
    options.length === 1 &&
    typeof options[0].suggestion_text === 'string' &&
    options[0].suggestion_text.startsWith('[')
  ) {
    // Parse arrays
    let suggestionsArr: string[] = [];
    let votesArr: number[] = [];
    try {
      suggestionsArr = JSON.parse(options[0].suggestion_text);
      const votesRaw = options[0].votes as unknown;
      if (Array.isArray(votesRaw)) {
        votesArr = votesRaw.map(Number);
      } else if (typeof votesRaw === 'string' && votesRaw.startsWith('[')) {
        votesArr = JSON.parse(votesRaw).map(Number);
      } else {
        votesArr = [Number(votesRaw)];
      }
    } catch {
      suggestionsArr = [];
      votesArr = [];
    }
    displayOptions = suggestionsArr.map((s, i) => ({
      id: `${options[0].id}-${i}`,
      suggestion_text: s,
      votes: votesArr[i] !== undefined ? Number(votesArr[i]) : 0,
      suggestion_row_id: typeof options[0].suggestion_row_id === 'string' ? options[0].suggestion_row_id : String(options[0].id),
      option_index: i,
    }));
    // Always keep options normalized in state
    if (options.length !== displayOptions.length) {
      setOptions(displayOptions);
      return null; // Prevent double-normalization
    }
  } else if (Array.isArray(options)) {
    // Already normalized
    displayOptions = (options as Option[]).filter(o => typeof o.suggestion_text === 'string').map((o, i) => ({
      ...o,
      id: o.id ?? String(i),
      votes: typeof o.votes === 'number' ? o.votes : Number(o.votes) || 0,
    }));
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
            {image_url ? (
              <Image
                src={image_url}
                alt={caption || "NFT"}
                width={320}
                height={320}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500">No image</span>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-[15px] md:text-[18px] text-black/80">
              {caption ? caption : <span className="italic text-gray-400">No caption provided.</span>}
            </p>
            <p className="text-xs font-semibold text-black/60">
              {username ? `${username}` : <span className='italic text-gray-400'>Unknown user</span>}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <button className="bg-blue text-white rounded-[10px] px-4 py-1 text-[15px] font-semibold">
                {mode === "hybrid"
                  ? "Hybrid"
                  : mode === "open_suggestion"
                  ? "Open Suggestion"
                  : "Vote Only"}
              </button>
              <div className="ml-auto flex items-center gap-2">
                <button
                  className="flex items-center gap-1 bg-blue text-white rounded-[10px] px-4 py-1 text-[15px] font-semibold"
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
            </div>
            {showAddSuggestion && mode === "open_suggestion" && (
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 p-3 border-2 border-blue text-black placeholder:text-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue text-[16px]"
                    placeholder="Type a suggestion and press +"
                    value={suggestionInput}
                    onChange={e => setSuggestionInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === '+') {
                        e.preventDefault();
                        handleAddLocalSuggestion();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="bg-blue text-white rounded-lg px-3 py-2 font-bold text-lg hover:bg-blue/80 transition disabled:opacity-50"
                    onClick={handleAddLocalSuggestion}
                    disabled={!suggestionInput.trim()}
                    aria-label="Add suggestion"
                  >
                    +
                  </button>
                </div>
                {/* List of added suggestions, styled like vote_only options, not removable */}
                {localSuggestions.length > 0 && (
                  <div className="flex flex-col gap-1 mt-2">
                    {localSuggestions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span
                          className={"font-semibold text-[18px] flex-1 transition-colors text-blue"}
                          style={{ minWidth: 0, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {opt}
                        </span>
                        <div className="flex-1 flex items-center max-w-[320px] min-w-[120px]">
                          <div className="relative w-full h-7">
                            <div className="absolute top-0 left-0 w-full h-full rounded-full border border-blue bg-white" />
                            <div
                              className="absolute top-0 left-0 h-full rounded-full bg-blue"
                              style={{ width: `10%`, minWidth: 28 }}
                            />
                          </div>
                        </div>
                        <span className="text-[13px] text-black/60 min-w-[110px] text-right">
                          0 votes
                        </span>
                        <button
                          className="rounded-full px-4 py-1 text-[15px] bg-blue text-white opacity-50 cursor-not-allowed"
                          disabled
                        >
                          Vote
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex flex-col gap-4">
              {displayOptions.length === 0 ? (
                <div className="text-gray-400 italic">No suggestions yet.</div>
              ) : (
                displayOptions.map((option, idx) => {
                  const voteCount = option.votes;
                  const optionKey = option.id;
                  return (
                    <div className="flex items-center gap-4" key={optionKey}>
                      <span
                        className={`font-semibold text-[18px] flex-1 transition-colors ${votedId === optionKey ? "text-pink" : ""}`}
                        style={{ minWidth: 0, maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {option.suggestion_text}
                      </span>
                      <div className="flex-1 flex items-center max-w-[320px] min-w-[120px]">
                        <div className="relative w-full h-7">
                          <div className="absolute top-0 left-0 w-full h-full rounded-full border border-blue bg-white" />
                          <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all ${votedId === optionKey ? "bg-pink" : "bg-blue"}`}
                            style={{ width: `${Math.max(10, voteCount)}%`, minWidth: 28 }}
                          />
                        </div>
                      </div>
                      <span className="text-[13px] text-black/60 min-w-[110px] text-right">
                        {voteCount.toLocaleString()} {voteCount === 1 ? "vote" : "votes"}
                      </span>
                      <button
                        className={`rounded-full px-4 py-1 text-[15px] transition-colors ${votedId === optionKey ? "bg-pink text-white opacity-80 cursor-default" : "bg-blue text-white hover:bg-blue/80"}`}
                        disabled={votedId !== null}
                        onClick={() => handleVote(option.id)}
                      >
                        {votedId === optionKey ? "Voted" : "Vote"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
