// myshop/src/components/SanityProductSection.tsx - FINAL VERSION
import { getProductSectionBySlug } from '@/lib/productSectionUtils';
import { getProducts } from '../products/ProductListServer';
import ProductsList from '../products/ProductsList';

interface SanityProductSectionProps {
    sectionSlug: string;  // Use slug instead of title
    // Optional fallbacks if section not found in Sanity
    fallbackCategoryId?: string;
    fallbackHeading?: string;
    fallbackLimit?: number;
}

export default async function SanityProductSection({
    sectionSlug,
    fallbackCategoryId,
    fallbackHeading,
    fallbackLimit = 12,
}: SanityProductSectionProps) {
    // Fetch the product section from Sanity by slug
    const section = await getProductSectionBySlug(sectionSlug);

    // Use fallback values if section not found
    const categoryId = section?.categoryId || fallbackCategoryId;
    const heading = section?.title || fallbackHeading;  // ← The heading comes from Sanity's title field!
    const limit = section?.limit || fallbackLimit;

    // If no section and no fallback, don't render anything
    if (!categoryId) {
        return null;
    }

    // Fetch products
    const initialData = await getProducts({
        categoryId,
        limit,
        searchParams: undefined,
    });

    return (
        <div className="mt-8 px-1 md:px-8 lg:px-16 xl:px-32">
            {heading && (
                <h2 className="px-3 text-lg md:text-xl font-bold mb-4">{heading}</h2>
            )}

            <ProductsList
                key={categoryId}
                initialProducts={initialData.items}
                currentPage={initialData.currentPage}
                hasMore={initialData.hasNext()}
                categoryId={categoryId}
                limit={limit}
                searchParams={undefined}
            />
        </div>
    );
}