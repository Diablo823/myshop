import { getScrollProducts } from './ProductScrollServer';
import ProductScrollView from './ProductScrollView'; 

interface ProductScrollWrapperProps {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}

export default async function ProductScrollWrapper({
  categoryId,
  limit,
  searchParams
}: ProductScrollWrapperProps) {
  const response = await getScrollProducts({
    categoryId,
    limit,
    searchParams,
  });

  return (
    <ProductScrollView
      products={response.items}
      currentPage={response.currentPage}
      hasPrev={response.hasPrev()}
      hasNext={response.hasNext()}
      searchParams={searchParams}
    />
  );
}
