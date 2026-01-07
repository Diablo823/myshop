// src/app/api/analytics/popular-searches/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '5');

        // Get top N searches from sorted set (highest score first)
        // Using 'rev' to get highest scores first
        const popularTerms = await kv.zrange('search:popular', 0, limit - 1);

        return NextResponse.json({ searches: popularTerms || [] });
    } catch (error) {
        console.error('Popular searches error:', error);
        return NextResponse.json({ searches: [] });
    }
}