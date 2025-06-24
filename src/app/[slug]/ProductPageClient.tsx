"use client";

import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import React from "react";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "@/components/ui/badge";
import ShareUrlButton2 from "@/components/ShareUrlButton2";

interface AdditionalInfoSection {
  title?: string;
  description?: string;
}

interface ProductPageClientProps {
  product: any; // You should type this properly based on your Wix product type
}

const ProductPageClient = ({ product }: ProductPageClientProps) => {
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
      "&amp;",
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

  return (
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

        <ShareUrlButton2
          buttonText="Share this product"
        />

        <div className="h-[2px] bg-gray-100" />

        {product.additionalInfoSections?.map(
          (section: AdditionalInfoSection) => (
            <div className="text-sm" key={section.title}>
              <h4 className="mb-2 font-bold">{section.title}</h4>
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
  );
};

export default ProductPageClient;
