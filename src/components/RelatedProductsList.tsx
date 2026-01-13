// components/products/RelatedProductsList.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";
import DOMPurify from "isomorphic-dompurify";
import { products } from "@wix/stores";
import { FaArrowDown } from "react-icons/fa";

interface RelatedProductsListProps {
  products: products.Product[];
  limit?: number;
}

const RelatedProductsList = ({
  products: productsList,
  limit,
}: RelatedProductsListProps) => {
  const calculateDiscount = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-1 gap-y-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {productsList.map((product: products.Product) => (
          <Link
            href={"/products/" + encodeURIComponent(product.slug || "")}
            className="group flex flex-col rounded-xl bg-white transition-all"
            key={product._id}
          >
            <div className="relative pb-[120%] w-full overflow-hidden rounded-xl">
              <Badge className="absolute left-2 bottom-2 z-10 bg-pink-900 px-2 text-[10px] text-white hover:bg-pink-900 rounded-md">
                {product.ribbon || null}
              </Badge>
              <Image
                src={product.media?.mainMedia?.image?.url || "/product.png"}
                alt="product"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover hover:scale-105 transition-all duration-300"
              />
              {/* {product.media?.items && (
                <Image
                  src={product.media?.items[1]?.image?.url || "/product.png"}
                  alt="product"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  className="object-cover"
                />
              )} */}
            </div>
            <div className="flex flex-col p-2 gap-y-0.5">
              <span className="text-xs md:text-sm font-bold">
                {product.brand || "--------"}
              </span>
              <span className="text-xs text-gray-600">
                {product?.name?.length && product.name.length > 20
                  ? `${product.name.substring(0, 25)}...`
                  : product?.name || "No Name"}
              </span>
              <div className="flex flex-row gap-2 items-center">
                {product.priceData?.price ===
                  product.priceData?.discountedPrice ? (
                  <span className="text-sm font-bold text-black">
                    ₹{product.priceData?.price}
                  </span>
                ) : (
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-row gap-2 items-center">
                      <span className="font-bold text-sm text-black">
                        ₹{product.priceData?.discountedPrice}
                      </span>
                      <span className="text-sm font-bold text-gray-500 line-through">
                        ₹{product.priceData?.price}
                      </span>
                    </div>
                  </div>
                )}

                {product.priceData?.price !==
                  product.priceData?.discountedPrice && (
                    <div className="flex flex-row items-center gap-1">
                      <span className="text-green-600">
                        <FaArrowDown size={12} />
                      </span>

                      <span className="text-xs font-semibold text-green-600">
                        {calculateDiscount(
                          product.priceData?.price || 0,
                          product.priceData?.discountedPrice || 0
                        )}
                        % OFF
                      </span>
                    </div>
                  )}

              </div>
            </div>
            {product.additionalInfoSections && (
              <div
                className="text-md text-gray-700"
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
    </div>
  );
};

export default RelatedProductsList;