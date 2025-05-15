/* eslint-disable @next/next/no-img-element */
import ResponsiveNavbar from "@/components/navbar";
import React from "react";

export default function Leaderboard() {
  const leaderboardData = [
    {
      rank: 1,
      name: "Sung Jin Woo | NFT",
      votes: "133,321,043",
      img: "/images/JinWoo.jpg",
      icon: "/icons/gold.png",
      color: "text-darkGold",
    },
    {
      rank: 2,
      name: "Leo Natsume | User",
      votes: "100,121,483",
      img: "/images/LeoNatsume.jpg",
      icon: "/icons/silver.png",
      color: "text-darkSilver",
    },
    {
      rank: 3,
      name: "Beat Killer | User",
      votes: "100,121,483",
      img: "/images/Beast.jpg",
      icon: "/icons/bronze.png",
      color: "text-bronze",
    },
    ...Array.from({ length: 7 }).map((_, i) => ({
      rank: i + 4,
      name: "Beat Killer",
      votes: "100,121,483",
      img: "/images/Beast.jpg",
      color: "text-darkSilver",
    })),
  ];

  const getRowGradient = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-gold/40 to-white/0";
    if (rank === 2) return "bg-gradient-to-br from-darkSilver/40 to-white/0";
    if (rank === 3) return "bg-gradient-to-br from-bronze/40 to-white/0";
    return "bg-gradient-to-br";
  };

  const getShadowStyle = () => {
    return "shadow-md shadow-black/10";
  };

  return (
    <>
      <ResponsiveNavbar />
      <main className="bg-[#FFFDF6] m-[25px] md:m-0 md:px-[200px] md:py-[40px] md:rounded-[24px] md:shadow-lg min-h-screen flex flex-col pb-24">
        {/* No header here, navbar handles logo and wallet */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <section className="text-left w-full mt-0">
            <h1 className="text-[42px] md:text-[56px] font-semibold text-pink">
              Leaderboards
            </h1>
            <p className="text-[15px] md:text-[20px]">
              Climb the ranks by earning the most community votes—only the most
              loved rise to the top.
            </p>
          </section>

          <hr className="h-[3px] bg-blue mt-[40px] w-full" />

          <div className="mt-[24px] w-full flex flex-col items-center gap-4">
            {leaderboardData.map((item, index) => (
              <section
                key={index}
                className={`
                  flex items-center justify-between
                  gap-[20px]
                  px-[20px] py-[16px]
                  rounded-[12px] w-full
                  max-w-none md:max-w-full
                  ${getRowGradient(item.rank)}
                  ${getShadowStyle()}
                `}
              >
                {/* Rank */}
                <div
                  className={`text-[40px] font-bold italic w-[40px] text-center ${item.color}`}
                >
                  {item.rank}
                </div>

                {/* Avatar + Name/Votes (left-aligned) */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-[72px] w-[72px] rounded-[12px]"
                  />
                  <div className="flex flex-col justify-center">
                    <span className="text-[20px] font-semibold">
                      {item.name}
                    </span>
                    <span className="text-[14px]">{item.votes} votes</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-[32px]">
                  {item.rank <= 3 ? (
                    <img
                      src={item.icon}
                      className="h-[25px] w-[25px]"
                      alt="Trophy"
                    />
                  ) : (
                    <div className="h-[25px] w-[25px]" />
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
