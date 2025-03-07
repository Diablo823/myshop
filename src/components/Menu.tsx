"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { navLinksMenu } from "@/constants";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle scroll lock when the menu is open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = '';
    };
  }, [open]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (open && !target.closest(".menu-container")) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Handle link clicks
  const handleLinkClick = (route: string) => {
    router.push(route);
    setOpen(false);
  };

  return (
    <>
      {/* Menu Icon */}
      <div className="menu-container relative z-30">
        <GiHamburgerMenu
          size={22}
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer"
        />
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          open
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-black transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col p-6 gap-6 bg-white">
          {navLinksMenu.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.route)}
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Menu;
