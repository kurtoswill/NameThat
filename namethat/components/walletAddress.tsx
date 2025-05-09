import React from 'react'

export const WalletAddress = () => {
  return (
    <div className="flex items-center w-[155px] h-[50px] rounded-[12px] border-2 border-blue bg-[#FFFDF6] px-3">
        {/* Avatar */}
            <div className="w-[30px] h-[30px] rounded-full bg-blue flex items-center justify-center overflow-hidden mr-3">
                <img
                src="/images/placeholder.png" 
                alt="Wallet Avatar"
                className="w-full h-full object-cover"
                />
            </div>
            {/* Wallet Address */}
            <span className="text-[15px] font-medium text-black">0x38a5310...</span>
    </div>

  )
}
