'use client';

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge"; 
import DOMPurify from "isomorphic-dompurify";

import { products } from "@wix/stores";
import Pagination from "../Pagination";

interface ProductScrollViewProps {
  products: products.Product[];
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  searchParams?: any;
}

const ProductScrollView = ({
  products,
  currentPage,
  hasPrev,
  hasNext,
  searchParams,
}: ProductScrollViewProps) => {
  const calculateDiscount = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div className="mt-6 px-2 py-2 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4">
        {products.map((product: products.Product) => (
          <Link
            href={"/products/" + encodeURIComponent(product.slug || "")}
            className="flex-none w-[15rem] bg-slate-50 rounded-2xl shadow-md hover:shadow-lg"
            key={product._id}
          >
            <div className="relative w-full h-[17rem]">
              {product.priceData?.price !== product.priceData?.discountedPrice && (
                <Badge 
                  className="absolute top-2 right-2 z-20 bg-[#800020] hover:bg-[#800020]"
                >
                  {calculateDiscount(
                    product.priceData?.price || 0,
                    product.priceData?.discountedPrice || 0
                  )}% OFF
                </Badge>
              )}
              <Image
                src={product.media?.mainMedia?.image?.url || "/product.png"}
                alt="product"
                fill
                sizes="25vw"
                loading="lazy"
                className="absolute object-cover hover:scale-105 transition-all duration-300 rounded-t-2xl"
              />
              {/* {product.media?.items && (
                <Image
                  src={product.media?.items[1]?.image?.url || "/product.png"}
                  alt="product"
                  fill
                  sizes="25vw"
                  loading="lazy"
                  className="absolute rounded-2xl object-cover"
                />
              )} */}
            </div>
            <div className="flex flex-row justify-between gap-2 mt-4 p-2">
              <span className="text-sm md:text-base font-bold">
                {product?.name?.length && product.name.length > 20
                  ? `${product.name.substring(0, 25)}...`
                  : product?.name || ""}
              </span>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold">
                  ₹{product.priceData?.discountedPrice}
                </span>
                <span className="text-sm font-bold text-gray-700 line-through">
                  ₹{product.priceData?.price}
                </span>
              </div>
            </div>
            {product.additionalInfoSections && (
              <div
                className="text-md text-gray-700 mt-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    product.additionalInfoSections.find(
                      (section: any) => section.title === "shortDesc"
                    )?.description || ""
                  ),
                }}
              ></div>
            )}
          </Link>
        ))}
      </div>

      {(searchParams?.cat || searchParams?.name) && (
        <Pagination
          currentPage={currentPage || 0}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </div>
  );
};

export default ProductScrollView;