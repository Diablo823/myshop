import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
//import ProductList from "@/components/ProductList";
//import ProductScroll from "@/components/ProductScroll";
import { wixClientServer } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import React, { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge";
import ProductScrollWrapper from "@/components/ProductScroll/ProductScrollWrapper";
import ProductWrapper from "@/components/products/ProductWrapper";

interface AdditionalInfoSection {
  title?: string;
  description?: string;
}

const SinglePage = async ({ params }: { params: { slug: string } }) => {
  // console.log(params.slug);
  // console.log(params);

  const wixClient = await wixClientServer();

  const products = await wixClient.products
    .queryProducts()
    .eq("slug", params.slug)
    .find();

  if (!products.items[0]) {
    return notFound();
  }

  const product = products.items[0];

  //console.log(product.variants)
  // console.log(JSON.stringify(product.productOptions, null, 2));
  // console.log(JSON.stringify(product.variants, null, 2));

  // Configure DOMPurify once
  // Updated DOMPurify configuration to preserve HTML formatting
  const sanitizeConfig = {
    ALLOWED_TAGS: [
      "p", // paragraphs
      "br", // line breaks
      "b", // bold
      "strong", // strong emphasis
      "i", // italic
      "em", // emphasis
      "u", // underline
      "ul", // unordered list
      "ol", // ordered list
      "li", // list item
      "span", // inline container
      "div", // block container
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6", // headings
    ],
    ALLOWED_ATTR: [
      "style", // inline styles
      "class", // CSS classes
      "id", // Element IDs
      "href", // Links (if you have any)
    ],
  };

  const calculateDiscount = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const productCategoryId = product.collectionIds?.[0];

  return (
    <>
      <div className="min-h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
        {/* IMAGES */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 mt-5 h-max">
          <ProductImages items={product.media?.items!} />
        </div>
        {/* TEXT */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 lg:mt-5">
        {product.brand ? (
            <h2 className="font-semibold tracking-wider text-black">
              {product.brand}
            </h2>
          ) : null}
          <div className="h-[2px] bg-gray-100" />
          <h1 className="text-xl lg:text-2xl font-bold">{product.name}</h1>
          {/* <p className="text-sm text-gray-900">{product.description}</p> */}
          <div
            className="text-sm text-gray-900"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                product.description || "",
                sanitizeConfig
              ),
            }}
          />

          <div className="h-[2px] bg-gray-100" />

          {product.priceData?.price === product.priceData?.discountedPrice ? (
            <h2 className="text-lg font-bold text-black">
              ₹{product.priceData?.price}
            </h2>
          ) : (
            <div className="flex items-center gap-6">
              <h3 className="text-lg font-bold line-through text-gray-700">
                ₹{product.priceData?.price}
              </h3>
              <h3 className="text-xl font-bold text-black">
                ₹{product.priceData?.discountedPrice}
              </h3>
              <Badge className="bg-[#800020] hover:bg-[#800020] text-xs text-white">
                {calculateDiscount(
                  product.priceData?.price || 0,
                  product.priceData?.discountedPrice || 0
                )}
                % OFF
              </Badge>
              <Badge className="bg-rose-900 hover:bg-rose-900 text-xs text-white">
                {product.ribbon}
              </Badge>
            </div>
          )}

          <div className="h-[2px] bg-gray-100" />

          {/* {product.variants && product.productOptions ? (
          <CustomizeProducts
            productId={product._id!}
            variants={product.variants}
            productOptions={product.productOptions}
          />
        ) : (
          <Add
            productId={product._id!}
            variantId="00000000-0000-0000-0000-000000000000"
            stockNumber={product.stock?.quantity || 0}
          />
        )} */}

          {/* NEW COMPONENT MODIFIED FOR OPTIONS AND VARIANTS  */}

          {product.variants &&
          product.variants.length > 0 &&
          product.productOptions &&
          product.productOptions.length > 0 &&
          (product.variants.length > 1 ||
            (product.variants.length === 1 &&
              product.variants[0]._id !==
                "00000000-0000-0000-0000-000000000000")) ? (
            <CustomizeProducts
              productId={product._id!}
              variants={product.variants}
              productOptions={product.productOptions}
            />
          ) : (
            <Add
              productId={product._id!}
              variantId="00000000-0000-0000-0000-000000000000"
              stockNumber={product.stock?.quantity || 0}
            />
          )}

          <div className="h-[2px] bg-gray-100" />

          {/* {product.additionalInfoSections?.map((section: any) => (
            <div className="text-sm" key={section.title}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <p>{section.description}</p>
            </div>
          ))} */}

          {product.additionalInfoSections?.map(
            (section: AdditionalInfoSection) => (
              <div className="text-sm" key={section.title}>
                <h4 className="font-medium mb-2">{section.title}</h4>
                <div
                  className="text-sm text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      section.description || "",
                      sanitizeConfig
                    ),
                  }}
                />
              </div>
            )
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h2 className="text-lg md:text-xl font-bold mt-8">More Picks</h2>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_NEW_ARRIVAL_CATEGORY_ID!}
          limit={4}
        />
      </div>

      {/* SCROLL SECTION */}
      <div className="px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <ProductScrollWrapper
          categoryId={process.env.NEXT_PUBLIC_ALL_PRDUCTS_CATEGORY_ID!}
          limit={16}
        />
      </div>
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h2 className="text-lg md:text-xl font-bold mt-8">More Selections</h2>
        <ProductWrapper
          categoryId={process.env.NEXT_PUBLIC_FEATURED_PRDUCTS_CATEGORY_ID!}
          limit={16}
        />
      </div>

      <h2 className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 text-lg md:text-xl font-bold mt-8">Essentials for you</h2>
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
