"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FaMinus, FaPlus, FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { useWixClient } from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { currentCart } from "@wix/ecom";
import { EyesIcon, HourglassMediumIcon, ShoppingCartIcon, TrendUpIcon } from "@phosphor-icons/react";
import Link from "next/link";

// Function to generate consistent viewer count based on time window
// const getViewerCount = (productId: string, timeWindowMinutes: number = 5) => {
//   // Get current time rounded to the nearest time window
//   const now = new Date();
//   const timeWindow = Math.floor(now.getTime() / (timeWindowMinutes * 60 * 1000));

//   // Create a seed from productId and timeWindow for consistency
//   const seed = `${productId}-${timeWindow}`;

//   // Simple hash function to generate pseudo-random number from seed
//   let hash = 0;
//   for (let i = 0; i < seed.length; i++) {
//     const char = seed.charCodeAt(i);
//     hash = ((hash << 5) - hash) + char;
//     hash = hash & hash; // Convert to 32-bit integer
//   }

//   // Generate viewer count between 15-85 based on hash
//   const min = 15;
//   const max = 95;
//   const viewerCount = min + (Math.abs(hash) % (max - min + 1));

//   return viewerCount;
// };

const getMonthlyPurchaseCount = (productId: string) => {
  const now = new Date();
  // Create a monthly window based on year and month
  const monthWindow = `${now.getFullYear()}-${now.getMonth()}`;
  const seed = `purchases-${productId}-${monthWindow}`;

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Generate purchase count between 50-500 based on hash
  const min = 125;
  const max = 900;
  const purchaseCount = min + (Math.abs(hash) % (max - min + 1));

  return purchaseCount;
};

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
  const { addItem, cart } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [viewerCount, setViewerCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);

  const itemCount = cart?.lineItems?.length || 0;

  // Temporary
  // const stock = 4;

  // useEffect(() => {
  //   const updateViewers = () => {
  //     setViewerCount(getViewerCount(productId, 5));
  //   };

  //   // Initial update
  //   updateViewers();

  //   // Update every 5 minutes
  //   const interval = setInterval(updateViewers, 5 * 60 * 1000);

  //   return () => clearInterval(interval);
  // }, [productId]);

  // Update purchase count once per month
  useEffect(() => {
    const updatePurchases = () => {
      setPurchaseCount(getMonthlyPurchaseCount(productId));
    };

    updatePurchases();

    // Check for month change every hour
    const interval = setInterval(() => {
      updatePurchases();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [productId]);

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
      setIsLoading(true);
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
      setIsLoading(false);
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

      {/* Stats Display */}
      <div className="flex flex-col gap-2">
        {/* Viewer Count Display */}
        {/* <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-lg w-fit">
          <EyesIcon size={24} className="text-blue-600" />
          <span className="font-semibold">{viewerCount} people</span>
          <span className="text-gray-600">are viewing this product right now</span>
        </div> */}

        {/* Monthly Purchase Count Display */}
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 px-4 py-2 rounded-lg w-fit">
          <TrendUpIcon size={24} className="text-green-600" weight="bold" />
          <span className="font-semibold">{purchaseCount}+ bought this</span>
          <span className="text-gray-600">last month</span>
        </div>

      </div>


      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-between w-36">
            <Button
              className="bg-black text-white rounded-xl"
              onClick={() => handleQuantity("d")}
            >
              <FaMinus />
            </Button>
            <span className="font-bold">
              {stockNumber === 0 ? 0 : quantity}
            </span>
            <Button
              className="bg-black text-white rounded-xl"
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

      {/*<div className="flex flex-col gap-2 text-sm text-white font-semibold text-center border-2 bg-red-600 p-4 rounded-3xl shadow-xl">
        <span>
          Can't order anything from US Cartel for the time being, Please come
          back after a couple days.
        </span>
        <span>
          Currently we are out of stock on all products, We are working hard to bring you the best deals possible, Still then,
          Stay Tuned!
        </span>
      </div>*/}

      {/* {stockNumber > 0 ? (
        <div className="flex flex-col gap-4 md:flex-row mt-6 pb-4">
          <Button
            onClick={() => addItem(wixClient, productId, variantId, quantity)}
            disabled={stockNumber === 0}
            className="md:w-1/2 h-12 text-sm font-extrabold rounded-2xl bg-[#FFD700] text-black hover:bg-[#E6C200] disabled:hidden"
          >
            Add To Cart <FaShoppingCart />
          </Button>
          <Button
            onClick={handleBuyNow}
            disabled={stockNumber === 0}
            //disabled
            className={`md:w-1/2 h-12 text-sm font-extrabold rounded-2xl bg-purple-700 text-slate-100 hover:bg-purple-800 disabled:hidden ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? (
              <div className="flex flex-row gap-2 justify-center items-center">
                <span>Buying Now</span>
                <span className="animate-spin">
                  <HourglassMediumIcon weight="bold" />
                </span>
              </div>
            ) : (
              <div className="flex flex-row gap-2 justify-center items-center">
                <span>Buy Now</span>
                <span><FaShoppingBag /></span>
              </div>
            )}

          </Button>
        </div>
      ) : null} */}

      {stockNumber > 0 ? (
        <>

          <div className="hidden md:flex md:gap-4 md:flex-row md:mt-6 md:pb-4">
            <Button
              onClick={() => addItem(wixClient, productId, variantId, quantity)}
              disabled={stockNumber === 0}
              className="md:w-1/2 h-12 text-sm font-extrabold rounded-2xl bg-[#FFD700] text-black hover:bg-[#E6C200] disabled:hidden"
            >
              Add To Cart <FaShoppingCart />
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={stockNumber === 0}
              className={`md:w-1/2 h-12 text-sm font-extrabold rounded-2xl bg-purple-800 text-slate-100 hover:bg-purple-900 disabled:hidden ${isLoading ? 'opacity-50' : ''}`}
            >
              {isLoading ? (
                <div className="flex flex-row gap-2 justify-center items-center">
                  <span>Buying Now</span>
                  <span className="animate-spin">
                    <HourglassMediumIcon className="w-5 h-5" />
                  </span>
                </div>
              ) : (
                <div className="flex flex-row gap-2 justify-center items-center">
                  <span>Buy Now</span>
                  <span><FaShoppingBag /></span>
                </div>
              )}
            </Button>
          </div>


          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-1 py-1.5 z-20 rounded-t-2xl shadow-xl shadow-black">
            <div className="flex gap-1 max-w-screen-xl mx-auto">
              <Link href="/cart" className="flex flex-col items-center space-y-1 relative">
                <button
                  className="h-12 rounded-xl border border-gray-300 bg-white shadow-sm px-4 flex items-center justify-center hover:bg-gray-50"
                >
                  <div className="relative">
                    <ShoppingCartIcon size={22} weight="bold" className="shrink-0" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </div>
                </button>
              </Link>


              <Button
                onClick={() => addItem(wixClient, productId, variantId, quantity)}
                disabled={stockNumber === 0}
                className="w-1/2 h-12 text-xs font-bold rounded-xl bg-[#FFD700] text-black hover:bg-[#E6C200] disabled:hidden"
              >
                Add To Cart <FaShoppingCart />
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={stockNumber === 0}
                className={`w-1/2 h-12 text-xs font-bold rounded-xl bg-purple-800 text-slate-100 hover:bg-purple-900 disabled:hidden ${isLoading ? 'opacity-50' : ''}`}
              >
                {isLoading ? (
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <span>Buying Now</span>
                    <span className="animate-spin">
                      <HourglassMediumIcon className="w-5 h-5" />
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2 justify-center items-center">
                    <span>Buy Now</span>
                    <span><FaShoppingBag /></span>
                  </div>
                )}
              </Button>
            </div>
          </div>


          <div className="md:hidden h-1"></div>
        </>
      ) : null}


    </div>
  );
};

export default Add;

//disabled={stockNumber === 0}
