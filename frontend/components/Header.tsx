"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
    option?: string;
    href?: string;
}

export default function Header( {option, href}: HeaderProps) {
  const router = useRouter();
    console.log(option, href)
  return (
    <header className="w-full border-b px-10 border-[#2F2F2F] bg-[#191919]">
      <div className=" PX-10 mx-auto px- py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer px-3 font-semibold py-1 border border-[#999999] text-[13px] text-[#EDEDED] tracking-wide hover:bg-[#202020] transition"
        >
          motion
        </div> 
        {/* Nav */}
        <button
        className="border border-[#2F2F2F] text-[#EDEDED] py-1 px-4 rounded-lg text-xs   hover:bg-[#202020] transition"
        onClick={(e)=>{
            router.push(href || "/")
        }}
        >
            {option } 
        </button>
      </div>
    </header>
  );
}