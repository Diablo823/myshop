"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaTrashAlt,
  FaTimes,
  FaArrowDown,
} from "react-icons/fa";
import { Button } from "./ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useRouter } from "next/navigation";
import { useWixClient } from "@/hooks/useWixClient";
import LoadingSpinner from "./ui/LoadingSpinner";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { currentCart } from "@wix/ecom";
import { HourglassMediumIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface DescriptionLine {
  name?: {
    original?: string;
  };
  plainText?: {
    original?: string;
  };
  colorInfo?: {
    original?: string;
  };
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // ✅ ADD THIS — resets loading state when user hits back from Wix checkout
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsCheckoutLoading(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const showEmptyCart =
    !isLoading && (!cart || !cart.lineItems || cart.lineItems.length === 0);

  const handleCheckout = async () => {
    try {

      // Check for out of stock items
      const outOfStockItems = cart?.lineItems?.filter((item) => item.quantity === 0);

      if (outOfStockItems && outOfStockItems.length > 0) {
        toast({
          variant: "destructive",
          title: "Some items in your cart has been already Sold Out",
          description: "Please remove them from your cart to proceed to checkout.",
        })
        return;
      }
      setIsCheckoutLoading(true);

      // ─── Meta Pixel: InitiateCheckout ─────────────────────────────────────────
      if (typeof window !== "undefined" && window.fbq) {
        const lineItems = cart?.lineItems ?? [];
        const contentIds = lineItems.map((item: any) => item.catalogReference?.catalogItemId ?? "");
        const numItems = lineItems.reduce((sum: number, item: any) => sum + (item.quantity ?? 1), 0);
        const value = parseFloat(
          (cart as any)?.subtotal?.amount ?? "0"
        );
        window.fbq("track", "InitiateCheckout", {
          content_ids: contentIds,
          content_type: "product",
          num_items: numItems,
          value: value,
          currency: "INR",
        });
      }
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });

      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (error) {
      console.log(error);
      setIsCheckoutLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  const handleViewCart = () => {
    onClose();
    router.push("/cart");
  };

  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getSlugFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const onSlugClick = (slug: string) => {
    router.push(`/products/${encodeURIComponent(slug)}`);
    onClose();
  };

  const getVariantInfo = (descriptionLines: DescriptionLine[]) => {
    if (!descriptionLines) return { size: null, color: null };

    let size: string | null = null;
    let color: string | null = null;

    descriptionLines.forEach((line) => {
      if (line.name?.original?.toLowerCase() === "size") {
        size = line.plainText?.original || null;
      }
      if (line.name?.original?.toLowerCase() === "color") {
        color = line.colorInfo?.original || null;
      }
    });

    return { size, color };
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${open ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-50 to-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${open ? "translate-x-0" : "translate-x-full"
          }`}
        onClick={handleDrawerClick}
      >
        {/* Header */}
        <div className="relative flex justify-between items-center px-6 py-5 overflow-hidden bg-white border-b border-gray-100">

          {/* Subtle decorative gradient blob */}
          <div className="absolute -top-6 -right-10 w-36 h-36 bg-violet-100/60 rounded-full blur-2xl pointer-events-none" />

          {/* Left: Title + badge */}
          <div className="flex items-center gap-3 relative">
            {/* Cart icon box */}
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200">
              <ShoppingCartIcon size={15} className="text-gray-600" />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-wide text-gray-900 leading-tight">
                Shopping Cart
              </h2>
              <p className="text-[11px] text-gray-400 mt-0.5 tracking-wider uppercase">
                {cart?.lineItems?.length || 0} items in bag
              </p>
            </div>

            {/* Item count pill — only shows when cart has items */}
            {(cart?.lineItems?.length ?? 0) > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-violet-100 text-violet-600 border border-violet-200">
                {cart?.lineItems?.length}
              </span>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-xl
               bg-gray-100 border border-gray-200 text-gray-400
               hover:bg-gray-200 hover:text-gray-700
               active:scale-95 transition-all duration-200"
          >
            <FaTimes size={13} />
          </button>
        </div>


        {/* Content */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          {isLoading ? (
            <LoadingSpinner />
          ) : showEmptyCart ? (
            <div className="flex flex-col h-screen justify-center items-center p-6 text-sm font-bold text-red-900 text-center">
              <div className="mb-5">
                <Image src="/hippocart.webp" alt="" width={240} height={520} />
              </div>
              Cart Is Empty! <br />
              Add Something To Your Cart
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-hide">
                <div className="flex flex-col gap-2">
                  {cart?.lineItems?.map((item) => {
                    const slug = getSlugFromUrl(item.url || "");
                    const { size, color } = getVariantInfo(
                      item.descriptionLines!
                    );
                    return (
                      <div
                        className="flex gap-3 bg-white rounded-2xl border border-gray-100 p-2 shadow-md hover:shadow-xl hover:border-gray-200 transition-all duration-200"
                        key={item._id}
                      >
                        {item.image && (
                          <div className="relative shrink-0 w-[90px] h-[110px] cursor-pointer overflow-hidden rounded-xl">
                            <Image
                              src={wixMedia.getScaledToFillImageUrl(
                                item.image!,
                                90,
                                110,
                                {}
                              )}
                              alt={item.productName?.original || "Product"}
                              fill
                              sizes="90px"
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              onClick={() => onSlugClick(slug)}
                            />
                          </div>
                        )}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div className="space-y-1">
                            <Link
                              href={`/products/${encodeURIComponent(
                                slug || ""
                              )}`}
                              onClick={onClose}
                            >
                              <div className="space-y-0.5">
                                <h3 className="text-xs leading-tight line-clamp-2 font-semibold">
                                  {item.productName?.original}
                                </h3>
                              </div>
                            </Link>

                            <div className="flex items-center gap-2 pt-1">
                              {size && (
                                <Badge
                                  variant="outline"
                                  className="h-5 px-2 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 border-indigo-200"
                                >
                                  {size}
                                </Badge>
                              )}
                              {color && (
                                <Badge
                                  variant="outline"
                                  className="h-5 px-2 rounded-md text-[10px] font-medium bg-rose-50 text-rose-700 border-rose-200"
                                >
                                  {color}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {item.fullPrice?.formattedConvertedAmount !==
                                  item.price?.formattedConvertedAmount && (
                                    <p className="text-xs text-gray-700 line-through">
                                      {item.fullPrice?.formattedConvertedAmount}
                                    </p>
                                  )}
                                <p className="text-base font-bold text-gray-900">
                                  {item.price?.formattedConvertedAmount}
                                </p>
                                {item.fullPrice?.formattedConvertedAmount !==
                                  item.price?.formattedConvertedAmount && (
                                    <div className="flex items-center gap-1">
                                      <FaArrowDown
                                        className="text-green-600"
                                        size={14}
                                      />
                                      <span className="text-xs font-bold text-green-600">
                                        {Math.round(
                                          ((parseFloat(
                                            item.fullPrice?.amount || "0"
                                          ) -
                                            parseFloat(
                                              item.price?.amount || "0"
                                            )) /
                                            parseFloat(
                                              item.fullPrice?.amount || "1"
                                            )) *
                                          100
                                        )}
                                        % OFF
                                      </span>
                                    </div>
                                  )}
                              </div>
                              <Badge className="h-5 px-2 text-[10px] font-medium rounded-md bg-gray-900 text-white">
                                Qty: {item.quantity}
                              </Badge>
                            </div>

                            <button
                              onClick={() => removeItem(wixClient, item._id!)}
                              className="text-gray-700 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                            >
                              <FaTrashAlt size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 mt-auto px-4 py-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-800">
                      Subtotal
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {(cart as any).subtotal?.formattedConvertedAmount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-800 font-medium">
                    Shipping &amp; taxes calculated at checkout
                  </p>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <Button
                      onClick={handleViewCart}
                      className="w-full rounded-2xl bg-[#800020] text-white font-bold hover:bg-[#800023] hover:scale-105 transition-all duration-300"
                    >
                      View Cart <FaShoppingCart className="ml-2" size={18} />
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={isCheckoutLoading}  // ✅ actually disables the button
                      className="w-full rounded-2xl bg-[#FFD700] text-gray-950 font-bold 
                                 hover:bg-[#FFD700] hover:scale-105 transition-all duration-300 
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 
                                 disabled:bg-[#FFD700] disabled:text-gray-950"
                    >
                      {isCheckoutLoading ? (
                        <div className="flex flex-row gap-2 justify-center items-center">
                          <span>Checking Out... </span>
                          <span className="animate-spin">
                            <HourglassMediumIcon className="w-5 h-5" />
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-row">
                          <span>Proceed to Checkout</span>
                          <span><FaShoppingBag className="ml-2" /></span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
