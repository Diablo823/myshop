// myshop/src/lib/productSectionUtils.ts - UPDATED VERSION
import { client } from './sanity';

export interface ProductSection {
    _id: string;
    title: string;
    slug: string;
    categoryId: string;
    limit: number;
    isActive: boolean;
    displayOrder: number;
}

/**
 * Fetch all active product sections from Sanity, ordered by displayOrder
 */
export async function getProductSections(): Promise<ProductSection[]> {
    try {
        const sections = await client.fetch<ProductSection[]>(
            `*[_type == "productSection" && isActive == true] | order(displayOrder asc) {
        _id,
        title,
        "slug": slug.current,
        categoryId,
        limit,
        isActive,
        displayOrder
      }`
        );
        return sections;
    } catch (error) {
        console.error('Error fetching product sections:', error);
        return [];
    }
}

/**
 * Fetch a single product section by slug (RECOMMENDED)
 * This allows you to change the title without breaking the code
 */
export async function getProductSectionBySlug(
    slug: string
): Promise<ProductSection | null> {
    try {
        const section = await client.fetch<ProductSection>(
            `*[_type == "productSection" && slug.current == $slug && isActive == true][0] {
        _id,
        title,
        "slug": slug.current,
        categoryId,
        limit,
        isActive,
        displayOrder
      }`,
            { slug }
        );
        return section || null;
    } catch (error) {
        console.error('Error fetching product section by slug:', error);
        return null;
    }
}

/**
 * Fetch a single product section by title (BACKUP METHOD)
 * Use this if you prefer to reference by title instead of slug
 */
export async function getProductSectionByTitle(
    title: string
): Promise<ProductSection | null> {
    try {
        const section = await client.fetch<ProductSection>(
            `*[_type == "productSection" && title == $title && isActive == true][0] {
        _id,
        title,
        "slug": slug.current,
        categoryId,
        limit,
        isActive,
        displayOrder
      }`,
            { title }
        );
        return section || null;
    } catch (error) {
        console.error('Error fetching product section by title:', error);
        return null;
    }
}