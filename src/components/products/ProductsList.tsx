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

  // Empty state when no products
  if (products.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center min-h-[400px] px-4">
        <div className="relative w-48 h-48 mb-4 opacity-80">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <svg
              className="w-24 h-24 md:w-32 md:h-32 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-500 text-center text-sm max-w-md mb-6">
          We couldn't find any products matching your criteria. Try adjusting your filters or check back later for new arrivals.
        </p>
        <div className="flex gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 bg-black text-sm text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Go Back
          </Link>
          <Link
            href="/categories"
            className="px-6 py-2.5 text-sm border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

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
              <Badge className="absolute right-2 top-2 z-10 bg-blue-100 px-2 py-1 text-xs text-blue-800 hover:bg-blue-100 rounded-lg">
                {product.ribbon || null}
              </Badge>
              <Image
                src={product.media?.mainMedia?.image?.url || "/product.png"}
                alt={product.media?.mainMedia?.image?.altText || "product"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading="lazy"
                className="object-cover hover:scale-105 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col p-2 gap-y-0.5">
              <span className="text-xs md:text-sm font-bold">
                {product.brand || "--------"}
              </span>
              <span className="text-xs text-gray-600">
                {product?.name?.length && product.name.length > 20
                  ? `${product.name.substring(0, 32)}...`
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
              <div className="w-6 h-6 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              <div className="text-black font-semibold text-xs">
                Loading More Products
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsList;