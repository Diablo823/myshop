import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import React from "react";
import ProductPageClient from "./ProductPageClient";
import ProductScrollWrapper from "@/components/ProductScroll/ProductScrollWrapper";
import ProductWrapper from "@/components/products/ProductWrapper";

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  const wixClient = await wixClientServer();

  const decodedSlug = decodeURIComponent(params.slug)
  
  const products = await wixClient.products
    .queryProducts()
    .eq("slug", decodedSlug)
    .find();

  if (!products.items[0]) {
    return notFound();
  }

  const product = products.items[0];

  return (
    <>
      {/* Client Component for main product display */}
      <ProductPageClient product={product} />
      
      {/* Server Components for product recommendations */}
      <div className="px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h2 className="text-lg md:text-xl font-bold mt-8">More Picks</h2>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID!}
          limit={4}
        />
      </div>

      {/* SCROLL SECTION */}
      <div className="px-2 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <ProductScrollWrapper
          categoryId={process.env.NEXT_PUBLIC_ALL_PRDUCTS_CATEGORY_ID!}
          limit={16}
        />
      </div>
      <div className="px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h2 className="text-lg md:text-xl font-bold mt-8">More Selections</h2>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_FEATURED_PRDUCTS_CATEGORY_ID!}
          limit={16}
        />
      </div>

      <h2 className="px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64 text-lg md:text-xl font-bold mt-8">Essentials for you</h2>
      <div className="px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <ProductScrollWrapper
          categoryId={process.env.NEXT_PUBLIC_ESSENTIAL_PRODUCTS_CATEGORY_ID!}
          limit={20}
        />
      </div>
    </>
  );
};

export default SinglePage;