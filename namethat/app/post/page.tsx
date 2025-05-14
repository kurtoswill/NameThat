"use client";

import ResponsiveNavbar from "@/components/navbar";
import React, { useState } from "react";

export default function PostPage() {
  const [options, setOptions] = useState([{ value: "", id: Date.now() }]);
  const [names, setNames] = useState([
    { id: 1, name: "Yuki Nanami", votes: 15321044 },
    { id: 2, name: "Nao Tamori", votes: 10321044 },
    { id: 3, name: "Kiyotaka Ayanokoji", votes: 9321044 },
  ]);
  const [votedId, setVotedId] = useState<number | null>(null);

  const handleOptionChange = (idx: number, val: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === idx ? { ...opt, value: val } : opt)),
    );
  };

  const handleAddOption = () => {
    // Only add if last input is not empty
    const last = options[options.length - 1];
    if (!last.value.trim()) return;
    setNames((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: last.value,
        votes: 0,
      },
    ]);
    setOptions([{ value: "", id: Date.now() }]);
  };

  const handleDeleteOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleVote = (id: number) => {
    if (votedId !== null) return;
    setNames((prev) =>
      prev.map((n) => (n.id === id ? { ...n, votes: n.votes + 1 } : n)),
    );
    setVotedId(id);
  };

  return (
    <>
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
        <section>
          <h1 className="text-[42px] md:text-[56px] font-semibold text-pink">
            Vote
          </h1>
        </section>
        <hr className="h-[3px] bg-blue mt-[20px]" />

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <div className="w-full md:w-[320px] h-[320px] bg-gray-400 rounded-lg mx-auto md:mx-0" />
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-[15px] md:text-[18px] text-black/80">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
            <div className="text-xs font-semibold text-black/60 mb-2">
              Company Name
            </div>
            <div className="flex items-center gap-4 mb-2">
              <button className="bg-blue text-white rounded-[10px] px-4 py-1 text-[15px] font-semibold">
                Hybrid
              </button>
              <button
                className="ml-auto flex items-center gap-1 bg-blue text-white rounded-[10px] px-4 py-1 text-[15px] font-semibold"
                style={{ minWidth: 0 }}
              >
                Share
                <span className="inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    viewBox="0 -960 960 960"
                    width="16"
                    fill="#e3e3e3"
                  >
                    <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
                  </svg>
                </span>
              </button>
            </div>
            {/* Suggestions */}
            <div className="flex flex-col gap-2 mt-2">
              {options.map((option, idx) => (
                <div key={option.id} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-[#f7f8fa] rounded-xl px-4 py-2">
                    <span className="text-blue font-semibold mr-2">
                      {idx + 1}.
                    </span>
                    <input
                      className="flex-1 px-4 py-2 bg-white border-2 border-blue rounded-lg outline-none text-[16px] text-blue placeholder:text-blue font-medium"
                      placeholder="Your Suggestion"
                      value={option.value}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                    />
                  </div>
                  {options.length > 1 && (
                    <button
                      type="button"
                      className="bg-transparent hover:bg-red-100 text-red-500 rounded-full p-2 transition"
                      onClick={() => handleDeleteOption(idx)}
                      aria-label="Delete option"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="mt-2 w-fit bg-blue text-white rounded-[10px] px-5 py-2 text-[16px] font-normal flex items-center gap-2"
                onClick={handleAddOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18"
                  viewBox="0 0 24 24"
                  width="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Suggestion
              </button>
            </div>
            {/* Voting List */}
            <div className="mt-6 flex flex-col gap-4">
              {(() => {
                // Find the highest vote count for relative bar width
                const maxVotes = Math.max(...names.map((n) => n.votes), 1);
                return names.map((n) => (
                  <div className="flex items-center gap-4" key={n.id}>
                    <span
                      className={`font-semibold text-[18px] flex-1 transition-colors ${
                        votedId === n.id ? "text-pink" : ""
                      }`}
                      style={{
                        minWidth: 0,
                        maxWidth: 180,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {n.name}
                    </span>
                    <div className="flex-1 flex items-center max-w-[320px] min-w-[120px]">
                      <div className="relative w-full h-7">
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-blue bg-white" />
                        <div
                          className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                            votedId === n.id ? "bg-pink" : "bg-blue"
                          }`}
                          style={{
                            width: `${Math.max(10, (n.votes / maxVotes) * 100)}%`,
                            minWidth: 28,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-[13px] text-black/60 min-w-[110px] text-right">
                      {n.votes.toLocaleString()}{" "}
                      {n.votes === 1 ? "vote" : "votes"}
                    </span>
                    <button
                      className={`rounded-full px-4 py-1 text-[15px] transition-colors
                        ${
                          votedId === n.id
                            ? "bg-pink text-white opacity-80 cursor-default"
                            : "bg-blue text-white hover:bg-blue/80"
                        }
                      `}
                      disabled={votedId !== null}
                      onClick={() => handleVote(n.id)}
                    >
                      {votedId === n.id ? "Voted" : "Vote"}
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
