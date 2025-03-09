"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaTrashAlt,
  FaTimes,
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
    !isLoading && (!cart.lineItems || cart.lineItems.length === 0);

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

  // Add body scroll lock when drawer is open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = '';
    };
  }, [open]);

  const handleViewCart = () => {
    onClose();
    router.push("/cart");
  };

  // Stop propagation of clicks inside drawer
  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getSlugFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const onSlugClick = (slug: string) => {
    router.push(`/${slug}`);
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
        className={`fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={handleDrawerClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-bold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="hover:text-black text-gray-700 transition-colors"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          {isLoading ? (
            <LoadingSpinner />
          ) : showEmptyCart ? (
            <div className="flex flex-col h-screen justify-center items-center p-6 text-sm font-bold text-red-900 text-center">
              <div className="mb-5">
                <Image src="/empty-cart.png" alt="" width={240} height={520} />
              </div>
              Cart Is Empty! <br />
              Add Something To Your Cart
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 scrollbar-hide bg-white">
                <div className="flex flex-col gap-6 py-6">
                  {cart.lineItems?.map((item) => {
                    const slug = getSlugFromUrl(item.url || "");
                    const { size, color } = getVariantInfo(
                      item.descriptionLines!
                    );
                    return (
                      <div
                        className="flex gap-4 bg-white rounded-lg shadow-lg p-4"
                        key={item._id}
                      >
                        {item.image && (
                          <div className="relative shrink-0 w-[100px] h-[120px] cursor-pointer">
                            <Image
                              src={wixMedia.getScaledToFillImageUrl(
                                item.image!,
                                110,
                                140,
                                {}
                              )}
                              alt={item.productName?.original || "Product"}
                              fill
                              className="object-cover rounded-xl hover:opacity-80 transition-opacity"
                              onClick={() => onSlugClick(slug)}
                            />
                          </div>
                        )}
                        <div className="flex flex-col justify-between w-full">
                          <div>
                            <div className="flex justify-between items-center gap-4">
                              <Link href={`/${slug}`} onClick={onClose}>
                                <h3 className="font-bold text-sm hover:text-blue-600 transition-colors cursor-pointer">
                                  {item.productName?.original?.slice(0, 15)}..
                                </h3>
                              </Link>
                              <div className="flex flex-col">
                                <p className="flex text-sm font-semibold">
                                  {item.price?.formattedConvertedAmount}
                                </p>
                                <p className="flex items-center text-sm font-semibold text-gray-700 line-through">
                                  {item.fullPrice?.formattedConvertedAmount}
                                </p>
                              </div>
                            </div>
                            {/* <div className="text-sm text-gray-900">
                              {item.availability?.status}
                            </div> */}
                            <div className="flex flex-col md:flex-row gap-2">
                              {size && (
                                <Badge
                                  variant="outline"
                                  className="h-5 w-fit rounded-md text-xs bg-purple-100 text-purple-900 border-purple-200"
                                >
                                  Size: {size}
                                </Badge>
                              )}
                              {color && (
                                <Badge
                                  variant="outline"
                                  className="h-5 w-fit rounded-md text-xs bg-blue-100 text-blue-900 border-blue-200"
                                >
                                  {color}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <Badge className="h-5 text-xs font-normal rounded-md bg-black m-1 mt-3 md:mt-0">
                              Quantity: {item.quantity}
                            </Badge>

                            <button
                              onClick={() => removeItem(wixClient, item._id!)}
                              className="text-xl text-red-800 p-2 hover:text-red-600 transition-colors"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t mt-auto p-6 bg-white pb-12">
                <div className="flex items-center justify-between text-lg font-semibold mb-2">
                  <span className="text-lg font-bold">Subtotal:</span>
                  <span className="text-lg font-bold">{(cart as any).subtotal?.formattedConvertedAmount}</span>
                </div>
                <p className="text-gray-800 text-sm mb-4">
                  Shipping &amp; Taxes calculated at checkout
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleViewCart}
                    className="w-full rounded-full bg-[#800020] text-slate-100 font-bold hover:bg-[#800023] hover:text-slate-200"
                  >
                    View Cart <FaShoppingCart className="ml-2" />
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="w-full rounded-full bg-[#FFD700] text-gray-950 font-bold hover:bg-[#FFD700] hover:text-slate-200"
                  >
                    Checkout <FaShoppingBag className="ml-2" />
                  </Button>
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
