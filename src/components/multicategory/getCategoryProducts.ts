import { wixClientServer } from "@/lib/wixClientServer";

export async function getCategoryProducts(categoryId: string, excludeProductId?: string) {
  try {
    const wixClient = await wixClientServer();
    
    let query = wixClient.products
      .queryProducts()
      .eq("collectionIds", categoryId);
    
    // Exclude the current product if provided
    if (excludeProductId) {
      query = query.ne("_id", excludeProductId);
    }
    
    const productsResult = await query
      .limit(20) // Get more than needed for variety
      .find();

    return productsResult.items;
  } catch (error) {
    console.error("Error fetching category products:", error);
    return [];
  }
}