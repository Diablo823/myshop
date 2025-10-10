"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Image from "next/image";
import SearchBar from "./SearchBar";
//import NavIcons from "./NavIcons";
import { navLinks } from "@/constants";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  const wixClient = useWixClient();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { counter, getCart } = useCartStore();

  const pathName = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <div
      className={`${
        pathName === "/success"
          ? "hidden"
          : `fixed w-full h-16 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-white z-30 transition-all duration-300 origin-top shadow-lg rounded-b-3xl ${
              visible
                ? "h-16 transform-none opacity-100"
                : "h-0 -translate-y-full opacity-0"
            }`
      }`}
    >
      <div className="flex items-center justify-between h-full md:hidden">
        {/* MOBILE */}
        <Link href="/">
          {/* <div className="text-2xl font-bold tracking-wider text-nowrap">US CARTEL</div> */}
          {
            <Image
              src="/logo.png"
              alt="US Cartel logo"
              width={110}
              height={28}
              className="image-container"
            />
          }
        </Link>
        <div className="w-full px-4 py-2">
          <SearchBar />
        </div>
        <div className="flex gap-4 items-center">
        <div
            className="relative cursor-pointer"
            onClick={() => setIsCartOpen((prev) => !prev)}
          >
            <FaShoppingCart size={20} className="text-gray-900" />
            <div className="absolute -top-4 -right-3 bg-black rounded-full w-5 h-5 flex items-center justify-center text-sm text-white">
              {counter}
            </div>
          </div>
          {/* {isCartOpen && <CartModal />} */}
          <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />

          <Menu />
        </div>
      </div>

      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="US Cartel Shop"
              width={130}
              height={18}
              className="image-container"
            />
            {/* <div className="text-3xl font-bold text-nowrap tracking-wider">US CARTEL</div> */}
          </Link>
          <div className="hidden xl:flex gap-4">
            {navLinks.map((link) => (
              <Link
                href={link.route}
                key={link.label}
                className="tracking-wide text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

/* className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-slate-100 fixed w-full z-20" */

/* ${
      visible ? 'bg-slate-100' : 'bg-transparent invisible'
    } */

/* ${
      visible ? 'opacity-100 visible' : 'opacity-0 invisible'
    }` */

/* ${
      visible ? 'h-20' : 'h-0 invisible overflow-hidden'
    } */

/* ${
      visible ? 'h-20 border-b border-gray-200' : 'h-0 border-none invisible overflow-hidden'
    } */

/* <div className={`fixed w-full h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-slate-100 z-30 transition-all duration-300 ${
      visible ? 'h-20' : 'h-0 invisible overflow-hidden'
    }`}> */
