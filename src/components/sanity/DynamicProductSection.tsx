// myshop/src/components/DynamicProductSections.tsx
import { getProductSections } from '@/lib/productSectionUtils';
import { getProducts } from '../products/ProductListServer';
import ProductsList from '../products/ProductsList';
export default async function DynamicProductSections() {
    // Fetch all active product sections from Sanity
    const sections = await getProductSections();

    if (!sections || sections.length === 0) {
        return null;
    }

    return (
        <>
            {sections.map(async (section: any) => {
                // Fetch products for this section
                const initialData = await getProducts({
                    categoryId: section.categoryId,
                    limit: section.limit,
                    searchParams: undefined, // Not using search params for these sections
                });

                return (
                    <div key={section._id} className="mt-20 px-1 md:px-8 lg:px-16 xl:px-32">
                        {section.title && (
                            <h2 className="px-3 text-lg md:text-xl font-bold mb-4">
                                {section.title}
                            </h2>
                        )}

                        <ProductsList
                            key={section.categoryId}
                            initialProducts={initialData.items}
                            currentPage={initialData.currentPage}
                            hasMore={initialData.hasNext()}
                            categoryId={section.categoryId}
                            limit={section.limit}
                            searchParams={undefined}
                        />
                    </div>
                );
            })}
        </>
    );
}