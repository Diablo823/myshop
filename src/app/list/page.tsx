// src/app/list/page.tsx

import CategoryListServer from "@/components/CategoryComponent/CategoryListServer";
import Filter from "@/components/Filter";
import ProductWrapper from "@/components/products/ProductWrapper";
import { wixClientServer } from "@/lib/wixClientServer";
import { Metadata } from "next";
import React, { Suspense } from "react";

// CRITICAL: Add timeout config
export const maxDuration = 10;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    cat?: string;
    name?: string;
    type?: string;
    min?: string;
    max?: string;
    sort?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const DEFAULT_OG = "https://uscartel.com/images/og-image.jpg";
  const BASE_URL = "https://www.uscartel.com";

  // ── 1. SEARCH QUERY  →  /list?name=gym ──────────────────────────────
  if (params.name && !params.cat) {
    const titleCased =
      params.name.charAt(0).toUpperCase() + params.name.slice(1);
    return {
      title: `"${titleCased}" – Search Results | US Cartel`,
      description: `Shop search results for "${params.name}" on US Cartel. Browse gadgets, kitchenware, and more.`,
      openGraph: {
        title: `"${titleCased}" – Search Results | US Cartel`,
        description: `Shop search results for "${params.name}" on US Cartel. Browse gadgets, kitchenware, and more.`,
        url: `${BASE_URL}/list?name=${encodeURIComponent(params.name)}`,
        siteName: "US Cartel",
        images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: "US Cartel" }],
        type: "website",
      },
    };
  }

  // ── 2. CATEGORY  →  /list?cat=featured ──────────────────────────────
  if (params.cat) {
    try {
      const wixClient = await wixClientServer();

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("metadata fetch timeout")), 5000)
      );

      const cat = await Promise.race([
        wixClient.collections.getCollectionBySlug(params.cat),
        timeoutPromise,
      ]) as any;

      const categoryName: string = cat?.collection?.name || params.cat;
      const rawImageUrl: string | undefined =
        cat?.collection?.media?.mainMedia?.image?.url;

      // Wix SDK sometimes returns wix:image:// URIs — fall back to default if so
      const ogImage =
        rawImageUrl?.startsWith("https://") ? rawImageUrl : DEFAULT_OG;

      return {
        title: `${categoryName} | US Cartel`,
        description: `Browse ${categoryName} products on US Cartel. Discover the best deals on ${categoryName}.`,
        openGraph: {
          title: `${categoryName} | US Cartel`,
          description: `Browse ${categoryName} products on US Cartel. Discover the best deals on ${categoryName}.`,
          url: `${BASE_URL}/list?cat=${encodeURIComponent(params.cat)}`,
          siteName: "US Cartel",
          images: [{ url: ogImage, width: 800, height: 600, alt: categoryName }],
          type: "website",
        },
      };
    } catch (error) {
      console.error("generateMetadata: collection fetch failed", error);
      // Falls through to the default below
    }
  }

  // ── 3. DEFAULT  →  /list (no params) ────────────────────────────────
  return {
    title: "All Products | US Cartel",
    description:
      "Browse all products on US Cartel. Shop gadgets, kitchenware, and more at great prices.",
    openGraph: {
      title: "All Products | US Cartel",
      description:
        "Browse all products on US Cartel. Shop gadgets, kitchenware, and more at great prices.",
      url: `${BASE_URL}/list`,
      siteName: "US Cartel",
      images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: "US Cartel Products" }],
      type: "website",
    },
  };
}


const ListPage = async ({ searchParams }: {
  searchParams: Promise<{
    cat?: string;
    name?: string;
    type?: string;
    min?: string;
    max?: string;
    sort?: string;
  }>
}) => {

  const params = await searchParams;

  // Clean params object
  const cleanParams = {
    cat: params.cat,
    name: params.name,
    type: params.type,
    min: params.min,
    max: params.max,
    sort: params.sort,
  };

  // Fetch collection with timeout protection
  let cat;
  try {
    const wixClient = await wixClientServer();

    // Add timeout for collection fetch (5 seconds max)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Collection fetch timeout')), 5000)
    );

    const collectionPromise = wixClient.collections.getCollectionBySlug(
      cleanParams.cat || "all-products"
    );

    cat = await Promise.race([collectionPromise, timeoutPromise]) as any;

  } catch (error) {
    console.error('Error fetching collection:', error);
    // Fallback to default collection
    cat = {
      collection: {
        _id: "00000000-000000-000000-000000000001",
        name: cleanParams.cat || "All Products",
      }
    };
  }

  return (
    <>
      <CategoryListServer />
      <div className="px-1 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">

        {/* PRODUCTS - Wrapped in Suspense for streaming */}
        <h1 className="mt-0 px-3 text-lg md:text-2xl font-bold">
          {cat?.collection?.name || "Products"}
        </h1>

        {/* FILTER */}
        <Filter />


        <Suspense fallback={<ProductsLoadingSkeleton />}>
          <ProductWrapper
            categoryId={
              cat.collection?._id || "00000000-000000-000000-000000000001"
            }
            searchParams={cleanParams}
          />
        </Suspense>
      </div>
    </>
  );
};

// Loading skeleton for better UX
function ProductsLoadingSkeleton() {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="group flex flex-col rounded-2xl border bg-slate-50 shadow-sm animate-pulse">
            <div className="relative pb-[120%] w-full overflow-hidden rounded-t-2xl bg-gray-200"></div>
            <div className="flex flex-row justify-between p-2 gap-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListPage;