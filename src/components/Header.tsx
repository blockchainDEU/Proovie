"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <div>
      <div className=" w-full z-40 border-b-4 border-[#EB5353]">
        <nav className="2xl:container 2xl:mx-auto sm:py-2 sm:px-3 py-2 px-1">
          <div className="flex justify-between ">
            <Link href={'/'} className="">
                <div className=" text-[#EB5353] font-mono font-bold text-3xl italic">
                   Proovie 
                </div>
            </Link>
            <div className=' my-auto '>
                <w3m-button/>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Header