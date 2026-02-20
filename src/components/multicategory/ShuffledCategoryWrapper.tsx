import { getShuffledCategoryProducts } from './getShuffledCategoryProducts';
import ProductsList from '../products/ProductsList';

interface MultiCategoryWrapperProps {
  categoryIds: string[];
  limit?: number;
  shuffleCategories?: boolean;
  shuffleProducts?: boolean;
  productsPerCategory?: number;
  strategy?: "round-robin" | "sequential" | "weighted";
  heading?: string;
}

export default async function ShuffledCategoryWrapper({
  categoryIds,
  limit = 12,
  shuffleCategories = true,
  shuffleProducts = true,
  productsPerCategory = 10,
  strategy = "round-robin",
  heading,
}: MultiCategoryWrapperProps) {
  // Fetch MORE products than limit to create variety
  const fetchLimit = limit * 2; // Fetch double the amount
  const fetchPerCategory = productsPerCategory * 2; // Fetch more per category

  const products = await getShuffledCategoryProducts({
    categoryIds,
    limit: fetchLimit, // Fetch more
    shuffleCategories,
    shuffleProducts,
    productsPerCategory: fetchPerCategory, // Fetch more per category
    strategy,
  });

  // If no products found, return null to hide the section
  if (!products.length) {
    return null;
  }

  // Randomly pick products from the larger pool
  const shuffledProducts = shuffleProducts ? shuffleArray(products) : products;
  const finalProducts = shuffledProducts.slice(0, limit); // Take only what we need

  // Create mock data structure to match ProductsList expectations
  const mockData = {
    items: finalProducts,
    currentPage: 0,
    hasNext: () => false
  };

  return (
    <>
      <h2 className="mt-2 px-3 text-lg md:textxl font-bold">{heading}</h2>
      <ProductsList
        initialProducts={mockData.items}
        currentPage={mockData.currentPage}
        hasMore={false}
        categoryId=""
        limit={limit}
        searchParams={{}}
      />
    </>
  );
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