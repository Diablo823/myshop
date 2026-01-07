// src/app/api/analytics/search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

const ANALYTICS_KEY = 'search:analytics';

interface ProductInfo {
    name: string;
    brand?: string;
    slug: string;
}

interface SearchAnalytic {
    count: number;
    lastSearched: string;
    totalResults: number;
    products?: ProductInfo[];
}

export async function POST(request: NextRequest) {
    try {
        const { searchTerm, resultsCount, timestamp, products } = await request.json();

        if (!searchTerm || searchTerm.trim() === '') {
            return NextResponse.json({ error: 'Search term required' }, { status: 400 });
        }

        const normalizedTerm = searchTerm.toLowerCase().trim();
        const termKey = `${ANALYTICS_KEY}:${normalizedTerm}`;

        // Get existing data for this search term
        const existing = await kv.get<SearchAnalytic>(termKey);

        // Store up to 10 product results for reference
        const productInfo: ProductInfo[] = products
            ? products.slice(0, 10).map((p: any) => ({
                name: p.name || 'Unnamed Product',
                brand: p.brand,
                slug: p.slug || p._id,
            }))
            : [];

        if (existing) {
            // Update existing entry
            await kv.set(termKey, {
                count: existing.count + 1,
                lastSearched: timestamp,
                totalResults: Math.round((existing.totalResults + resultsCount) / 2), // Average results
                products: productInfo.length > 0 ? productInfo : existing.products,
            });
        } else {
            // Create new entry
            await kv.set(termKey, {
                count: 1,
                lastSearched: timestamp,
                totalResults: resultsCount,
                products: productInfo,
            });
        }

        // Add to sorted set for quick "top searches" retrieval
        await kv.zincrby('search:popular', 1, normalizedTerm);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Failed to track search' }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Get all search term keys
        const keys = await kv.keys(`${ANALYTICS_KEY}:*`);

        if (!keys || keys.length === 0) {
            return NextResponse.json({ analytics: [] });
        }

        // Fetch all analytics data
        const analyticsPromises = keys.map(async (key) => {
            const data = await kv.get<SearchAnalytic>(key);
            const term = key.replace(`${ANALYTICS_KEY}:`, '');
            return {
                term,
                ...data,
            };
        });

        const analytics = await Promise.all(analyticsPromises);

        // Sort by count (most searched first)
        const sorted = analytics
            .filter(item => item.count !== undefined)
            .sort((a, b) => (b.count || 0) - (a.count || 0));

        return NextResponse.json({ analytics: sorted });
    } catch (error) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}