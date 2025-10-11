// // lib/getRelatedProducts.ts
// import { wixClientServer } from "@/lib/wixClientServer";

// const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e";

// export async function getRelatedProducts(productId: string, limit: number = 6) {
//   const wixClient = await wixClientServer();

//   try {
//     // Get recommendations using Wix's recommendation algorithms
//     const result = await wixClient.recommendations.getRecommendation(
//       [
//         {
//           _id: "68ebce04-b96a-4c52-9329-08fc9d8c1253", // "From similar categories"
//           appId: WIX_STORES_APP_ID,
//         },
//         {
//           _id: "d5aac1e1-2e53-4d11-85f7-7172710b4783", // "Frequently bought together"
//           appId: WIX_STORES_APP_ID,
//         },
//         {
//           _id: "5dd69f67-9ab9-478e-ba7c-10c6c6e7285f", // "Frequently viewed together"
//           appId: WIX_STORES_APP_ID,
//         },
//       ],
//       {
//         items: [
//           {
//             appId: WIX_STORES_APP_ID,
//             catalogItemId: productId,
//           },
//         ],
//         minimumRecommendedItems: limit,
//       }
//     );

//     // Extract product IDs from recommendations
//     const productIds = result.recommendation?.items
//       ?.map((item) => item.catalogItemId)
//       .filter((id): id is string => id !== undefined && id !== productId);

//     if (!productIds || productIds.length === 0) {
//       return [];
//     }

//     // Fetch the actual products
//     const productsResult = await wixClient.products
//       .queryProducts()
//       .in("_id", productIds)
//       .limit(limit)
//       .find();

//     return productsResult.items;
//   } catch (error) {
//     console.error("Error fetching related products:", error);
//     return [];
//   }
// }

// src/lib/getRelatedProducts.ts

import { wixClientServer } from "@/lib/wixClientServer";

const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e";

export async function getRelatedProducts(productId: string, limit: number = 6) {
  const wixClient = await wixClientServer();
  
  try {
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 8000) // 8 second timeout
    );

    const fetchPromise = (async () => {
      // Get recommendations using Wix's recommendation algorithms
      const result = await wixClient.recommendations.getRecommendation(
        [
          {
            _id: "68ebce04-b96a-4c52-9329-08fc9d8c1253", // "From similar categories"
            appId: WIX_STORES_APP_ID,
          },
          {
            _id: "d5aac1e1-2e53-4d11-85f7-7172710b4783", // "Frequently bought together"
            appId: WIX_STORES_APP_ID,
          },
          {
            _id: "5dd69f67-9ab9-478e-ba7c-10c6c6e7285f", // "Frequently viewed together"
            appId: WIX_STORES_APP_ID,
          },
        ],
        {
          items: [
            {
              appId: WIX_STORES_APP_ID,
              catalogItemId: productId,
            },
          ],
          minimumRecommendedItems: limit,
        }
      );

      // Extract product IDs from recommendations
      const productIds = result.recommendation?.items
        ?.map((item) => item.catalogItemId)
        .filter((id): id is string => id !== undefined && id !== productId);

      if (!productIds || productIds.length === 0) {
        return [];
      }

      // Fetch the actual products
      const productsResult = await wixClient.products
        .queryProducts()
        .in("_id", productIds)
        .limit(limit)
        .find();

      return productsResult.items;
    })();

    // Race between fetch and timeout
    return await Promise.race([fetchPromise, timeoutPromise]) as any;

  } catch (error) {
    console.error("Error fetching related products:", error);
    // Return empty array on timeout or error - page will still render
    return [];
  }
}