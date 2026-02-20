// components/SanityPromotion.tsx
import { getPromotionByName } from "@/lib/promotionUtils";
import { getProductSectionBySlug } from '@/lib/productSectionUtils';
import { getProducts } from '../products/ProductListServer';
import PromotionProductsList from '../products/PromotionProductsList'; // Changed import
import Promotion from "../Promotion";

interface SanityPromotionProps {
    promotionName: string;
    className?: string;
    fallbackTitle?: string;
    fallbackDescription?: string;
    fallbackStartDate?: string;
    fallbackDays?: number;
    fallbackProductSectionSlug?: string;
}

export default async function SanityPromotion({
    promotionName,
    className = "",
    fallbackTitle,
    fallbackDescription,
    fallbackStartDate,
    fallbackDays,
    fallbackProductSectionSlug,
}: SanityPromotionProps) {
    const promotion = await getPromotionByName(promotionName);

    // Determine which values to use
    let title, description, startDate, days, productSectionSlug;

    if (!promotion) {
        // Use fallbacks if no promotion found
        if (!fallbackTitle || !fallbackDescription || !fallbackStartDate || fallbackDays === undefined) {
            return null;
        }
        title = fallbackTitle;
        description = fallbackDescription;
        startDate = fallbackStartDate;
        days = fallbackDays;
        productSectionSlug = fallbackProductSectionSlug;
    } else {
        // Use promotion data from Sanity
        title = promotion.title;
        description = promotion.description;
        startDate = promotion.saleStartDate;
        days = 0; // Count down to start date
        productSectionSlug = promotion.productSectionSlug;
    }

    // Fetch product section and products if slug exists
    let productsContent = null;

    if (productSectionSlug) {
        const section = await getProductSectionBySlug(productSectionSlug);

        if (section?.categoryId) {
            const initialData = await getProducts({
                categoryId: section.categoryId,
                limit: section.limit || 12,
                searchParams: undefined,
            });

            productsContent = (
                <div>
                    {/* {section.title && (
                        <h4 className="text-base md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4">
                            {section.title}
                        </h4>
                    )} */}
                    <PromotionProductsList
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
        }
    }

    return (
        <Promotion
            startDate={startDate}
            days={days}
            title={title}
            description={description}
            className={className}
        >
            {productsContent}
        </Promotion>
    );
}
