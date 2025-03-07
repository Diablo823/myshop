"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { FaTrashAlt, FaShoppingBag } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { currentCart } from "@wix/ecom";
import { paymentIcons } from "@/constants";
import { log } from "util";

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
  const router = useRouter();

  //console.log(cart);
  

  const showEmptyCart =
    !isLoading && (!cart.lineItems || cart.lineItems.length === 0);

  // useEffect(() => {
  //   const getCart = async () => {
  //     const response = await wixClient.currentCart.getCurrentCart();
  //     // Handle response if needed
  //     //console.log(response);
  //   };
  //   getCart();
  // }, [wixClient]);

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

  const getSlugFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const onSlugClick = (slug: string) => {
    router.push(`/${slug}`);
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
    <div className="container h-screen mx-auto px-4 md:px-8 lg:px-16 xl:px-32 py-8 mb-8 bg-slate-50">
      <h1 className="text-xl font-bold mb-8">MY Shopping Cart</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : showEmptyCart ? (
        <div className="flex flex-col justify-center items-center h-full text-lg font-bold text-red-900 text-center">
          <div className="mb-5">
            <Image src="/empty-cart.png" alt="" width={260} height={500} />
          </div>
          Your Cart Is Empty! <br />
          Add Something To Your Cart
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Cart Items Section */}
          <div className="flex-grow">
            <div className="space-y-6">
              {cart.lineItems?.map((item) => {
                const slug = getSlugFromUrl(item.url || "");
                const { size, color } = getVariantInfo(item.descriptionLines!);

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-xl p-4"
                  >
                    <div className="flex flex-row gap-6">
                      {item.image && (
                        <div className="relative shrink-0 w-[100px] h-[120px] md:w-[140px] md:h-[160px] cursor-pointer">
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

                      <div className="flex-grow space-y-4">
                        <div className="flex flex-row justify-between gap-2">
                          <h3
                            className="font-semibold text-lg  hover:text-blue-600 transition-colors cursor-pointer hidden md:block"
                            onClick={() => onSlugClick(slug)}
                          >
                            {item.productName?.original}
                          </h3>
                          <h3
                            className="font-semibold text-sm hover:text-blue-600 transition-colors cursor-pointer block md:hidden"
                            onClick={() => onSlugClick(slug)}
                          >
                            {item.productName?.original?.slice(0, 15)}...
                          </h3>

                          <div className="flex flex-col gap-2">
                            <p className="flex items-center font-semibold text-sm md:text-lg">
                              {item.price?.formattedConvertedAmount}
                            </p>
                            <p className="flex items-center font-semibold text-sm md:text-lg text-gray-700 line-through">
                              {item.fullPrice?.formattedConvertedAmount}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {size && (
                            <Badge
                              variant="outline"
                              className="h-5 rounded-md text-xs bg-purple-100 text-purple-900 border-purple-200"
                            >
                              Size: {size}
                            </Badge>
                          )}
                          {color && (
                            <Badge
                              variant="outline"
                              className="h-5 rounded-md text-xs bg-blue-100 text-blue-900 border-blue-200"
                            >
                              {color}
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center m-1">
                          <Badge className="h-5 p-2 rounded-md text-xs bg-black">
                            Quantity: {item.quantity}
                          </Badge>

                          <button
                            onClick={() => removeItem(wixClient, item._id!)}
                            className="text-xl text-red-800 hover:text-red-600 transition-colors"
                          >
                            <FaTrashAlt size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Summary Section */}
          <div className="w-full lg:w-96 lg:sticky lg:top-4 self-start pb-16">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{(cart as any).subtotal?.formattedConvertedAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹0</span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹0</span>
                </div> */}
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{(cart as any).subtotal?.formattedConvertedAmount}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full mt-4 rounded-full bg-yellow-400 text-gray-950 font-bold hover:bg-yellow-600 hover:text-slate-200"
                >
                  Checkout <FaShoppingBag />
                </Button>
                <p className=" text-gray-600 text-center mt-4">
                  Secure checkout powered by Razorpay
                </p>
                <div className="flex gap-4 justify-center">
                  {paymentIcons.map((payment) => (
                    <payment.icon key={payment.id} size={32}/>
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
