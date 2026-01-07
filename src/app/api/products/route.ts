// src/app/api/products/route.ts 1

// import { NextRequest, NextResponse } from 'next/server';
// import { wixClientServer } from "@/lib/wixClientServer";

// const PRODUCT_PER_PAGE = 12;

// // Set timeout for API route
// export const maxDuration = 10;
// export const dynamic = 'force-dynamic';

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const categoryId = searchParams.get('categoryId');
//     const page = parseInt(searchParams.get('page') || '0');

//     if (!categoryId) {
//       return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
//     }

//     // Add timeout protection (8 seconds max for infinite scroll)
//     const timeoutPromise = new Promise((_, reject) => 
//       setTimeout(() => reject(new Error('API timeout')), 8000)
//     );

//     const fetchPromise = (async () => {
//       const wixClient = await wixClientServer();

//       const productQuery = wixClient.products
//         .queryProducts()
//         //@ts-ignore
//         .contains("name", searchParams.get('name') || "")
//         .eq("collectionIds", categoryId)
//         .hasSome(
//           "productType",
//           searchParams.get('type') ? [searchParams.get('type')] : ["physical", "digital"]
//         )
//         .gt("priceData.price", Number(searchParams.get('min')) || 0)
//         .lt("priceData.price", Number(searchParams.get('max')) || 999999)
//         .limit(PRODUCT_PER_PAGE)
//         .skip(page * PRODUCT_PER_PAGE);

//       if (searchParams.get('sort')) {
//         const [sortType, sortBy] = searchParams.get('sort')!.split(" ");
//         if (sortType === "asc") {
//           productQuery.ascending(sortBy);
//         }
//         if (sortType === "desc") {
//           productQuery.descending(sortBy);
//         }
//       }

//       return await productQuery.find();
//     })();

//     // Race between fetch and timeout
//     const response = await Promise.race([fetchPromise, timeoutPromise]) as any;

//     return NextResponse.json({
//       items: response.items,
//       hasNext: response.hasNext(),
//       currentPage: page
//     });

//   } catch (error) {
//     console.error('API Error:', error);

//     // Return empty result on timeout/error so infinite scroll doesn't break
//     return NextResponse.json({ 
//       items: [], 
//       hasNext: false, 
//       currentPage: 0,
//       error: 'Failed to fetch products' 
//     }, { status: 200 }); // Return 200 so client doesn't break
//   }
// }


// src/app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { wixClientServer } from "@/lib/wixClientServer";
import { searchProductsAdvanced } from "@/lib/searchUtils";
import { kv } from '@vercel/kv';

const PRODUCT_PER_PAGE = 12;
const ANALYTICS_KEY = 'search:analytics';

export const maxDuration = 10;
export const dynamic = 'force-dynamic';

// Direct analytics tracking (no HTTP call needed)
async function trackSearchDirect(searchTerm: string, resultsCount: number, products?: any[]) {
  try {
    const normalizedTerm = searchTerm.toLowerCase().trim();
    const termKey = `${ANALYTICS_KEY}:${normalizedTerm}`;

    const productInfo = products
      ? products.slice(0, 10).map((p: any) => ({
        name: p.name || 'Unnamed Product',
        brand: p.brand,
        slug: p.slug || p._id,
      }))
      : [];

    const existing = await kv.get<any>(termKey);

    if (existing) {
      await kv.set(termKey, {
        count: existing.count + 1,
        lastSearched: new Date().toISOString(),
        totalResults: Math.round((existing.totalResults + resultsCount) / 2),
        products: productInfo.length > 0 ? productInfo : existing.products,
      });
    } else {
      await kv.set(termKey, {
        count: 1,
        lastSearched: new Date().toISOString(),
        totalResults: resultsCount,
        products: productInfo,
      });
    }

    await kv.zincrby('search:popular', 1, normalizedTerm);
  } catch (error) {
    console.error('Analytics tracking failed:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '0');
    const searchName = searchParams.get('name') || "";

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('API timeout')), 8000)
    );

    const fetchPromise = (async () => {
      const wixClient = await wixClientServer();

      const hasSearch = searchName.trim() !== "";
      const fetchLimit = hasSearch ? 100 : PRODUCT_PER_PAGE;
      const skipAmount = hasSearch ? 0 : page * PRODUCT_PER_PAGE;

      const collectionsPromise = hasSearch
        ? wixClient.collections.queryCollections().find()
        : Promise.resolve({ items: [] });

      const productQuery = wixClient.products
        .queryProducts()
        .eq("collectionIds", categoryId)
        .hasSome(
          "productType",
          searchParams.get('type') ? [searchParams.get('type')] : ["physical", "digital"]
        )
        .gt("priceData.price", Number(searchParams.get('min')) || 0)
        .lt("priceData.price", Number(searchParams.get('max')) || 999999)
        .limit(fetchLimit)
        .skip(skipAmount);

      if (searchParams.get('sort')) {
        const [sortType, sortBy] = searchParams.get('sort')!.split(" ");
        if (sortType === "asc") {
          //@ts-ignore
          productQuery.ascending(sortBy);
        }
        if (sortType === "desc") {
          //@ts-ignore
          productQuery.descending(sortBy);
        }
      }

      const [productResult, collectionsResult] = await Promise.all([
        productQuery.find(),
        collectionsPromise
      ]);

      if (hasSearch) {
        const filteredItems = searchProductsAdvanced(
          productResult.items,
          searchName,
          collectionsResult.items
        );

        // Track analytics directly using KV (no fetch call)
        await trackSearchDirect(searchName, filteredItems.length, filteredItems);

        const startIndex = page * PRODUCT_PER_PAGE;
        const endIndex = startIndex + PRODUCT_PER_PAGE;
        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        return {
          items: paginatedItems,
          hasNext: endIndex < filteredItems.length,
          currentPage: page,
          totalCount: filteredItems.length,
        };
      }

      return {
        items: productResult.items,
        hasNext: productResult.hasNext(),
        currentPage: page,
        totalCount: productResult.totalCount,
      };
    })();

    const response = await Promise.race([fetchPromise, timeoutPromise]) as any;

    return NextResponse.json({
      items: response.items,
      hasNext: response.hasNext,
      currentPage: response.currentPage,
      totalCount: response.totalCount,
    });

  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json({
      items: [],
      hasNext: false,
      currentPage: 0,
      totalCount: 0,
      error: 'Failed to fetch products'
    }, { status: 200 });
  }
}