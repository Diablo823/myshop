"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import DOMPurify from "isomorphic-dompurify";
import { products } from "@wix/stores";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import { FaArrowDown } from "react-icons/fa";

interface ProductsListProps {
  initialProducts: products.Product[];
  currentPage: number;
  hasMore: boolean;
  categoryId: string;
  limit?: number;
  searchParams?: any;
}

const ProductsList = ({
  initialProducts,
  currentPage,
  hasMore: initialHasMore,
  categoryId,
  limit,
  searchParams,
}: ProductsListProps) => {
  const [products, setProducts] = useState<products.Product[]>(initialProducts);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const { ref, inView } = useInView();
  const searchParamsObj = useSearchParams();

  // Reset state when search params change
  useEffect(() => {
    setProducts(initialProducts);
    setPage(currentPage);
    setHasMore(initialHasMore);
  }, [initialProducts, currentPage, initialHasMore, searchParamsObj]);

  const calculateDiscount = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  useEffect(() => {
    const loadMoreProducts = async () => {
      if (loading || !hasMore || limit) return;

      try {
        setLoading(true);

        // Construct the query params
        const params = new URLSearchParams({
          categoryId: categoryId,
          page: (page + 1).toString(),
        });

        // Add any additional search params
        if (searchParams) {
          Object.entries(searchParams).forEach(([key, value]) => {
            if (value) params.append(key, value.toString());
          });
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.items?.length > 0) {
          setProducts((prev) => [...prev, ...data.items]);
          setPage((prev) => prev + 1);
          setHasMore(data.hasNext);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading more products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inView && !limit) {
      loadMoreProducts();
    }
  }, [inView, loading, hasMore, page, categoryId, searchParams, limit]);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-1 gap-y-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {products.map((product: products.Product) => (
          <Link
            href={"/products/" + encodeURIComponent(product.slug || "")}
            className="group flex flex-col rounded-lg border bg-white  transition-all"
            key={product._id}
          >
            <div className="relative pb-[120%] w-full overflow-hidden rounded-t-lg">
              <Badge className="absolute right-2 top-2 z-20 bg-blue-100 px-2 py-1 text-xs text-blue-800 hover:bg-blue-100 rounded-lg">
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
      {!limit && hasMore && (
        <div
          ref={ref}
          className="w-full flex items-center justify-center p-1 mt-4"
        >
          {loading && (
            <div className="relative flex flex-col items-center gap-2">
              {/*<div className="animate-pulse relative w-10 h-10">
                   <Image
                    src="https://ik.imagekit.io/5ok2lashts/loadlogo.png?updatedAt=1736980178600" // Replace with your image path
                    alt="Loading animation"
                    fill
                    sizes="(max-width: 768px) 96px, 96px"
                    priority // Since this is a loader, we want it to load immediately
                    className="object-contain"
                  /> 
                </div>*/}
              <div className="w-6 h-6 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              <div className="text-black font-semibold text-xs">
                Loading More Products
              </div>
              {/* <span className="text-xs font-semibold tracking-wide text-gray-800">Loading more...</span> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
