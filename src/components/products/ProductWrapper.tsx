import { getProducts } from './ProductListServer';
import ProductsList from './ProductsList'; 

interface ProductWrapperProps {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}

export default async function ProductWrapper({ 
  categoryId,
  limit,
  searchParams 
}: ProductWrapperProps) {
  const initialData = await getProducts({
    categoryId,
    limit,
    searchParams,
  });

  // Create a search key that changes when search parameters change
  const searchKey = JSON.stringify(searchParams);

  return (
    <ProductsList
      key={searchKey} // This forces a component remount when search params change
      initialProducts={initialData.items}
      currentPage={initialData.currentPage}
      hasMore={initialData.hasNext()}
      categoryId={categoryId}
      limit={limit}
      searchParams={searchParams}
    />
  );
}
