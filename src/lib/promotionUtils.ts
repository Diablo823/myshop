// lib/promotionUtils.ts
import { client } from './sanity';

export interface SanityPromotion {
    _id: string;
    name: string;
    title: string;
    description: string;
    saleStartDate: string;
    productSectionSlug?: string; // Add this field
    isActive: boolean;
}

// Get promotion by name
export async function getPromotionByName(name: string): Promise<SanityPromotion | null> {
    try {
        const promotion = await client.fetch(
            `*[_type == "promotion" && name == $name && isActive == true][0] {
                _id,
                name,
                title,
                description,
                saleStartDate,
                productSectionSlug,
                isActive
            }`,
            { name }
        );
        return promotion || null;
    } catch (error) {
        console.error('Error fetching promotion by name:', error);
        return null;
    }
}

// Get all active promotions (optional - if you need it)
export async function getActivePromotions(): Promise<SanityPromotion[]> {
    try {
        const promotions = await client.fetch(
            `*[_type == "promotion" && isActive == true] {
                _id,
                name,
                title,
                description,
                saleStartDate,
                productSectionSlug,
                isActive
            }`
        );
        return promotions;
    } catch (error) {
        console.error('Error fetching active promotions:', error);
        return [];
    }
}
