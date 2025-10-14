// src/app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { wixClientServer } from "@/lib/wixClientServer";

const PRODUCT_PER_PAGE = 12;

// Set timeout for API route
export const maxDuration = 10;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '0');
    
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Add timeout protection (8 seconds max for infinite scroll)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API timeout')), 8000)
    );

    const fetchPromise = (async () => {
      const wixClient = await wixClientServer();
      
      const productQuery = wixClient.products
        .queryProducts()
        //@ts-ignore
        .contains("name", searchParams.get('name') || "")
        .eq("collectionIds", categoryId)
        .hasSome(
          "productType",
          searchParams.get('type') ? [searchParams.get('type')] : ["physical", "digital"]
        )
        .gt("priceData.price", Number(searchParams.get('min')) || 0)
        .lt("priceData.price", Number(searchParams.get('max')) || 999999)
        .limit(PRODUCT_PER_PAGE)
        .skip(page * PRODUCT_PER_PAGE);

      if (searchParams.get('sort')) {
        const [sortType, sortBy] = searchParams.get('sort')!.split(" ");
        if (sortType === "asc") {
          productQuery.ascending(sortBy);
        }
        if (sortType === "desc") {
          productQuery.descending(sortBy);
        }
      }

      return await productQuery.find();
    })();

    // Race between fetch and timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]) as any;
    
    return NextResponse.json({
      items: response.items,
      hasNext: response.hasNext(),
      currentPage: page
    });

  } catch (error) {
    console.error('API Error:', error);
    
    // Return empty result on timeout/error so infinite scroll doesn't break
    return NextResponse.json({ 
      items: [], 
      hasNext: false, 
      currentPage: 0,
      error: 'Failed to fetch products' 
    }, { status: 200 }); // Return 200 so client doesn't break
  }
}