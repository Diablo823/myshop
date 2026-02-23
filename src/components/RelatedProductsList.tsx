// components/products/RelatedProductsList.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";
import DOMPurify from "isomorphic-dompurify";
import { products } from "@wix/stores";
import { FaArrowDown } from "react-icons/fa";
import ProductCard from "./products/ProductCard";

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
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsList;