// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { wixClientServer } from "@/lib/wixClientServer";

const PRODUCT_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const page = parseInt(searchParams.get('page') || '0');
    
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

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

    const response = await productQuery.find();
    
    return NextResponse.json({
      items: response.items,
      hasNext: response.hasNext(),
      currentPage: page
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}