// // src/components/products/ProductListServer.tsx

// import { wixClientServer } from "@/lib/wixClientServer";

// const PRODUCT_PER_PAGE = 12;

// export async function getProducts({
//   categoryId,
//   limit,
//   page = 0,
//   searchParams,
// }: {
//   categoryId: string;
//   limit?: number;
//   page?: number;
//   searchParams?: any;
// }) {
//   try {
//     const wixClient = await wixClientServer();

//     // Add timeout protection (7 seconds max)
//     const timeoutPromise = new Promise((_, reject) => 
//       setTimeout(() => reject(new Error('Products fetch timeout')), 7000)
//     );

//     const fetchPromise = (async () => {
//       const productQuery = wixClient.products
//         .queryProducts()
//         //@ts-ignore
//         .contains("name", searchParams?.name || "")
//         .eq("collectionIds", categoryId)
//         .hasSome(
//           "productType",
//           searchParams?.type ? [searchParams.type] : ["physical", "digital"]
//         )
//         .gt("priceData.price", searchParams?.min || 0)
//         .lt("priceData.price", searchParams?.max || 999999)
//         .limit(limit || PRODUCT_PER_PAGE)
//         .skip(page * (limit || PRODUCT_PER_PAGE));

//       if (searchParams?.sort) {
//         const [sortType, sortBy] = searchParams.sort.split(" ");

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
//     return await Promise.race([fetchPromise, timeoutPromise]) as any;

//   } catch (error) {
//     console.error("Error fetching products:", error);

//     // Return empty result on timeout/error so page still renders
//     return {
//       items: [],
//       currentPage: 0,
//       hasNext: () => false,
//       hasPrev: () => false,
//       length: 0,
//       pageSize: limit || PRODUCT_PER_PAGE,
//       totalCount: 0,
//       totalPages: 0,
//     };
//   }
// }

// src/components/products/ProductListServer.tsx

import { wixClientServer } from "@/lib/wixClientServer";
import { searchProductsAdvanced } from "@/lib/searchUtils";

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
      const hasSearch = searchParams?.name && searchParams.name.trim() !== "";

      // If there's a search term, fetch more products + collections
      const fetchLimit = hasSearch ? 100 : (limit || PRODUCT_PER_PAGE);
      const skipAmount = hasSearch ? 0 : page * (limit || PRODUCT_PER_PAGE);

      // Fetch collections for category matching
      const collectionsPromise = hasSearch
        ? wixClient.collections.queryCollections().find()
        : Promise.resolve({ items: [] });

      // Build product query with sorting
      const productQuery = wixClient.products
        .queryProducts()
        .eq("collectionIds", categoryId)
        .hasSome(
          "productType",
          searchParams?.type ? [searchParams.type] : ["physical", "digital"]
        )
        .gt("priceData.price", searchParams?.min || 0)
        .lt("priceData.price", searchParams?.max || 999999)
        .limit(fetchLimit)
        .skip(skipAmount);

      // Apply sorting if specified
      if (searchParams?.sort) {
        const [sortType, sortBy] = searchParams.sort.split(" ");

        if (sortType === "asc") {
          //@ts-ignore
          productQuery.ascending(sortBy);
        } else if (sortType === "desc") {
          //@ts-ignore
          productQuery.descending(sortBy);
        }
      }

      const [productResult, collectionsResult] = await Promise.all([
        productQuery.find(),
        collectionsPromise
      ]);

      // Apply advanced search with fuzzy matching and category support
      if (hasSearch) {
        const filteredItems = searchProductsAdvanced(
          productResult.items,
          searchParams.name,
          collectionsResult.items
        );

        // Apply pagination to filtered results
        const startIndex = page * (limit || PRODUCT_PER_PAGE);
        const endIndex = startIndex + (limit || PRODUCT_PER_PAGE);
        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        return {
          ...productResult,
          items: paginatedItems,
          totalCount: filteredItems.length,
          totalPages: Math.ceil(filteredItems.length / (limit || PRODUCT_PER_PAGE)),
          currentPage: page,
          hasNext: () => endIndex < filteredItems.length,
          hasPrev: () => page > 0,
        };
      }

      return productResult;
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