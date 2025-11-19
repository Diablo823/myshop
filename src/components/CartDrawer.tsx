"use client";

import React, { useEffect } from "react";
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
  const router = useRouter();

  const showEmptyCart =
    !isLoading && (!cart || !cart.lineItems || cart.lineItems.length === 0);

  const handleCheckout = async () => {
    try {
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
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          open ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-gradient-to-b from-slate-50 to-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={handleDrawerClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {cart?.lineItems?.length || 0} items
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all p-2 rounded-full"
          >
            <FaTimes size={20} />
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
                      className="w-full rounded-xl bg-[#800020] text-slate-100 font-bold hover:bg-[#800023] hover:text-slate-200 hover:scale-105 transition-all duration-300"
                    >
                      View Cart <FaShoppingCart className="ml-2" size={18} />
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      //disabled
                      className="w-full rounded-xl bg-[#FFD700] text-gray-950 font-bold hover:bg-[#FFD700] hover:scale-105 disabled:bg-pink-200 disabled:text-white transition-all duration-300"
                    >
                      Checkout <FaShoppingBag className="ml-2" size={18} />
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
