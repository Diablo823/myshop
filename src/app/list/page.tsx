// src/app/list/page.tsx

import Filter from "@/components/Filter";
import ProductWrapper from "@/components/products/ProductWrapper";
import SanityBanner from "@/components/SanityBanner";
import { Button } from "@/components/ui/button";
import { wixClientServer } from "@/lib/wixClientServer";
import Image from "next/image";
import React, { Suspense } from "react";
import { FaShoppingBag } from "react-icons/fa";

// CRITICAL: Add timeout config
export const maxDuration = 10;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <div className="px-1 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden">
      {/* CAMPAIGN
      <div className="bg-pink-100 flex justify-between px-4 h-64 mt-5 rounded-2xl">
        TEXT CONTAINER
        <div className="w-2/3 flex flex-col justify-center md:items-center md:text-center gap-6">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-950 leading-[38px] md:leading-[48px]">
            Get the Best Deals on {" "}
            <span className="hidden md:inline">
              <br />
            </span>
            selected products
          </h1>
          <Button className="rounded-full w-max text-md md:font-bold bg-amber-300 hover:bg-emerald-300 text-black">
            <span className="font-bold">Buy Now</span>
            <FaShoppingBag />
          </Button>
        </div>
        MAGE CONTAINER
        <div className="w-1/3 relative">
          <Image
            src="https://ik.imagekit.io/5ok2lashts/US%20CARTEL/campaign1.png?updatedAt=1741333459170"
            alt="campaign"
            fill
            sizes="25vw"
            className="object-contain"
          />
        </div>
      </div> */}
      {/* <div className="mt-3">
        <SanityBanner bannerName="dealbanner1"
          height="h-[12rem] md:h-[24rem]"
        />
      </div>
 */}
      {/* PRODUCTS - Wrapped in Suspense for streaming */}
      <h1 className="mt-6 px-3 text-lg md:text-2xl font-bold">
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