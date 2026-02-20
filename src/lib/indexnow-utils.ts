/**
 * IndexNow Utility Functions
 * Use these to automatically notify search engines when content changes
 */

/**
 * Submit a single URL to IndexNow
 */
export async function submitToIndexNow(url: string): Promise<boolean> {
    try {
        const response = await fetch('/api/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                urls: [url],
            }),
        });

        if (response.ok) {
            console.log('✅ IndexNow: URL submitted successfully:', url);
            return true;
        } else {
            console.error('❌ IndexNow: Failed to submit URL:', url);
            return false;
        }
    } catch (error) {
        console.error('❌ IndexNow: Error submitting URL:', error);
        return false;
    }
}

/**
 * Submit multiple URLs to IndexNow (max 10,000 per request)
 */
export async function submitMultipleToIndexNow(urls: string[]): Promise<boolean> {
    try {
        // IndexNow recommends max 10,000 URLs per request
        const batchSize = 10000;
        const batches = [];

        for (let i = 0; i < urls.length; i += batchSize) {
            batches.push(urls.slice(i, i + batchSize));
        }

        let allSuccessful = true;

        for (const batch of batches) {
            const response = await fetch('/api/indexnow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    urls: batch,
                }),
            });

            if (!response.ok) {
                allSuccessful = false;
                console.error(`❌ IndexNow: Failed to submit batch of ${batch.length} URLs`);
            } else {
                console.log(`✅ IndexNow: Submitted batch of ${batch.length} URLs`);
            }
        }

        return allSuccessful;
    } catch (error) {
        console.error('❌ IndexNow: Error submitting URLs:', error);
        return false;
    }
}

/**
 * Submit product URL when a product is added/updated
 */
export async function notifyProductChange(productSlug: string): Promise<boolean> {
    const productUrl = `https://uscartel.com/products/${productSlug}`;
    return submitToIndexNow(productUrl);
}

/**
 * Submit category URL when a category is added/updated
 */
export async function notifyCategoryChange(categorySlug: string): Promise<boolean> {
    const categoryUrl = `https://uscartel.com/list?cat=${categorySlug}`;
    return submitToIndexNow(categoryUrl);
}

/**
 * Batch submit all products (useful for initial setup or bulk updates)
 * This should be called server-side only
 */
export async function submitAllProducts(productSlugs: string[]): Promise<boolean> {
    const urls = productSlugs.map(slug => `https://uscartel.com/products/${slug}`);
    return submitMultipleToIndexNow(urls);
}