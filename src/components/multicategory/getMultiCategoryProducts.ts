import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";

export async function getMultiCategoryProducts(
  categoryIds: string[], 
  excludeProductId?: string,
  shuffle: boolean = true
) {
  try {
    const wixClient = await wixClientServer();
    
    let query = wixClient.products
      .queryProducts()
      .hasSome("collectionIds", categoryIds); // Products that belong to ANY of these categories
    
    // Exclude the current product if provided
    if (excludeProductId) {
      query = query.ne("_id", excludeProductId);
    }
    
    const productsResult = await query
      .limit(30) // Get more for shuffling
      .find();

    let finalProducts = productsResult.items;

    // Shuffle the results if requested
    if (shuffle) {
      finalProducts = shuffleArray([...finalProducts]);
    }

    return finalProducts;
  } catch (error) {
    console.error("Error fetching multi-category products:", error);
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