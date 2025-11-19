// import { wixClientServer } from "@/lib/wixClientServer";

// export async function getMultiCategoryProducts(
//   categoryIds: string[], 
//   excludeProductId?: string,
//   shuffle: boolean = true
// ) {
//   try {
//     // Add timeout protection
//     const timeoutPromise = new Promise((_, reject) => 
//       setTimeout(() => reject(new Error('Timeout')), 5000) // 5 second timeout
//     );

//     const fetchPromise = (async () => {
//       const wixClient = await wixClientServer();
      
//       let query = wixClient.products
//         .queryProducts()
//         .hasSome("collectionIds", categoryIds);
      
//       if (excludeProductId) {
//         query = query.ne("_id", excludeProductId);
//       }
      
//       const productsResult = await query
//         .limit(30)
//         .find();

//       let finalProducts = productsResult.items;
      
//       if (shuffle) {
//         finalProducts = shuffleArray([...finalProducts]);
//       }
      
//       return finalProducts;
//     })();

//     // Race between fetch and timeout
//     return await Promise.race([fetchPromise, timeoutPromise]) as any;

//   } catch (error) {
//     console.error("Error fetching multi-category products:", error);
//     // Return empty array on error - page will still render
//     return [];
//   }
// }

// // Helper function to shuffle array
// function shuffleArray<T>(array: T[]): T[] {
//   const shuffled = [...array];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }
//   return shuffled;
// }

import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";

export async function getMultiCategoryProducts(
  categoryIds: string[], 
  excludeProductId?: string,
  shuffle: boolean = true,
  productsPerCategory: number = 15
) {
  try {
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 7000)
    );

    const fetchPromise = (async () => {
      const wixClient = await wixClientServer();
      
      // Shuffle category order first if shuffle is enabled
      const orderedCategoryIds = shuffle ? shuffleArray([...categoryIds]) : categoryIds;
      
      // Fetch products from each category in parallel
      const categoryPromises = orderedCategoryIds.map(async (categoryId) => {
        try {
          const query = wixClient.products
            .queryProducts()
            .eq("collectionIds", categoryId);
          
          if (excludeProductId) {
            query.ne("_id", excludeProductId);
          }
          
          const result = await query.limit(productsPerCategory).find();
          
          // Shuffle products within this category if shuffle is enabled
          return shuffle 
            ? shuffleArray(result.items) 
            : result.items;
        } catch (error) {
          console.error(`Error fetching category ${categoryId}:`, error);
          return []; // Return empty on failure
        }
      });

      const categoriesProducts = await Promise.all(categoryPromises);
      
      // Filter out empty arrays (failed/empty categories)
      const validCategoriesProducts = categoriesProducts.filter(cat => cat.length > 0);
      
      // Mix products from all categories using round-robin
      const mixedProducts = roundRobinMix(validCategoriesProducts);
      
      // Remove duplicates (in case product belongs to multiple categories)
      const uniqueProducts = removeDuplicateProducts(mixedProducts);
      
      // Final shuffle for extra randomness if enabled
      const finalProducts = shuffle 
        ? shuffleArray(uniqueProducts) 
        : uniqueProducts;
      
      return finalProducts;
    })();

    // Race between fetch and timeout
    return await Promise.race([fetchPromise, timeoutPromise]) as any;

  } catch (error) {
    console.error("Error fetching multi-category products:", error);
    return [];
  }
}

// Round-robin: Take 1 product from each category in turn
function roundRobinMix(categoriesProducts: products.Product[][]): products.Product[] {
  const result: products.Product[] = [];
  let index = 0;
  const maxIterations = 100; // Safety limit
  let iterations = 0;

  while (iterations < maxIterations) {
    let addedInThisRound = false;

    for (const categoryProducts of categoriesProducts) {
      if (categoryProducts[index]) {
        result.push(categoryProducts[index]);
        addedInThisRound = true;
      }
    }

    if (!addedInThisRound) break;
    index++;
    iterations++;
  }

  return result;
}

// Remove duplicate products by ID
function removeDuplicateProducts(products: products.Product[]): products.Product[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (!product._id || seen.has(product._id)) {
      return false;
    }
    seen.add(product._id);
    return true;
  });
}

// Helper function to shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}