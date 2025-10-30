import { wixClientServer } from "@/lib/wixClientServer";

export async function getMultiCategoryProducts(
  categoryIds: string[], 
  excludeProductId?: string,
  shuffle: boolean = true
) {
  try {
    // Add timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000) // 5 second timeout
    );

    const fetchPromise = (async () => {
      const wixClient = await wixClientServer();
      
      let query = wixClient.products
        .queryProducts()
        .hasSome("collectionIds", categoryIds);
      
      if (excludeProductId) {
        query = query.ne("_id", excludeProductId);
      }
      
      const productsResult = await query
        .limit(30)
        .find();

      let finalProducts = productsResult.items;
      
      if (shuffle) {
        finalProducts = shuffleArray([...finalProducts]);
      }
      
      return finalProducts;
    })();

    // Race between fetch and timeout
    return await Promise.race([fetchPromise, timeoutPromise]) as any;

  } catch (error) {
    console.error("Error fetching multi-category products:", error);
    // Return empty array on error - page will still render
    return [];
  }
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}