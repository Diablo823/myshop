import { getMultiCategoryProducts } from './getMultiCategoryProducts';
import ProductsList from '../products/ProductsList'; 

interface MultiCategoryRelatedWrapperProps {
  categoryIds: string[]; // Multiple categories
  currentProductId?: string;
  limit?: number;
  shuffle?: boolean; // Mix products from different categories
}

export default async function MultiCategoryRelatedWrapper({ 
  categoryIds,
  currentProductId,
  limit = 6,
  shuffle = true
}: MultiCategoryRelatedWrapperProps) {
  const categoryProducts = await getMultiCategoryProducts(categoryIds, currentProductId, shuffle);

  if (!categoryProducts.length) {
    return null;
  }

  const mockData = {
    items: categoryProducts.slice(0, limit),
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