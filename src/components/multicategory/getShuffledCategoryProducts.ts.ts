import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";

export interface GetMultiCategoryProductsOptions {
  categoryIds: string[];
  limit?: number;
  shuffleCategories?: boolean;
  shuffleProducts?: boolean;
  productsPerCategory?: number;
  strategy?: "round-robin" | "sequential" | "weighted";
}

export async function getShuffledCategoryProducts(
  options: GetMultiCategoryProductsOptions
) {
  const {
    categoryIds,
    limit = 12,
    shuffleCategories = true,
    shuffleProducts = true,
    productsPerCategory = 10,
    strategy = "round-robin",
  } = options;
  try {
    const wixClient = await wixClientServer();

    // Shuffle category order if requested
    const orderedCategoryIds = shuffleCategories
      ? shuffleArray([...categoryIds])
      : categoryIds;

    // Fetch products from all categories
    const categoriesProducts: products.Product[][] = [];

    for (const categoryId of orderedCategoryIds) {
      try {
        const productQuery = wixClient.products
          .queryProducts()
          .eq("collectionIds", categoryId)
          .limit(productsPerCategory);

        const result = await productQuery.find();

        if (result.items.length > 0) {
          // Shuffle products within this category if requested
          const categoryProducts = shuffleProducts
            ? shuffleArray(result.items)
            : result.items;

          categoriesProducts.push(categoryProducts);
        }
      } catch (error) {
        console.error(`Error fetching products from category ${categoryId}:`, error);
        // Continue with other categories even if one fails
      }
    }

    // Mix products based on strategy
    let mixedProducts: products.Product[] = [];

    switch (strategy) {
      case "round-robin":
        mixedProducts = roundRobinMix(categoriesProducts, limit);
        break;
      case "sequential":
        mixedProducts = sequentialMix(categoriesProducts, limit);
        break;
      case "weighted":
        mixedProducts = weightedMix(categoriesProducts, limit);
        break;
      default:
        mixedProducts = roundRobinMix(categoriesProducts, limit);
    }

    // Remove duplicates (in case a product belongs to multiple categories)
    const uniqueProducts = removeDuplicateProducts(mixedProducts);

    // Final shuffle if requested (optional extra shuffle)
    if (shuffleProducts && strategy === "sequential") {
      return shuffleArray(uniqueProducts).slice(0, limit);
    }

    return uniqueProducts.slice(0, limit);
  } catch (error) {
    console.error("Error fetching multi-category products:", error);
    return [];
  }
}

// Round-robin: Take 1 from each category in turn (most balanced)
function roundRobinMix(
  categoriesProducts: products.Product[][],
  limit: number
): products.Product[] {
  const result: products.Product[] = [];
  let index = 0;

  while (result.length < limit) {
    let addedInThisRound = false;

    for (const categoryProducts of categoriesProducts) {
      if (categoryProducts[index]) {
        result.push(categoryProducts[index]);
        addedInThisRound = true;
        if (result.length >= limit) break;
      }
    }

    if (!addedInThisRound) break; // No more products to add
    index++;
  }

  return result;
}

// Sequential: Take all from first category, then second, etc.
function sequentialMix(
  categoriesProducts: products.Product[][],
  limit: number
): products.Product[] {
  const result: products.Product[] = [];

  for (const categoryProducts of categoriesProducts) {
    result.push(...categoryProducts);
    if (result.length >= limit) break;
  }

  return result;
}

// Weighted: Randomly pick from categories (gives more variety)
function weightedMix(
  categoriesProducts: products.Product[][],
  limit: number
): products.Product[] {
  const result: products.Product[] = [];
  const categoryIndices = categoriesProducts.map(() => 0);

  while (result.length < limit) {
    // Find categories that still have products
    const availableCategories = categoriesProducts
      .map((products, idx) => ({
        idx,
        hasProducts: categoryIndices[idx] < products.length,
      }))
      .filter((cat) => cat.hasProducts);

    if (availableCategories.length === 0) break;

    // Randomly pick a category
    const randomCategory =
      availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const categoryIdx = randomCategory.idx;

    result.push(categoriesProducts[categoryIdx][categoryIndices[categoryIdx]]);
    categoryIndices[categoryIdx]++;
  }

  return result;
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

// Helper function to remove duplicate products by ID
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