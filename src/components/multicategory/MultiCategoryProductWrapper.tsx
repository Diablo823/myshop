import { getMultiCategoryProducts } from './getMultiCategoryProducts';
import ProductsList from '../products/ProductsList'; 

interface MultiCategoryRelatedWrapperProps {
  categoryIds: string[];
  currentProductId?: string;
  limit?: number;
  shuffle?: boolean;
  productsPerCategory?: number; // How many to fetch from each category
}

export default async function MultiCategoryRelatedWrapper({ 
  categoryIds,
  currentProductId,
  limit = 12,
  shuffle = true,
  productsPerCategory = 15
}: MultiCategoryRelatedWrapperProps) {
  // Fetch more products than needed for variety
  const categoryProducts = await getMultiCategoryProducts(
    categoryIds, 
    currentProductId, 
    shuffle,
    productsPerCategory
  );

  if (!categoryProducts.length) {
    return null;
  }

  // Take only the limit we need
  const limitedProducts = categoryProducts.slice(0, limit);

  const mockData = {
    items: limitedProducts,
    currentPage: 0,
    hasNext: () => false
  };

  return (
    <ProductsList
      initialProducts={mockData.items}
      currentPage={mockData.currentPage}
      hasMore={false}
      categoryId=""
      limit={limit}
      searchParams={{}}
    />
  );
}