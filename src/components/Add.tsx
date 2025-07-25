"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { FaMinus, FaPlus, FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { currentCart } from "@wix/ecom";

const Add = ({
  productId,
  variantId,
  stockNumber,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
}) => {
  const wixClient = useWixClient();
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);

  // Temporary
  // const stock = 4;

  const handleQuantity = (type: "d" | "i") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleBuyNow = async () => {
    try {
      // First add to cart
      //await addItem(wixClient, productId, variantId, quantity);

      // Create separate checkout
      const checkout = await wixClient.checkout.createCheckout({
        lineItems: [
          {
            catalogReference: {
              appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
              catalogItemId: productId,
              options: { variantId },
            },
            quantity: quantity,
          },
        ],
        channelType: currentCart.ChannelType.WEB,
      });

      // Handle redirect
      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout._id! },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (error) {
      console.error("Error during buy now:", error);
    }
  };

  // const handleAddToCart = async () => {
  //   const response = await wixClient.currentCart.addToCurrentCart({
  //     lineItems: [
  //       {
  //         catalogReference: {
  //           appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
  //           catalogItemId: productId,
  //           ...(variantId && { options: {variantId}}),
  //         },
  //         quantity: quantity
  //       }
  //     ]
  //   });
  // }

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-between w-36">
            <Button
              className="bg-gray-800 hover:bg-gray-900 text-white rounded-xl"
              onClick={() => handleQuantity("d")}
            >
              <FaMinus />
            </Button>
            <span className="font-bold">
              {stockNumber === 0 ? 0 : quantity}
            </span>
            <Button
              className="bg-gray-800 hover:bg-gray-900 text-white rounded-xl"
              onClick={() => handleQuantity("i")}
            >
              <FaPlus />
            </Button>
          </div>
        </div>

        <div className="text-sm relative">
          {stockNumber === 0 ? (
            <span className="text-red-600 text-sm font-semibold">
              Out of stock!
            </span>
          ) : stockNumber > 0 && stockNumber <= 5 ? (
            <span className="text-sm font-bold text-red-500 flex gap-5 items-center">
              <span className="relative mr-1 bottom-2">
                <span className="absolute inline-flex h-4 w-4 bg-red-500 rounded-full"></span>
                <span className="absolute inline-flex h-4 w-4 bg-red-500 rounded-full opacity-80 animate-ping"></span>
              </span>
              Only {stockNumber} left!
            </span>
          ) : stockNumber > 5 && stockNumber <= 10 ? (
            <span className="text-sm font-bold text-red-500 flex gap-5 items-center">
              <span className="relative mr-1 bottom-2">
                <span className="absolute inline-flex h-4 w-4 bg-red-500 rounded-full"></span>
                <span className="absolute inline-flex h-4 w-4 bg-red-500 rounded-full opacity-80 animate-ping"></span>
              </span>
              Only a few left!
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-800 font-semibold text-center border-2 border-gray-700 p-4 rounded-3xl">
        <span>
          Can't order anything from US Cartel for the time being, Please come
          back after a couple days.
        </span>
        <span>
          We are working hard to bring you the best deals possible, Still then,
          Stay Tuned!
        </span>
      </div>

      <div className="flex flex-col gap-4 md:flex-row mt-6 pb-4">
        <Button
          onClick={() => addItem(wixClient, productId, variantId, quantity)}
          disabled={stockNumber === 0}
          className="md:w-1/2 h-12 text-sm font-extrabold rounded-2xl bg-[#FFD700] text-black hover:bg-[#E6C200] disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white"
        >
          Add To Cart <FaShoppingCart />
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled
          className="md:w-1/2 h-12 text-sm font-extrabold rounded-2xl bg-purple-700 text-slate-100 hover:bg-purple-800 disabled:bg-pink-200 disabled:text-white"
        >
          Buy Now <FaShoppingBag />
        </Button>
      </div>
    </div>
  );
};

export default Add;

//disabled={stockNumber === 0}
