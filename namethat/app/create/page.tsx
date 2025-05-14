import CreateForm from '@/components/createForm';
import ResponsiveNavbar from '@/components/navbar';
import React from 'react';

export default function Create() {
    return (
        <>
            {/* Navbar always on top */}
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
                "
            >
                {/* No header here, navbar handles logo and wallet */}
                <section>
                    <h1 className='text-[42px] md:text-[56px] font-semibold text-pink'>Upload</h1>
                </section>

                <hr className='h-[3px] bg-blue mt-[20px]' />

                <CreateForm />
            </main>
        </>
    );
}