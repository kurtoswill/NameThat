import { WalletAddress } from "@/components/walletAddress";
import { Logo } from "@/components/logo";



export default function Home() {
  return (
    <main className="bg-[#FFFDF6] m-[25px]">
      <header className="flex gap-[140px]">
        <Logo />
        <WalletAddress />
      </header>
      
    </main>
  );
}