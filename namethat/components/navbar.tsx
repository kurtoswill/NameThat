"use client";

import React from "react";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  // Helper to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue bg-opacity-90 backdrop-blur-md rounded-t-[12px] shadow-lg z-50">
      <div className="flex justify-center gap-x-[20px] items-center py-[20px]">
        {/* Home */}
        <a href="/home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-[45px] h-[45px] text-white cursor-pointer ${
              isActive("/home") ? "opacity-100" : "opacity-50"
            }`}
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="M180-120q-25 0-42.5-17.5T120-180v-76l160-142v278H180Zm140 0v-160h320v160H320Zm360 0v-328L509-600l121-107 190 169q10 9 15 20.5t5 24.5v313q0 25-17.5 42.5T780-120H680ZM120-310v-183q0-13 5-25t15-20l300-266q8-8 18.5-11.5T480-819q11 0 21.5 3.5T520-804l80 71-480 423Z" />
          </svg>
        </a>

        {/* Explore */}
        <a href="/explore">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-[45px] h-[45px] text-white cursor-pointer ${
              isActive("/explore") ? "opacity-100" : "opacity-50"
            }`}
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z" />
          </svg>
        </a>

        {/* Create */}
        <a href="/create">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[60px] h-[60px] text-white cursor-pointer"
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
        </a>

        {/* Leaderboards */}
        <a href="/leaderboard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-[45px] h-[45px] text-white cursor-pointer ${
              isActive("/leaderboard") ? "opacity-100" : "opacity-50"
            }`}
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240ZM80-120v-480h240v-240h320v320h240v400H80Z" />
          </svg>
        </a>

        {/* Profile */}
        <a href="/profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-[45px] h-[45px] text-white cursor-pointer ${
              isActive("/profile") ? "opacity-100" : "opacity-50"
            }`}
            fill="currentColor"
            viewBox="0 -960 960 960"
          >
            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
