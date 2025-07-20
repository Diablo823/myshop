"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaShoppingCart, FaUser } from 'react-icons/fa';
import { BiSolidCategory } from "react-icons/bi";
import { RiShoppingCart2Fill, RiShutDownLine } from 'react-icons/ri';
import { HiShoppingCart } from "react-icons/hi";
import { useCartStore } from '@/hooks/useCartStore';
import { useWixClient } from '@/hooks/useWixClient';
import Cookies from "js-cookie";
import { FaStore } from 'react-icons/fa6';

const MobNav = () => {

  const wixClient = useWixClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { cart } = useCartStore();
  const itemCount = cart.lineItems?.length || 0;

  //const isLoggedIn = wixClient.auth.loggedIn();

  useEffect(() => {
      const checkLoginStatus = async () => {
        const status = await wixClient.auth.loggedIn();
        setIsLoggedIn(status);
      }
      checkLoginStatus();
    }, [wixClient])

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     const status = await wixClient.auth.loggedIn();
  //     setIsLoggedIn(status);
  //   }
    
  //   // Check immediately
  //   checkLoginStatus();
    
  //   // Set up an interval to check periodically
  //   const interval = setInterval(checkLoginStatus, 1000);
    
  //   // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, [wixClient])

  const handleProfile = async () => {
    const loginStatus =  await wixClient.auth.loggedIn();
    if (!loginStatus) {
      router.push("/authentication");
    } else {
      router.push('/profile')
    }
  }

  const handleLogout = async () => {    
    try {
      // First, remove the refresh token
      Cookies.remove("refreshToken");
      
      // Get the logout URL
      const { logoutUrl } = await wixClient.auth.logout(window.location.href);
      
      // If we're on the profile page, navigate home first
      if (pathname === '/profile') {
        
        
        // Navigate to home page
        router.push('/');
        
        // Wait a brief moment for the navigation to complete
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Finally, redirect to the Wix logout URL
      window.location.href = logoutUrl;
      setIsLoggedIn(false)
    } catch (error) {
      console.error('Logout error:', error);
        
      // If logout fails, just redirect to home
      router.push('/');
    }
  };


  return (
    <div className={`${pathname === '/success' ? "hidden" : "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-20"}`}>

      <div className="flex items-center justify-around h-16">
        {/* Home */}
        <Link 
          href="/"
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/' ? 'text-yellow-500' : 'text-gray-900'
          }`}
        >
          <FaHome size={22} />
          <span className="text-xs">Home</span>
        </Link>

        {/* Categories */}
        <Link 
          href="/categories" 
          className={`flex flex-col items-center space-y-1 relative ${
            pathname === '/categories' ? 'text-yellow-500' : 'text-gray-900'
          }`}
        >
          
            <BiSolidCategory  size={22} />
          
          <span className="text-xs">Categories</span>
        </Link>

        {/* Deals */}
        <Link 
          href="/deals" 
          className={`flex flex-col items-center space-y-1 relative ${
            pathname === '/deals' ? 'text-yellow-500' : 'text-gray-900'
          }`}
        >
          
            <FaStore  size={22} />
          
          <span className="text-xs">Deals</span>
        </Link>

        
        {/* Cart */}
        <Link 
          href="/cart" 
          className={`flex flex-col items-center space-y-1 relative ${
            pathname === '/cart' ? 'text-yellow-500' : 'text-gray-900'
          }`}
        >
          <div className="relative">
            {/* <RiShoppingCart2Fill size={24} /> */}
            {/* <HiShoppingCart size={24} /> */}
            <FaShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-xs">Cart</span>
        </Link>


        <button
          onClick={handleProfile}
          className={`flex flex-col items-center space-y-1 ${
            pathname === "/authentication" || pathname === "/profile"
              ? "text-yellow-500"
              : "text-gray-900"
          }`}
        >
          <FaUser size={22} />
          <span className="text-xs">Account</span>
        </button>
        {/* <button
          onClick={handleLogout}
          className="flex flex-col items-center space-y-1 text-gray-900 hover:text-red-600 disabled:text-pink-200 disabled:cursor-not-allowed"
          disabled={!isLoggedIn}
        >
          <RiShutDownLine size={24} />
          <span className="text-xs">Logout</span>
        </button> */}
      </div>
    </div>
  );
};

export default MobNav;