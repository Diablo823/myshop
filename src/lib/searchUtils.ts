// src/lib/searchUtils.ts

import { products, collections } from "@wix/stores";

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[len1][len2];
}

/**
 * Fuzzy match two strings (80% similarity threshold)
 */
function fuzzyMatch(searchWord: string, targetWord: string): boolean {
    const maxLength = Math.max(searchWord.length, targetWord.length);
    const distance = levenshteinDistance(searchWord, targetWord);
    const similarity = 1 - distance / maxLength;
    return similarity >= 0.8;
}

/**
 * Check if search word matches target with fuzzy logic
 */
function wordMatches(searchWord: string, targetText: string): boolean {
    if (targetText.includes(searchWord)) {
        return true;
    }

    const targetWords = targetText.split(/\s+/);
    return targetWords.some(targetWord =>
        targetWord.length > 2 && searchWord.length > 2 && fuzzyMatch(searchWord, targetWord)
    );
}

/**
 * Enhanced search function with fuzzy matching and category support
 */
export function searchProductsAdvanced(
    productList: products.Product[],
    searchTerm: string,
    collections?: collections.Collection[]
): products.Product[] {
    if (!searchTerm || searchTerm.trim() === "") {
        return productList;
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();
    const searchWords = normalizedSearch.split(/\s+/);

    // Wix default collection IDs to exclude
    const EXCLUDED_COLLECTIONS = [
        '00000000-000000-000000-000000000001', // "All Products"
    ];

    const matchingCollectionIds = new Set<string>();
    if (collections) {
        collections.forEach(collection => {
            if (collection._id && EXCLUDED_COLLECTIONS.includes(collection._id)) {
                return;
            }

            const collectionName = (collection.name || "").toLowerCase();
            const collectionDesc = (collection.description || "").toLowerCase();

            const isGenericWord = ['products', 'product', 'items', 'item'].includes(normalizedSearch);

            if (isGenericWord) {
                const nonGenericWords = searchWords.filter(word =>
                    !['products', 'product', 'items', 'item', 'all'].includes(word)
                );

                if (nonGenericWords.length > 0) {
                    const matches = nonGenericWords.some(word =>
                        collectionName.includes(word) ||
                        collectionDesc.includes(word) ||
                        wordMatches(word, collectionName) ||
                        wordMatches(word, collectionDesc)
                    );

                    if (matches && collection._id) {
                        matchingCollectionIds.add(collection._id);
                    }
                }
            } else {
                const matches = searchWords.some(word =>
                    collectionName.includes(word) ||
                    collectionDesc.includes(word) ||
                    wordMatches(word, collectionName) ||
                    wordMatches(word, collectionDesc)
                );

                if (matches && collection._id) {
                    matchingCollectionIds.add(collection._id);
                }
            }
        });
    }

    return productList.filter((product) => {
        if (matchingCollectionIds.size > 0 && product.collectionIds) {
            const hasMatchingCollection = product.collectionIds.some(id =>
                matchingCollectionIds.has(id)
            );
            if (hasMatchingCollection) {
                return true;
            }
        }

        // Extract all alt texts from product images
        const altTexts: string[] = [];

        // Main media alt text
        if (product.media?.mainMedia?.image?.altText) {
            altTexts.push(product.media.mainMedia.image.altText);
        }

        // All other media items alt texts
        if (product.media?.items) {
            product.media.items.forEach(item => {
                if (item.image?.altText) {
                    altTexts.push(item.image.altText);
                }
            });
        }

        // Create searchable text from multiple product fields
        const searchableFields = [
            product.name || "",
            product.brand || "",
            product.description || "",
            product.ribbon || "",
            ...altTexts, // ✅ Added alt texts
            ...(product.additionalInfoSections?.map(s => (s.title || "") + " " + (s.description || "")) || []),
            //@ts-ignore
            ...(product.customTextFields?.map(f => (f.title || "") + " " + (f.value || "")) || []),
        ].join(" ").toLowerCase();

        return searchWords.every(word => wordMatches(word, searchableFields));
    });
}

/**
 * Track search analytics - ONLY RUNS IN BROWSER
 */
export async function trackSearchAnalytics(
    searchTerm: string,
    resultsCount: number,
    products?: any[]
) {
    // Skip if running on server
    if (typeof window === 'undefined') {
        return;
    }

    try {
        await fetch('/api/analytics/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                searchTerm,
                resultsCount,
                products: products || [],
                timestamp: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Analytics tracking failed:', error);
    }
}

/**
 * Get popular searches
 */
export async function getPopularSearches(limit = 5): Promise<string[]> {
    try {
        const response = await fetch(`/api/analytics/popular-searches?limit=${limit}`);
        const data = await response.json();
        return data.searches || [];
    } catch (error) {
        console.error('Failed to get popular searches:', error);
        return [];
    }
}