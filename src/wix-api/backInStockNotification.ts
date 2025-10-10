// backInStockNotifications.ts - Client-side version

import { findVariant } from "@/lib/utils";
import { products } from "@wix/stores";
import { WixClient } from "@/context/WixContext";
import { NEXT_PUBLIC_WIX_APP_ID_BACK_IN_STOCK_NOTIFICATIONS } from "@/constants";

export interface BackInStockNotifcationRequestValues {
  email: string;
  itemUrl: string;
  product: products.Product;
  selectedOptions: Record<string, string>;
}

export async function createBackInStockNotificationRequest(
  wixClient: WixClient,
  {
    email,
    itemUrl,
    product,
    selectedOptions,
  }: BackInStockNotifcationRequestValues
) {
  const selectedVariant = findVariant(product, selectedOptions);

  const catalogReference = {
    appId: NEXT_PUBLIC_WIX_APP_ID_BACK_IN_STOCK_NOTIFICATIONS,
    catalogItemId: product._id,
    ...(selectedVariant
      ? {
          options: {
            variantId: selectedVariant._id,
          }
        }
      : {
          options: selectedOptions
        }
    ),
  };

  const productInfo = {
    name: product.name || undefined,
    price: product.priceData?.discountedPrice?.toFixed(2),
    image: product.media?.mainMedia?.image?.url || undefined,
  };

  console.log("Client-side request");
  console.log("Catalog Reference:", catalogReference);
  console.log("Product Info:", productInfo);

  try {
    const result = await wixClient.backInStockNotifications.createBackInStockNotificationRequest(
      {
        email,
        itemUrl,
        catalogReference,
      },
      productInfo
    );
    
    return result;
  } catch (error) {
    console.error("Client-side error:", error);
    throw error;
  }
}