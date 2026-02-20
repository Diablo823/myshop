// components/products/PromotionProductsList.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { products } from "@wix/stores";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import { FaArrowDown } from "react-icons/fa";

interface PromotionProductsListProps {
    initialProducts: products.Product[];
    currentPage: number;
    hasMore: boolean;
    categoryId: string;
    limit?: number;
    searchParams?: any;
}

const PromotionProductsList = ({
    initialProducts,
    currentPage,
    hasMore: initialHasMore,
    categoryId,
    limit,
    searchParams,
}: PromotionProductsListProps) => {
    const [products, setProducts] = useState<products.Product[]>(initialProducts);
    const [page, setPage] = useState(currentPage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const { ref, inView } = useInView();
    const searchParamsObj = useSearchParams();

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

                const params = new URLSearchParams({
                    categoryId: categoryId,
                    page: (page + 1).toString(),
                });

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

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[180px] px-4 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10">
                <div className="relative w-16 h-16 mb-3 opacity-40">
                    <svg
                        className="w-full h-full text-slate-400"
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
                <h4 className="text-sm md:text-base font-semibold text-white mb-1">
                    No Products Available
                </h4>
                <p className="text-slate-400 text-center text-xs md:text-sm max-w-md">
                    Check back soon for exciting deals!
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-0.5">
                {products.map((product: products.Product) => (
                    <Link
                        href={"/products/" + encodeURIComponent(product.slug || "")}
                        className="group flex flex-col rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-amber-500/5 overflow-hidden hover:scale-[1.02] mt-1"
                        key={product._id}
                    >
                        {/* Image Container */}
                        <div className="relative pb-[100%] w-full overflow-hidden bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                            {product.ribbon && (
                                <Badge className="absolute left-1.5 top-1.5 z-10 bg-gradient-to-r from-amber-500 to-amber-600 px-2 py-0.5 text-[8px] md:text-[9px] text-slate-900 font-semibold hover:from-amber-500 hover:to-amber-600 rounded-md border-none shadow-lg">
                                    {product.ribbon}
                                </Badge>
                            )}
                            <Image
                                src={product.media?.mainMedia?.image?.url || "/product.png"}
                                alt={product.media?.mainMedia?.image?.altText || "product"}
                                fill
                                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 15vw"
                                loading="lazy"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Subtle overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col px-1 py-2 gap-y-0 bg-gradient-to-b from-slate-900/40 to-slate-900/60">
                            {/* Brand */}
                            <span className="text-[9px] md:text-[10px] font-semibold truncate text-amber-400/90">
                                {product.brand || "--------"}
                            </span>

                            {/* Product name */}
                            <span className="text-[9px] md:text-[10px] text-slate-300 truncate">
                                {product?.name || "No Name"}
                            </span>

                            {/* Pricing */}
                            <div className="flex flex-col gap-0.5 mt-1 w-full">
                                {product.priceData?.price ===
                                    product.priceData?.discountedPrice ? (
                                    <span className="text-[11px] md:text-xs font-bold text-white">
                                        ₹{product.priceData?.price}
                                    </span>
                                ) : (
                                    <div className="flex flex-row gap-1 items-center">
                                        <span className="font-bold text-[11px] md:text-xs text-white">
                                            ₹{product.priceData?.discountedPrice}
                                        </span>
                                        <span className="text-[9px] md:text-[10px] font-medium text-slate-500 line-through">
                                            ₹{product.priceData?.price}
                                        </span>
                                        {product.priceData?.price !==
                                            product.priceData?.discountedPrice && (
                                                <div className="inline-flex flex-row items-center gap-0.5 py-0.5 w-full">
                                                    <span className="text-emerald-400">
                                                        <FaArrowDown size={8} />
                                                    </span>
                                                    <span className="text-[9px] font-semibold text-emerald-400">
                                                        {calculateDiscount(
                                                            product.priceData?.price || 0,
                                                            product.priceData?.discountedPrice || 0
                                                        )}
                                                        % OFF
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                )}

                                {/* {product.priceData?.price !==
                                    product.priceData?.discountedPrice && (
                                        <div className="inline-flex flex-row items-center gap-1 mt-0.5 px-1.5 py-0.5 bg-emerald-500/15 rounded border border-emerald-500/30 w-fit">
                                            <span className="text-emerald-400">
                                                <FaArrowDown size={7} />
                                            </span>
                                            <span className="text-[8px] md:text-[9px] font-semibold text-emerald-400">
                                                {calculateDiscount(
                                                    product.priceData?.price || 0,
                                                    product.priceData?.discountedPrice || 0
                                                )}
                                                % OFF
                                            </span>
                                        </div>
                                    )} */}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {!limit && hasMore && (
                <div
                    ref={ref}
                    className="w-full flex items-center justify-center p-4 mt-4"
                >
                    {loading && (
                        <div className="relative flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-3 border-slate-700/30 border-t-amber-500 rounded-full animate-spin"></div>
                            <div className="text-slate-300 font-medium text-xs md:text-sm">
                                Loading...
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PromotionProductsList;
