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
              className="bg-stone-500 hover:bg-stone-600 text-white"
              onClick={() => handleQuantity("d")}
            >
              <FaMinus />
            </Button>
            <span className="font-bold">{stockNumber === 0 ? 0 : quantity}</span>
            <Button
              className="bg-stone-500 hover:bg-stone-600 text-white"
              onClick={() => handleQuantity("i")}
            >
              <FaPlus />
            </Button>
          </div>
        </div>
        <div className="text-sm">
          {/* Only <span className="text-orange-500">{stockNumber}&nbsp;items</span>{" "}
          left! Don't miss it. */}
          {stockNumber === 0 ? (
            <span className="text-red-600 text-sm font-semibold">Out of stock!</span>
          ) : stockNumber > 0 && stockNumber < 7 ? (
            <span className="text-sm font-semibold text-red-500">Only {stockNumber} left!</span>
          ) : (
            <span className="text-sm text-amber-400">In Stock!</span>
          )}
        </div>
      </div>
        
        <div className="flex flex-col gap-4 md:flex-row mt-6 pb-4">
        <Button
          onClick={() => addItem(wixClient, productId, variantId, quantity)}
          disabled={stockNumber === 0}
          className="md:w-1/2 h-10 text-sm font-bold rounded-full bg-emerald-500 text-gray-900 hover:bg-emerald-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white"
          >
          Add To Cart <FaShoppingCart />
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={stockNumber === 0}
          className="md:w-1/2 h-10 text-sm font-bold rounded-full bg-yellow-400 text-gray-900 hover:bg-yellow-600 hover:text-slate-200 disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white"
          >
          Buy Now <FaShoppingBag />
        </Button>
      </div>
        
    </div>
  );
};

export default Add;
