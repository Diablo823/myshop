import { NextRequest, NextResponse } from 'next/server';
import { wixClientServer } from '@/lib/wixClientServer';

// This should be called by a cron job (e.g., Vercel Cron or external service)
// Set up a cron job to hit: https://uscartel.com/api/indexnow/submit-all

export async function GET(request: NextRequest) {
    // Authentication via query parameter (since cron-job.org free doesn't support headers)
    const { searchParams } = new URL(request.url);
    const providedSecret = searchParams.get('secret');
    const CRON_SECRET = process.env.CRON_SECRET || 'your-secret-key'; // Set this in your .env

    if (providedSecret !== CRON_SECRET) {
        return NextResponse.json(
            { error: 'Unauthorized - Invalid or missing secret' },
            { status: 401 }
        );
    }

    try {
        console.log('🔄 Starting IndexNow bulk submission...');

        const wixClient = await wixClientServer();

        // Fetch all products
        const pageSize = 100;
        let allProductUrls: string[] = [];
        let hasMoreItems = true;
        let currentPage = 1;

        while (hasMoreItems) {
            const productsPage = await wixClient.products
                .queryProducts()
                .limit(pageSize)
                .skip((currentPage - 1) * pageSize)
                .find();

            if (productsPage && productsPage.items && productsPage.items.length > 0) {
                const urls = productsPage.items
                    .filter(product => product.slug && product.visible)
                    .map(product => `https://uscartel.com/products/${product.slug}`);

                allProductUrls = [...allProductUrls, ...urls];

                if (productsPage.items.length < pageSize) {
                    hasMoreItems = false;
                } else {
                    currentPage++;
                }
            } else {
                hasMoreItems = false;
            }
        }

        console.log(`📦 Found ${allProductUrls.length} products to submit`);

        if (allProductUrls.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No products found',
            });
        }

        // Submit to IndexNow in batches of 10,000
        const API_KEY = '4090819601ab3b122e621940fc95ed41';
        const HOST = 'uscartel.com';
        const batchSize = 10000;
        let successfulBatches = 0;
        let failedBatches = 0;

        for (let i = 0; i < allProductUrls.length; i += batchSize) {
            const batch = allProductUrls.slice(i, i + batchSize);

            try {
                const response = await fetch('https://api.indexnow.org/indexnow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    body: JSON.stringify({
                        host: HOST,
                        key: API_KEY,
                        keyLocation: `https://${HOST}/${API_KEY}.txt`,
                        urlList: batch,
                    }),
                });

                if (response.ok || response.status === 202) {
                    successfulBatches++;
                    console.log(`✅ Submitted batch ${successfulBatches} (${batch.length} URLs)`);
                } else {
                    failedBatches++;
                    console.error(`❌ Failed to submit batch (status: ${response.status})`);
                }
            } catch (error) {
                failedBatches++;
                console.error('❌ Error submitting batch:', error);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'IndexNow bulk submission completed',
            totalUrls: allProductUrls.length,
            successfulBatches,
            failedBatches,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('❌ IndexNow bulk submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit URLs', details: String(error) },
            { status: 500 }
        );
    }
}