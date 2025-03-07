"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { FaShoppingBag, FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { Button } from "./ui/button";
import { useWixClient } from "@/hooks/useWixClient";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";

const CartModal = () => {

  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();
  //console.log(cart);
  

  // TEMPORARY
  //const cartItems = true;

  // useEffect(() => {
  //   getCart(wixClient);
  // }, [wixClient, getCart]);

  // console.log(cart);

  return (
    <div className="absolute w-[24rem] rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 p-4 z-20">
      {isLoading ? (
        <div>Loading...</div>
      ): !cart.lineItems ? (
        <div className="text-xl font-bold text-red-900">
          Cart Is Empty! <br />
          Add Something To Your Cart
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          {/* LIST */}
          {cart.lineItems.map((item) => (
            <div className="flex flex-col gap-8" key={item._id}>
              {/* ITEM */}
              <div className="flex overflow-y-auto gap-4">
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(
                      item.image,
                      82,
                      96,
                      {}
                    )}
                    alt="cart-image"
                    width={82}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-between w-full">
                  {/* TOP */}
                  <div>
                    {/* TITLE */}
                    <div className="flex justify-between items-center gap-8">
                      <h3 className="font-bold text-xl">
                        {item.productName?.original}
                      </h3>
                      <p className="font-semibold bg-gray-50 p-1 rounded-sm">
                      {item.price?.formattedConvertedAmount}
                      </p>
                    </div>
                    {/* DESCRIPTION */}
                    <div className="text-sm text-gray-900">
                      {item.availability?.status}
                    </div>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between">
                    <span className="text-md text-gray-900">
                      Qty: {item.quantity}
                    </span>
                    <button onClick={() => removeItem(wixClient, item._id!)} className="text-xl text-red-800">
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* BOTTOM */}
          <div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal: </span>
              <span>49$</span>
            </div>
            <p className="text-gray-800 mt-2 mb-5">
              Shipping &amp; Taxes calculated at checkout
            </p>

            {/* BUTTONS */}
            <div className="flex justify-between items-center">
              <Link href="/cart">
                <Button className="rounded-full bg-emerald-500 text-gray-950 font-bold hover:bg-emerald-700 hover:text-slate-200">
                  View Cart <FaShoppingCart />
                </Button>
              </Link>
              <Button className="rounded-full bg-yellow-400 text-gray-950 font-bold hover:bg-yellow-600 hover:text-slate-200">
                Checkout <FaShoppingBag />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
