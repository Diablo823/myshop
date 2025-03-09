"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";
import CartDrawer from "./CartDrawer";
import { FaShoppingCart, FaUser } from "react-icons/fa";

const NavIcons = () => {
  const wixClient = useWixClient();
  const router = useRouter();
  const pathName = usePathname();
  const { cart, counter, getCart } = useCartStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  // console.log(cart);

  // Temporary
  //const isLoggedIn = false;

  // AUTH WITH WIX MANAGED AUTHENTICATION
  //const isLoggedIn = wixClient.auth.loggedIn();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await wixClient.auth.loggedIn();
      setIsLoggedIn(status);
    };
    checkLoginStatus();
  }, [wixClient]);

  const handleProfile = async () => {
    const loginStatus = await wixClient.auth.loggedIn();
    if (!loginStatus) {
      router.push("/authentication");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // Remove the refresh token
      Cookies.remove("refreshToken");

      // Get the logout URL
      const { logoutUrl } = await wixClient.auth.logout(window.location.href);

      // Close the profile dropdown
      setIsProfileOpen(false);

      // Clear any auth-related state
      setIsLoggedIn(false);

      // Force a complete page refresh when logging out
      window.location.href = logoutUrl;
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
      router.refresh();
      router.push("/");
    }
  };

  // AUTH WITH WIX MANAGED AUTHENTICATION
  // const wixClient = useWixClient();

  // const login = async () => {
  //   const loginRequestData = wixClient.auth.generateOAuthData(
  //     "http://localhost:3000/"
  //   );

  //   console.log(loginRequestData);

  //   localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));

  //   const{ authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);
  //   window.location.href = authUrl;
  // };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".nav-icon-container")) {
        setIsProfileOpen(false);
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex gap-4 items-center xl:gap-6 relative nav-icon-container">
      <FaUser 
        size={24} 
        className="cursor-pointer text-gray-900" 
        onClick={handleProfile} 
      />

      {/* <Image
        src="/profile.png"
        alt="profile"
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
        //onClick={login}
      /> */}

      {isProfileOpen && (
        <div className="absolute top-12 p-4 right-0 text-md rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white min-w-[140px] flex flex-col items-center justify-center z-20">
          <Link href="/profile" onClick={() => setIsProfileOpen(false)}>
            Profile
          </Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? "Logging Out..." : "LogOut"}
          </div>
        </div>
      )}
      {/* <Image
        src="/notification.png"
        alt="notification"
        width={22}
        height={22}
        className="cursor-pointer"
      /> */}

      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <FaShoppingCart size={24} className="text-gray-900" />
        <div className="absolute -top-4 -right-3 bg-black rounded-full w-5 h-5 flex items-center justify-center text-sm text-white">
          {counter}
        </div>
      </div>
      {/* {isCartOpen && <CartModal />} */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default NavIcons;
