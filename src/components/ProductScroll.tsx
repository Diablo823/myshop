import Image from "next/image";
import Link from "next/link";
import React from "react";
import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";
import { Badge } from "./ui/badge";

const PRODUCT_PER_PAGE = 20;

const ProductScroll = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const wixClient = await wixClientServer(); 

  const productQuery = wixClient.products
    .queryProducts()
    //@ts-ignore
    .contains("name", searchParams?.name || "")
    .eq("collectionIds", categoryId)
    .hasSome(
      "productType",
      searchParams?.type ? [searchParams.type] : ["physical", "digital"]
    )
    .gt("priceData.price", searchParams?.min || 0)
    .lt("priceData.price", searchParams?.max || 999999)
    .limit(limit || PRODUCT_PER_PAGE)
    .skip(
      searchParams?.page
        ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
        : 0
    );

  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");

    if (sortType === "asc") {
      productQuery.ascending(sortBy);
    }
    if (sortType === "desc") {
      productQuery.descending(sortBy);
    }
  }

  const response = await productQuery.find();

  const calculateDiscount = (originalPrice: number, discountedPrice: number) => {
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div className="mt-12 px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-8">
        {response.items.map((product: products.Product) => (
          <Link
            href={"/" + product.slug}
            className="flex-none w-[15rem]"
            key={product._id}
          >
            <div className="relative w-full h-[17rem]">
            {product.priceData?.price !== product.priceData?.discountedPrice && (
                <Badge 
                  className="absolute top-2 right-2 z-20 bg-amber-300 hover:bg-amber-400"
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
                className="absolute object-cover z-10 rounded-2xl hover:opacity-0 transition-opacity ease-in duration-500"
              />
              {product.media?.items && (
                <Image
                  src={product.media?.items[1]?.image?.url || "/product.png"}
                  alt="product"
                  fill
                  sizes="25vw"
                  className="absolute rounded-2xl object-cover"
                />
              )}
            </div>
            <div className="flex flex-row justify-between gap-2 mt-4">
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

      {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={response.currentPage || 0}
          hasPrev={response.hasPrev()}
          hasNext={response.hasNext()}
        />
      ) : null}
    </div>
  );
};

export default ProductScroll;