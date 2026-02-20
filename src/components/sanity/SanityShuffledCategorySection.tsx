// myshop/src/components/SanityShuffledCategorySection.tsx
import { getShuffledCategorySectionBySlug } from "@/lib/shuffledCategorySectionUtils";
import { getShuffledCategoryProducts } from "../multicategory/getShuffledCategoryProducts";
import ProductsList from '../products/ProductsList';

interface SanityShuffledCategorySectionProps {
    sectionSlug: string;
    // Optional fallbacks if section not found in Sanity
    fallbackCategoryIds?: string[];
    fallbackTitle?: string;
    fallbackLimit?: number;
}

export default async function SanityShuffledCategorySection({
    sectionSlug,
    fallbackCategoryIds,
    fallbackTitle,
    fallbackLimit = 12,
}: SanityShuffledCategorySectionProps) {
    // Fetch the section from Sanity by slug
    const section = await getShuffledCategorySectionBySlug(sectionSlug);

    // Use fallback values if section not found
    const categoryIds = section?.categoryIds || fallbackCategoryIds;
    const title = section?.title || fallbackTitle;
    const limit = section?.limit || fallbackLimit;
    const productsPerCategory = section?.productsPerCategory || 30;
    const strategy = section?.strategy || 'round-robin';
    const shuffleCategories = section?.shuffleCategories ?? true;
    const shuffleProducts = section?.shuffleProducts ?? true;

    // If no category IDs, don't render anything
    if (!categoryIds || categoryIds.length === 0) {
        return null;
    }

    // Fetch MORE products than limit to create variety
    const fetchLimit = limit * 2; // Fetch double the amount
    const fetchPerCategory = productsPerCategory * 2; // Fetch more per category

    const products = await getShuffledCategoryProducts({
        categoryIds,
        limit: fetchLimit,
        shuffleCategories,
        shuffleProducts,
        productsPerCategory: fetchPerCategory,
        strategy,
    });

    // If no products found, return null to hide the section
    if (!products.length) {
        return null;
    }

    // Randomly pick products from the larger pool
    const shuffledProducts = shuffleProducts ? shuffleArray(products) : products;
    const finalProducts = shuffledProducts.slice(0, limit);

    // Create mock data structure to match ProductsList expectations
    const mockData = {
        items: finalProducts,
        currentPage: 0,
        hasNext: () => false
    };

    return (
        <div className="mt-8 px-1 md:px-8 lg:px-16 xl:px-32">
            {title && (
                <h2 className="px-3 text-lg md:text-xl font-bold mb-4">{title}</h2>
            )}

            <ProductsList
                initialProducts={mockData.items}
                currentPage={mockData.currentPage}
                hasMore={false}
                categoryId=""
                limit={limit}
                searchParams={{}}
            />
        </div>
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