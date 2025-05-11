import React from 'react'
import { BaseWalletAddress } from "@/components/walletAddress";
import { Logo } from "@/components/logo";
import ResponsiveNavbar from '@/components/navbar';
import CreateForm from '@/components/createForm';



export default function Submit() {
    return (
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
            "
        >
            <header className="flex justify-between">
                <Logo />
                <BaseWalletAddress />
            </header>
                <section>
                    <h1 className='text-[42px] md:text-[56px] font-semibold mt-[40px] text-pink'>Upload</h1>
                    <p className='text-[15px] md:text-[20px]'>Bring your idea to life — upload an image or a GIF, suggest a name, and let the community make it unforgettable.</p>
                </section>

                <hr className='h-[3px] bg-blue mt-[40px]' />

                <CreateForm />
            <footer>
                <ResponsiveNavbar />
            </footer>
        </main>
    );
}