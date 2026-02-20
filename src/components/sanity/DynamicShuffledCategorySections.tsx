// myshop/src/components/DynamicShuffledCategorySections.tsx
import { getShuffledCategorySections } from '@/lib/shuffledCategorySectionUtils';
import { getShuffledCategoryProducts } from '../multicategory/getShuffledCategoryProducts';
import ProductsList from '../products/ProductsList';

export default async function DynamicShuffledCategorySections() {
    // Fetch all active shuffled category sections from Sanity
    const sections = await getShuffledCategorySections();

    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <>
            {sections.map(async (section) => {
                // Fetch MORE products than limit to create variety
                const fetchLimit = section.limit * 2;
                const fetchPerCategory = section.productsPerCategory * 2;

                const products = await getShuffledCategoryProducts({
                    categoryIds: section.categoryIds,
                    limit: fetchLimit,
                    shuffleCategories: section.shuffleCategories,
                    shuffleProducts: section.shuffleProducts,
                    productsPerCategory: fetchPerCategory,
                    strategy: section.strategy,
                });

                // If no products found, skip this section
                if (!products.length) {
                    return null;
                }

                // Randomly pick products from the larger pool
                const shuffledProducts = section.shuffleProducts
                    ? shuffleArray(products)
                    : products;
                const finalProducts = shuffledProducts.slice(0, section.limit);

                // Create mock data structure to match ProductsList expectations
                const mockData = {
                    items: finalProducts,
                    currentPage: 0,
                    hasNext: () => false
                };

                return (
                    <div key={section._id} className="mt-20 px-1 md:px-8 lg:px-16 xl:px-32">
                        {section.title && (
                            <h2 className="px-3 text-lg md:text-xl font-bold mb-4">
                                {section.title}
                            </h2>
                        )}

                        <ProductsList
                            initialProducts={mockData.items}
                            currentPage={mockData.currentPage}
                            hasMore={false}
                            categoryId=""
                            limit={section.limit}
                            searchParams={{}}
                        />
                    </div>
                );
            })}
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