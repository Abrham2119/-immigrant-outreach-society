"use client";
import Logo from "@/assets/logo.png";
import Image from "next/image";

const Header = () => {
  return (
    <>
      <div className="sticky top-section top-0 z-50 w-full h-[43px] flex items-center justify-between bg-white border-b border-[#C4C4C4] px-3 md:px-6">
        <div className="flex items-center">
          <Image src={Logo} alt="HabariDOC Logo" width={100} height={100} />
        </div>
      </div>
    </>
  );
}

export default Header; 