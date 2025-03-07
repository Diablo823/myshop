"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { navLinks } from "@/constants";
import dynamic from "next/dynamic";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const NewNav = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY || document.documentElement.scrollTop;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <div
      className={`fixed w-full h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-slate-100 transition-transform duration-300 z-50 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between h-full md:hidden">
        <Link href="/">
          <Image src="/uscartel.png" alt="logo" width={170} height={28} />
        </Link>
        <div className="w-full px-4 py-2">
          <SearchBar />
        </div>
        <Menu />
      </div>

      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/">
            <Image src="/uscartel.png" alt="logo" width={150} height={18} />
          </Link>
          <div className="hidden xl:flex gap-4">
            {navLinks.map((link) => (
              <Link href={link.route} key={link.label}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default NewNav;
