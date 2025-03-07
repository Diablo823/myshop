import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/WixContext";
import { toast } from "./use-toast";
import { ToastActionElement } from "@/components/ui/toast";

type CartState = {
  cart: currentCart.Cart;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => void;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeItem: (wixClient: WixClient, itemId: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      set({
        cart: cart || [],
        isLoading: false,
        counter: cart?.lineItems?.length || 0,
      });
    } catch (error) {
      console.error("Error getting cart:", error);
      //set({ isLoading: false });
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  addItem: async (wixClient, productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    const response = await wixClient.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
            catalogItemId: productId,
            ...(variantId && { options: { variantId } }),
          },
          quantity: quantity,
        },
      ],
    });

    set({
      cart: response.cart,
      counter: response.cart?.lineItems.length,
      isLoading: false,
    });

    toast({
      title: "Added to cart",
      description: "Product has been added to the cart :)",
    })
  },
  removeItem: async (wixClient, itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
      [itemId]
    );

    set({
      cart: response.cart,
      counter: response.cart?.lineItems.length,
      isLoading: false,
    });
    toast({
      title: "Removed from cart!",
      description: "Product has been removed from the cart :(",
      variant: "destructive"
    })
  },
}));

       

// getCart: async (wixClient) => {
//   const cart = await wixClient.currentCart.getCurrentCart();
//   set({
//     cart: cart || [],
//     isLoading: false,
//     counter: cart?.lineItems.length || 0,
//   });
// },


