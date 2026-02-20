import { getProducts } from './ProductListServer';
import ProductsList from './ProductsList';

interface ProductWrapperProps {
  categoryId: string;
  limit?: number;
  searchParams?: any; // This now receives the resolved params object
  heading?: string;
}

export default async function ProductWrapper({
  categoryId,
  limit,
  searchParams,
  heading
}: ProductWrapperProps) {
  // searchParams is already awaited in the parent component
  const initialData = await getProducts({
    categoryId,
    limit,
    searchParams,
  });

  // Create a search key that changes when search parameters change
  const searchKey = JSON.stringify(searchParams);

  return (
    <>
      <h2 className="px-3 text-lg md:textxl font-bold">{heading || null}</h2>

      <ProductsList
        key={searchKey} // This forces a component remount when search params change
        initialProducts={initialData.items}
        currentPage={initialData.currentPage}
        hasMore={initialData.hasNext()}
        categoryId={categoryId}
        limit={limit}
        searchParams={searchParams}
      />
    </>
  );
}