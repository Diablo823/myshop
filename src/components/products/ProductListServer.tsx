// src/components/products/ProductListServer.tsx

import { wixClientServer } from "@/lib/wixClientServer";

const PRODUCT_PER_PAGE = 12;

export async function getProducts({
  categoryId,
  limit,
  page = 0,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  page?: number;
  searchParams?: any;
}) {
  try {
    const wixClient = await wixClientServer();

    // Add timeout protection (7 seconds max)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Products fetch timeout')), 7000)
    );

    const fetchPromise = (async () => {
      const productQuery = wixClient.products
        .queryProducts()
        //@ts-ignore
        .contains("name", searchParams?.name || "")
        .eq("collectionIds", categoryId)
        .hasSome(
          "productType",
          searchParams?.type ? [searchParams.type] : ["physical", "digital"]
        )
        .gt("priceData.price", searchParams?.min || 0)
        .lt("priceData.price", searchParams?.max || 999999)
        .limit(limit || PRODUCT_PER_PAGE)
        .skip(page * (limit || PRODUCT_PER_PAGE));

      if (searchParams?.sort) {
        const [sortType, sortBy] = searchParams.sort.split(" ");

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
    return await Promise.race([fetchPromise, timeoutPromise]) as any;

  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Return empty result on timeout/error so page still renders
    return {
      items: [],
      currentPage: 0,
      hasNext: () => false,
      hasPrev: () => false,
      length: 0,
      pageSize: limit || PRODUCT_PER_PAGE,
      totalCount: 0,
      totalPages: 0,
    };
  }
}