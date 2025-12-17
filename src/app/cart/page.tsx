"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaTrashAlt, FaShoppingBag, FaArrowDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { currentCart } from "@wix/ecom";
import { paymentIcons } from "@/constants";
import { HourglassMediumIcon } from "@phosphor-icons/react";
import { useToast } from "@/hooks/use-toast";

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

const CartPage = () => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const showEmptyCart =
    !isLoading && (!cart || !cart.lineItems || cart.lineItems.length === 0);

  const handleCheckout = async () => {
    try {
      // Check for Out of Stock items
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

  const getSlugFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const onSlugClick = (slug: string) => {
    router.push(`/products/${encodeURIComponent(slug)}`);
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
    <div className="w-full min-h-screen mx-auto px-2 md:px-8 lg:px-16 xl:px-32 py-8 mb-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Shopping Cart</h1>
        <p className="text-sm text-gray-500 mt-1">
          {cart?.lineItems?.length || 0} items in your cart
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : showEmptyCart ? (
        <div className="flex flex-col justify-center items-center h-full text-lg font-bold text-red-900 text-center py-20">
          <div className="mb-5">
            <Image src="/hippocart.webp" alt="" width={260} height={500} />
          </div>
          Your Cart Is Empty! <br />
          Add Something To Your Cart
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 relative">
          {/* Cart Items Section */}
          <div className="flex-grow">
            <div className="space-y-4">
              {cart?.lineItems?.map((item) => {
                const slug = getSlugFromUrl(item.url || "");
                const { size, color } = getVariantInfo(item.descriptionLines!);

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl p-2 border border-gray-100 shadow-md hover:shadow-xl hover:border-gray-200 transition-all duration-200"
                  >
                    <div className="flex flex-row gap-4">
                      {item.image && (
                        <div className="relative shrink-0 w-[100px] h-[120px] md:w-[140px] md:h-[180px] cursor-pointer overflow-hidden rounded-xl">
                          <Image
                            src={wixMedia.getScaledToFillImageUrl(
                              item.image!,
                              140,
                              180,
                              {}
                            )}
                            alt={item.productName?.original || "Product"}
                            fill
                            sizes="(max-width: 768px) 100px, 140px"
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            onClick={() => onSlugClick(slug)}
                          />
                        </div>
                      )}

                      <div className="flex-grow space-y-3">
                        <div className="flex flex-row justify-between gap-2">
                          <div
                            className="cursor-pointer space-y-1"
                            onClick={() => onSlugClick(slug)}
                          >

                            <h3 className="text-xs md:text-sm leading-tight line-clamp-2 font-semibold">
                              {item.productName?.original}
                            </h3>
                          </div>

                          <button
                            onClick={() => removeItem(wixClient, item._id!)}
                            className="text-gray-700 hover:text-red-600 hover:bg-red-50 p-2 h-fit rounded-lg transition-all"
                          >
                            <FaTrashAlt size={18} />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
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
                          <Badge className="h-5 px-2 text-[10px] font-medium rounded-md bg-gray-900 text-white">
                            Qty: {item.quantity}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          {item.fullPrice?.formattedConvertedAmount !==
                            item.price?.formattedConvertedAmount && (
                              <p className="text-sm text-gray-600 font-semibold line-through">
                                {item.fullPrice?.formattedConvertedAmount}
                              </p>
                            )}
                          <p className="text-lg md:text-xl font-bold text-gray-900">
                            {item.price?.formattedConvertedAmount}
                          </p>
                          {item.fullPrice?.formattedConvertedAmount !==
                            item.price?.formattedConvertedAmount && (
                              <div className="flex items-center gap-x-0.5">
                                <FaArrowDown className="text-green-600" size={12} />
                                <span className="text-xs font-bold text-green-600">
                                  {Math.round(
                                    ((parseFloat(item.fullPrice?.amount || "0") -
                                      parseFloat(item.price?.amount || "0")) /
                                      parseFloat(item.fullPrice?.amount || "1")) *
                                    100
                                  )}% OFF
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Summary Section */}
          <div className="w-full lg:w-96 lg:sticky lg:top-4 self-start">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">Subtotal</span>
                  <span className="font-bold text-lg text-gray-900">
                    {(cart as any).subtotal?.formattedConvertedAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">Shipping</span>
                  <span className="text-sm font-semibold text-gray-700">
                    At checkout
                  </span>
                </div>

                <div className="h-px bg-gray-200 my-4" />

                <div className="flex justify-between items-center font-bold text-xl">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    {(cart as any).subtotal?.formattedConvertedAmount}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  //disabled
                  className={`w-full mt-4 rounded-2xl bg-[#FFD700] text-gray-950 font-bold hover:bg-[#FFD700] disabled:bg-pink-200 disabled:text-white hover:scale-105 transition-all duration-300 ${isCheckoutLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isCheckoutLoading ? (
                    <div className="flex flex-row gap-2 justify-center items-center">
                      <span>Checking Out... </span>
                      <span className="animate-spin">
                        <HourglassMediumIcon className="w-5 h-5" />
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-row gap-2 justify-center items-center">
                      <span>Proceed to Checkout</span>
                      <span><FaShoppingBag className="ml-2" /></span>
                    </div>
                  )}
                </Button>

                <p className="text-gray-800 text-center font-medium mt-4 text-xs">
                  🔒 Secure checkout powered by Razorpay
                </p>

                <div className="flex gap-3 justify-center mt-4 pt-2 border-t border-gray-100">
                  {paymentIcons.map((payment) => (
                    <div key={payment.id} className="">
                      <payment.icon size={28} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;