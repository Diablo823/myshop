"use client";

import {
  footLinksCompany,
  footLinksHelp,
  footLinksShop,
  paymentIcons,
  socialIcons,
} from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname(); // Get the current pathname

  // Determine if the current page is a product page
  //const isProductPage = pathname.split('/').length === 2; // Adjust based on your routing structure

  const footRoutes = ['/', '/about', '/contact', '/legal', '/termsandconditions', '/returns', '/shipping', '/partnership'];
  return (
    <div
      className={`${
        footRoutes.includes(pathname)
          ? "px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mt-20 bg-amber-400 text-black rounded-t-3xl"
          : "hidden"
      }`}
    >
      {/* TOP */}
      <div className="flex flex-col md:flex-row justify-between gap-12">
        {/* LEFT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3 mt-5">
            <Image
              src="/logo.png"
              alt="US Cartel"
              width={110}
              height={28}
              className=""
            />
          </Link>

          {/* <h2 className="text-lg font-bold">
           US Cartel
          </h2> */}
          <p className="text-sm font-medium">
           Kerala, India
          </p>
          <span className="text-sm font-semibold">support@uscartel.com</span>
          <span className="text-sm font-semibold">hello@uscartel.com</span>
          {/* <span className="text-sm font-semibold">
            uscartelofficial@gmail.com
          </span>
          <span className="font-semibold">+1 (123) 456-7890</span> */}

          <div className="flex gap-6 mb-8">
            {socialIcons.map((social) => (
              <Link href={social.route} key={social.id}>
              <social.icon key={social.id} size={22} className="cursor-pointer"/>
              </Link>
            ))}
          </div>
        </div>
        {/* CENTER */}
        <div className="hidden lg:flex justify-between w-1/2 mt-5">
          <div className="flex flex-col gap-8">
            <h1 className="text-lg font-semibold">COMPANY</h1>
            <div className="flex flex-col gap-6">
              {footLinksCompany.map((link) => (
                <Link
                  href={link.route}
                  key={link.label}
                  className="text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-lg font-semibold">SHOP</h1>
            <div className="flex flex-col gap-6">
              {footLinksShop.map((link) => (
                <Link
                  href={link.route}
                  key={link.label}
                  className="text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h1 className="text-lg font-semibold">HELP</h1>
            <div className="flex flex-col gap-6">
              {footLinksHelp.map((link) => (
                <Link
                  href={link.route}
                  key={link.label}
                  className="text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-6 mt-5">
          {/* <h1 className="text-xl font-semibold">SUBSCRIBE</h1>
          <p className="text-sm font-medium">
            Be the first to know about the latest trends!
          </p> */}
          {/* <div className="flex gap-2">
            <Input
              type="email"
              placeholder="your-email@gmail.com"
              className="bg-transparent ring-1 ring-slate-500 focus:ring-slate-800 rounded-lg w-3/4"
            />
            <Button className="w-1/4 bg-amber-300 text-black font-semibold text-sm hover:bg-emerald-500">
              JOIN
            </Button>
          </div> */}
          <span className="text-lg font-bold">Secure Payments</span>
          <div className="flex justify-between mb-5">
            {paymentIcons.map((payment) => (
              <payment.icon key={payment.id} size={28}/>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-8 mt-12">
        <div className="text-sm font-bold">
          &copy; 2025 US CARTEL All rights reserved
        </div>
        <div className="flex flex-col gap-4  mb-24 md:mb-2">
          <div className="flex gap-8">
            <span className="text-sm font-semibold ">Language</span>
            <span className="text-sm font-semibold">
              United States | English
            </span>
          </div>
          <div className="flex gap-8">
            <span className="text-sm font-semibold">Currency</span>
            <span className="text-sm font-semibold">₹ INR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
