import React from 'react'
import { BaseWalletAddress } from "@/components/walletAddress";
import { Logo } from "@/components/logo";
import ResponsiveNavbar from '@/components/navbar';

export default function Submit() {
    return (
        <main className="bg-[#FFFDF6] m-[25px]">
            <header className="flex justify-between">
                <Logo />
                <BaseWalletAddress />
            </header>
            
            <footer>
                <ResponsiveNavbar />
            </footer>
        </main>
    );
}