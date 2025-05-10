import React from 'react'
import { WalletAddress } from "@/components/walletAddress";
import { Logo } from "@/components/logo";
import { Navbar } from '@/components/navbar';

export default function Profile() {
    return (
        <main className="bg-[#FFFDF6] m-[25px]">
            <header className="flex justify-between">
                <Logo />
                <WalletAddress />
            </header>
            
            <footer>
                <Navbar />
            </footer>
        </main>
    );
}