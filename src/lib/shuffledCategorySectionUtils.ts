// myshop/src/lib/shuffledCategorySectionUtils.ts
import { client } from './sanity';

export interface ShuffledCategorySection {
    _id: string;
    title: string;
    slug: string;
    categoryIds: string[];
    limit: number;
    productsPerCategory: number;
    strategy: 'round-robin' | 'sequential' | 'weighted';
    shuffleCategories: boolean;
    shuffleProducts: boolean;
    isActive: boolean;
    displayOrder: number;
}

/**
 * Fetch all active shuffled category sections from Sanity, ordered by displayOrder
 */
export async function getShuffledCategorySections(): Promise<ShuffledCategorySection[]> {
    try {
        const sections = await client.fetch<ShuffledCategorySection[]>(
            `*[_type == "shuffledCategorySection" && isActive == true] | order(displayOrder asc) {
        _id,
        title,
        "slug": slug.current,
        categoryIds,
        limit,
        productsPerCategory,
        strategy,
        shuffleCategories,
        shuffleProducts,
        isActive,
        displayOrder
      }`
        );
        return sections;
    } catch (error) {
        console.error('Error fetching shuffled category sections:', error);
        return [];
    }
}

/**
 * Fetch a single shuffled category section by slug
 */
export async function getShuffledCategorySectionBySlug(
    slug: string
): Promise<ShuffledCategorySection | null> {
    try {
        const section = await client.fetch<ShuffledCategorySection>(
            `*[_type == "shuffledCategorySection" && slug.current == $slug && isActive == true][0] {
        _id,
        title,
        "slug": slug.current,
        categoryIds,
        limit,
        productsPerCategory,
        strategy,
        shuffleCategories,
        shuffleProducts,
        isActive,
        displayOrder
      }`,
            { slug }
        );
        return section || null;
    } catch (error) {
        console.error('Error fetching shuffled category section by slug:', error);
        return null;
    }
}