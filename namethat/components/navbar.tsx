/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BaseWalletAddress as WalletAddress } from "./walletAddress"; // <-- Import the shared WalletAddress

// Placeholder Logo
const Logo = () => (
  <div className="w-10 h-10 rounded-full bg-blue flex items-center justify-center text-white font-bold select-none">
    {/* Replace with your SVG or image */}
    <span></span>
  </div>
);

// Icons as React components
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 -960 960 960">
      <path d="M180-120q-25 0-42.5-17.5T120-180v-76l160-142v278H180Zm140 0v-160h320v160H320Zm360 0v-328L509-600l121-107 190 169q10 9 15 20.5t5 24.5v313q0 25-17.5 42.5T780-120H680ZM120-310v-183q0-13 5-25t15-20l300-266q8-8 18.5-11.5T480-819q11 0 21.5 3.5T520-804l80 71-480 423Z" />
    </svg>
  );
}
function ExploreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 -960 960 960">
      <path d="m300-300 280-80 80-280-280 80-80 280Zm180-120q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z" />
    </svg>
  );
}
function CreateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 -960 960 960">
      <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}
function LeaderboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 -960 960 960">
      <path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240ZM80-120v-480h240v-240h320v320h240v400H80Z" />
    </svg>
  );
}
function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 -960 960 960">
      <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
    </svg>
  );
}

const navItems = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Explore", href: "/explore", icon: ExploreIcon },
  { name: "Leaderboards", href: "/leaderboard", icon: LeaderboardIcon },
  { name: "Profile", href: "/profile", icon: ProfileIcon },
];

export default function ResponsiveNavbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Navbar (top) */}
      <nav className="hidden md:flex items-center justify-between bg-[#FFFDF6] px-[200px] py-6 shadow-md fixed top-0 left-0 right-0 z-50 border-blue">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center">
          <Logo />
          <div className="flex space-x-1 ml-4">
            {navItems.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-blue font-semibold text-[16px] hover:bg-blue/10 transition ${
                  isActive(href) ? "text-pink" : ""
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Create icon + WalletAddress */}
        <div className="flex items-center space-x-6">
          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-md font-semibold hover:bg-blue/80 transition"
            aria-label="Create new item"
          >
            <CreateIcon className="w-6 h-6" />
            <span>Create</span>
          </Link>
          <WalletAddress /> {/* Desktop only */}
        </div>
      </nav>

      {/* WalletAddress for mobile (top, same x axis as logo) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#FFFDF6] py-2 shadow">
        <div className="flex items-center justify-between px-4">
          <Logo />
          <WalletAddress />
        </div>
      </div>

      {/* Mobile Navbar (bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-blue bg-opacity-90 backdrop-blur-md rounded-t-[12px] shadow-lg z-40 flex justify-around items-center py-3 md:hidden">
        {/* Home */}
        <Link href="/" aria-label="Home">
          <HomeIcon
            className={`w-7 h-7 text-white cursor-pointer ${
              isActive("/") ? "opacity-100" : "opacity-60"
            }`}
          />
        </Link>
        {/* Explore */}
        <Link href="/explore" aria-label="Explore">
          <ExploreIcon
            className={`w-7 h-7 text-white cursor-pointer ${
              isActive("/explore") ? "opacity-100" : "opacity-60"
            }`}
          />
        </Link>
        {/* Create (centered and bigger) */}
        <Link
          href="/create"
          aria-label="Create"
          className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue shadow-lg"
        >
          <CreateIcon className="w-8 h-8" />
        </Link>
        {/* Leaderboards */}
        <Link href="/leaderboard" aria-label="Leaderboards">
          <LeaderboardIcon
            className={`w-7 h-7 text-white cursor-pointer ${
              isActive("/leaderboard") ? "opacity-100" : "opacity-60"
            }`}
          />
        </Link>
        {/* Profile */}
        <Link href="/profile" aria-label="Profile">
          <ProfileIcon
            className={`w-7 h-7 text-white cursor-pointer ${
              isActive("/profile") ? "opacity-100" : "opacity-60"
            }`}
          />
        </Link>
        {/* WalletAddress removed from here */}
      </nav>
      {/* Spacer for desktop navbar */}
      <div className="hidden md:block" style={{ height: 80 }} />
    </>
  );
}
