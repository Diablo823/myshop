// components/products/RelatedProductsWrapper.tsx
import { getRelatedProducts } from '@/lib/getRelatedProducts';
import RelatedProductsList from '../RelatedProductsList'; 

interface RelatedProductsWrapperProps {
  productId: string;
  limit?: number;
}

export default async function RelatedProductsWrapper({ 
  productId,
  limit = 6 
}: RelatedProductsWrapperProps) {
  const relatedProducts = await getRelatedProducts(productId, limit);

  // If no related products found, don't render anything
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <RelatedProductsList
      products={relatedProducts}
      limit={limit}
    />
  );
}